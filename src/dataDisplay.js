import React, { Component } from "react";
import DataTable from "./tableCustom.js";
import "./dataDisplay.css";


class DataDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            privilege: "STUDENT",
            teachers: [],
            students: []
        }
    }

    componentDidMount() {
        this.GetPrivilege();
        this.GetCollections();
    }

    GetPrivilege = () => {
        this.props.database.collection("Privileges").doc(this.props.account).get().then(doc => {
            this.setState({
                privilege: doc.data().privilege
            })
        })
    }
    GetCollections() {
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
                })

            });

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
                })
            });

        this.props.database.collection("Teachers").onSnapshot(querySnapshot => {
            let teacherDatabase = [];
            querySnapshot.forEach(function (doc) {
                const teacher = doc.data()
                teacher.id = doc.id;
                teacherDatabase.push(teacher);
            });
            this.setState({
                teachers: teacherDatabase
            })
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
            })
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

    render() {
        return (
            <div>
                <div>
                    <h3>Teachers</h3>
                    <DataTable CreateUser={this.CreateTeacher} privilege={this.state.privilege} users={this.state.teachers} />
                </div>
                <div>
                    <h3>Students</h3>
                    <DataTable CreateUser={this.CreateStudent} privilege={this.state.privilege} users={this.state.students} />
                </div>

                <button onClick={() =>
                    this.props.auth.signOut()
                }>Sign Out</button>
            </div >
        )
    }
}

export default DataDisplay;