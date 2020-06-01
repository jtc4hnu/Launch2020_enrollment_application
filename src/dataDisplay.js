import React, { Component } from "react";

import TeacherTable from "./tableTeachers.js";
import StudentTable from "./tableStudents.js";
import CourseTable from "./tableCourses.js";

import "./dataDisplay.css";
import "./tableCustom.css";

class DataDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            privilege: "STUDENT",
            teachers: [],
            students: [],
            classes: [],
            ids: []
        }
    }

    componentDidMount() {
        this.props.database.collection("Privileges").doc(this.props.account).get().then(doc => {
            this.setState({
                privilege: doc.data().privilege
            })
        })

        this.props.database.collection("Teachers").get()
            .then((querySnapshot) => {
                let teacherDatabase = [];
                let updateID = this.state.ids;

                querySnapshot.forEach((doc) => {
                    const teacher = doc.data()
                    teacher.id = doc.id;

                    if (!updateID.includes(teacher.id))
                        updateID.push(teacher.id)

                    teacherDatabase.push(teacher);
                });

                this.setState({
                    teachers: teacherDatabase,
                    ids: updateID
                }, () => this.GetClasses())

            });

        this.props.database.collection("Students").get()
            .then((querySnapshot) => {
                let studentDatabase = [];
                let updateID = this.state.ids;

                querySnapshot.forEach((doc) => {
                    const student = doc.data()
                    student.id = doc.id;

                    if (!updateID.includes(student.id))
                        updateID.push(student.id)

                    studentDatabase.push(student);
                });

                this.setState({
                    students: studentDatabase,
                    ids: updateID
                }, () => this.GetClasses())
            });


        this.props.database.collection("Teachers").onSnapshot(querySnapshot => {
            let teacherDatabase = [];
            let updateID = this.state.ids;

            querySnapshot.forEach(function (doc) {
                const teacher = doc.data()
                teacher.id = doc.id;

                if (!updateID.includes(teacher.id))
                    updateID.push(teacher.id)

                teacherDatabase.push(teacher);
            });
            this.setState({
                teachers: teacherDatabase,
                ids: updateID
            }, () => this.GetClasses())
        });
        this.props.database.collection("Students").onSnapshot(querySnapshot => {
            let studentDatabase = [];
            let updateID = this.state.ids;

            querySnapshot.forEach(function (doc) {
                const student = doc.data()
                student.id = doc.id;

                if (!updateID.includes(student.id))
                    updateID.push(student.id)

                studentDatabase.push(student);
            });

            this.setState({
                students: studentDatabase,
                ids: updateID
            }, () => this.GetClasses())
        });
        this.props.database.collection("Classes").onSnapshot(querySnapshot => {
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
                })
            });
    }

    CreateTeacher = (name, email) => {
        this.props.auth2.createUserWithEmailAndPassword(
            email,
            process.env.REACT_APP_DEFAULT_PASSWORD
        )
            .then(apicall => {

                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                    privilege: "TEACHER"
                })

                const id = this.CustomID(name, "TEACHER")
                this.props.database.collection("Teachers").doc(id).set({
                    name: name,
                    email: email,
                    id: id,
                    classes: []
                })
            })
    }
    DeleteTeacher = teacher => {
        teacher.classes.forEach(course => {
            this.RemoveTeacher(teacher, course);
        })

        this.props.database.collection("Teachers").doc(teacher.id).delete();
    }

    CreateStudent = (name, email, parentEmail) => {
        this.props.auth2.createUserWithEmailAndPassword(
            email,
            process.env.REACT_APP_DEFAULT_PASSWORD
        )
            .then(apicall => {
                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                    privilege: "STUDENT"
                })

                const id = this.CustomID(name, "STUDENT")
                this.props.database.collection("Students").doc(id).set({
                    name: name,
                    email: email,
                    parentEmail: parentEmail,
                    classes: []
                })
            })
    }
    DeleteStudent = student => {
        student.classes.forEach(course => {
            this.RemoveStudent(student, course);
        })

        this.props.database.collection("Students").doc(student.id).delete();
    }


    AddClass = (course, number) => {

        this.props.database.collection("Classes").doc(number).set(
            course
        )
    }
    DeleteClass = course => {
        let teacherobj = false;

        this.state.teachers.forEach(teacher => {
            if (teacher.name === course.teacher)
                teacherobj = teacher
        })
        if (teacherobj) {
            teacherobj.classes.splice(
                teacherobj.classes.indexOf(course.title),
                1
            )
            this.props.database.collection("Teachers").doc(teacherobj.id).set(teacherobj)
        }

        this.state.students.forEach(student => {
            if (course.students.includes(student.name)) {
                student.classes.splice(
                    student.classes.indexOf(course.title),
                    1
                )
                this.props.database.collection("Students").doc(student.id).set(student);
            }
        })

        this.props.database.collection("Classes").doc(course.number).delete();
    }

    AssignTeacher = (teacher, className) => {
        let courseobj = false;

        this.state.classes.forEach(course => {
            if (course.title === className || course.number === className)
                courseobj = course
        })

        if (courseobj && courseobj.teacher === "Not Assigned") {
            courseobj.teacher = teacher.name;
            teacher.classes.push(courseobj.title);
            this.props.database.collection("Teachers").doc(teacher.id).set(teacher);
            this.props.database.collection("Classes").doc(courseobj.number).set(courseobj);
        }
    }
    RemoveTeacher = (teacher, className) => {
        let courseobj = false;

        this.state.classes.forEach(course => {
            if (course.title === className)
                courseobj = course
        })
        if (courseobj) {
            courseobj.teacher = "Not Assigned";
            teacher.classes.splice(
                teacher.classes.indexOf(className),
                1
            );
            this.props.database.collection("Teachers").doc(teacher.id).set(teacher);
            this.props.database.collection("Classes").doc(courseobj.number).set(courseobj);
        }
    }
    AssignStudent = (student, className) => {
        let courseobj = false;

        this.state.classes.forEach(course => {
            if (course.title === className || course.number === className)
                courseobj = course
        })

        if (courseobj && !student.classes.includes(courseobj.title)) {
            student.classes.push(courseobj.title);
            courseobj.students.push(student.name);

            this.props.database.collection("Students").doc(student.id).set(student);
            this.props.database.collection("Classes").doc(courseobj.number).set(courseobj);
        }
    }
    RemoveStudent = (student, className) => {
        let courseobj = false;

        this.state.classes.forEach(course => {
            if (course.title === className)
                courseobj = course
        })
        if (courseobj) {
            student.classes.splice(
                student.classes.indexOf(className),
                1
            )
            courseobj.students.splice(
                courseobj.students.indexOf(student.name),
                1
            );
            this.props.database.collection("Students").doc(student.id).set(student);
            this.props.database.collection("Classes").doc(courseobj.number).set(courseobj);
        }
    }

    CustomID = (name, position) => {
        let head = position === "STUDENT" ? "S" : "";
        name.split(" ").forEach(comp => {
            head += comp[0]
        })

        let id = Math.floor(Math.random() * 1000000)
        while (this.state.ids.includes(id))
            id = Math.floor(Math.random() * 100000000)

        return head + id;
    }

    render() {
        return (
            <div className="Database">

                <TeacherTable
                    Methods={{
                        CreateTeacher: this.CreateTeacher,
                        DeleteTeacher: this.DeleteTeacher,
                        AssignTeacher: this.AssignTeacher,
                        RemoveTeacher: this.RemoveTeacher
                    }}
                    Data={{
                        classes: this.state.classes,
                        privilege: this.state.privilege,
                        users: this.state.teachers
                    }}
                />
                <StudentTable
                    Methods={{
                        CreateStudent: this.CreateStudent,
                        DeleteStudent: this.DeleteStudent,
                        AssignStudent: this.AssignStudent,
                        RemoveStudent: this.RemoveStudent
                    }}
                    Data={{
                        classes: this.state.classes,
                        privilege: this.state.privilege,
                        users: this.state.students
                    }}
                />

                <CourseTable
                    Methods={{
                        AddClass: this.AddClass,
                        DeleteClass: this.DeleteClass
                    }}
                    Data={{
                        classes: this.state.classes,
                        privilege: this.state.privilege,
                        teachers: this.state.teachers,
                        students: this.state.students
                    }}
                />
            </div >
        )
    }
}

export default DataDisplay;