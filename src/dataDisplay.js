import React, { Component } from "react";

import TeacherTable from "./tableTeachers.js";
import StudentTable from "./tableStudents.js";
import CoursesTable from "./tableCourses.js";

import "./dataDisplay.css";
import "./tableCustom.css";

class DataDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            privilege: "STUDENT",
            teachers: [],
            students: [],
            classes: []
        }
    }

    componentDidMount() {
        this.GetPrivilege();
        this.GetTeachers();
        this.GetStudents();

        this.props.database.collection("Teachers").onSnapshot(querySnapshot => {
            let teacherDatabase = [];

            querySnapshot.forEach(function (doc) {
                const teacher = doc.data()
                teacher.id = doc.id;
                teacherDatabase.push(teacher);
            });
            this.setState({
                teachers: teacherDatabase
            }, () => this.GetClasses())
        });
        this.props.database.collection("Students").onSnapshot(querySnapshot => {
            let studentDatabase = [];

            querySnapshot.forEach(function (doc) {
                const student = doc.data()
                student.id = doc.id;
                studentDatabase.push(student);
            });

            this.setState({
                students: studentDatabase
            }, () => this.GetClasses())
        });
        this.props.database.collection("Students").onSnapshot(querySnapshot => {
            let classDatabase = [];

            querySnapshot.forEach((doc) => {
                const course = doc.data()
                course.number = doc.id;
                classDatabase.push(course);
            });

            this.setState({
                classes: classDatabase
            })
        });
    }

    GetPrivilege = () => {
        this.props.database.collection("Privileges").doc(this.props.account).get().then(doc => {
            this.setState({
                privilege: doc.data().privilege
            })
        })
    }
    GetTeachers() {
        this.props.database.collection("Teachers").get()
            .then((querySnapshot) => {
                let teacherDatabase = [];

                querySnapshot.forEach((doc) => {
                    const teacher = doc.data()
                    teacher.id = doc.id;
                    teacherDatabase.push(teacher);
                });

                this.setState({
                    teachers: teacherDatabase
                }, () => this.GetClasses())

            });
    }
    GetStudents() {
        this.props.database.collection("Students").get()
            .then((querySnapshot) => {
                let studentDatabase = [];

                querySnapshot.forEach((doc) => {
                    const student = doc.data()
                    student.id = doc.id;
                    studentDatabase.push(student);
                });

                this.setState({
                    students: studentDatabase
                }, () => this.GetClasses())
            });
    }
    GetClasses() {
        this.props.database.collection("Classes").get()
            .then((querySnapshot) => {
                let classDatabase = [];

                querySnapshot.forEach((doc) => {
                    const course = doc.data()
                    course.number = doc.id;
                    classDatabase.push(course);
                });

                this.setState({
                    classes: classDatabase
                }, () => console.log(this.state))
            });


    }

    CreateTeacher = (name, email) => {
        this.props.auth.createUserWithEmailAndPassword(
            email,
            process.env.REACT_APP_DEFAULT_PASSWORD
        )
            .then(apicall => {
                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                    privilege: "TEACHER"
                })

                this.props.database.collection("Teachers").doc(apicall.user.uid).set({
                    name: name,
                    email: email,
                    classes: []
                })
            })
        this.GetCollections();
    }

    CreateStudent = (name, email) => {
        this.props.auth.createUserWithEmailAndPassword(
            email,
            process.env.REACT_APP_DEFAULT_PASSWORD
        )
            .then(apicall => {
                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                    privilege: "STUDENT"
                })

                this.props.database.collection("Students").doc(apicall.user.uid).set({
                    name: name,
                    email: email,
                    classes: []
                })
            })
    }

    RemoveClass = (collection) => {
        return (
            (userID, className) => {
                console.log(this.state, userID);

                this.state[collection.toLowerCase()].forEach(user => {
                    if (user.id === userID) {
                        user.classes.splice(user.classes.findIndex(course => course === className), 1)

                        this.props.database.collection(collection).doc(userID).set(user);
                    }
                })
            }
        )
    }

    AddClass = (collection, userID, className) => {
        let info = { name: "Unknown", classes: [] }

        this.state[collection.toLowerCase()].forEach(user => {
            if (user.id === userID)
                info = user;
            return;
        })
        console.log(info);

        info.classes.push(className);

        this.props.database.collection(collection).doc(userID).set(
            info
        )
    }

    render() {
        return (
            <div>

                <TeacherTable
                    Methods={{
                        CreateTeacher: this.CreateTeacher,
                        AddClass: this.AddClass,
                        RemoveClass: this.RemoveClass("Teachers")
                    }}
                    Data={{
                        classes: this.state.classes,
                        privilege: this.state.privilege,
                        users: this.state.teachers,
                        collection: "Teachers"
                    }}
                />
                <StudentTable
                    Methods={{
                        CreateUser: this.CreateStudent,
                        AddClass: this.AddClass,
                        RemoveClass: this.RemoveClass("Students")
                    }}
                    Data={{
                        classes: this.state.classes,
                        privilege: this.state.privilege,
                        users: this.state.students,
                        collection: "Students"
                    }}
                />

                <CoursesTable
                    Methods={{
                        RemoveClass: this.RemoveClass("Students")
                    }}
                    Data={{
                        classes: this.state.classes,
                        privilege: this.state.privilege
                    }}
                />
            </div >
        )
    }
}

export default DataDisplay;