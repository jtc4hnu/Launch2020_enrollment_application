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
            document.getElementById("inputEmail").value,
            process.env.REACT_APP_DEFAULT_PASSWORD
        )
            .then(apicall => {
                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                    privilege: "TEACHER"
                })
            })
        this.GetCollections();
    }

    CreateStudent = (name, email) => {

    }

    render() {
        return (
            <div>
                <h3>Teachers</h3>
                <DataTable CreateUser={this.CreateTeacher} privilege={this.state.privilege} users={this.state.teachers} />
                <h3>Students</h3>
                <DataTable CreateUser={this.CreateStudent} privilege={this.state.privilege} users={this.state.students} />



                {/* <table className="Teachers">
                    <thead>
                        <tr>
                            <th>Teacher Name</th>
                            <th>Teacher Email</th>
                            <th>Teacher ID</th>
                            <th colSpan="6">Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.teachers.map(teacher => {
                                return (
                                    <tr>
                                        <td>{teacher.name}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.id}</td>
                                        {
                                            teacher.classes.map(course => {
                                                return <td><button>{course}</button></td>
                                            })
                                        }
                                        <td><button>Add Course</button></td>
                                    </tr>
                                )
                            })
                        }
                        {
                            this.state.addingTeacher ?
                                <tr>
                                    <td><input id="NewTeacherName" placeholder="Teacher Name" /></td>
                                    <td><input id="NewTeacherEmail" placeholder="Teacher Email" /></td>
                                    <td><button onClick={() => {
                                        this.props.auth.createUserWithEmailAndPassword(
                                            document.getElementById("inputEmail").value,
                                            process.env.REACT_APP_DEFAULT_PASSWORD
                                        )
                                            .then(apicall => {
                                                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                                                    privilege: "TEACHER"
                                                })
                                            })
                                        this.GetCollections();
                                    }}>Create Teacher</button></td>
                                </tr>
                                :
                                this.state.privilege === "ADMIN" &&
                                <tr>
                                    <td><button onClick={() => this.setState({
                                        addingTeacher: true
                                    })}>Add Teacher</button></td>
                                </tr>
                        }
                    </tbody>
                </table>
                <table className="Students">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Student ID</th>
                            <th colSpan="6">Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.students.map(student => {
                                return (
                                    <tr>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{student.id}</td>
                                    </tr>
                                )
                            })
                        }
                        {
                            this.state.addingStudent ?
                                <tr>
                                    <td><input placeholder="Student Name" /></td>
                                    <td><input placeholder="Student Email" /></td>
                                    <td><button onClick={() => {
                                        this.props.auth.createUserWithEmailAndPassword(
                                            document.getElementById("inputEmail").value,
                                            process.env.REACT_APP_DEFAULT_PASSWORD
                                        )
                                            .then(apicall => {
                                                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                                                    privilege: "STUDENT"
                                                })
                                            })
                                        this.GetCollections();
                                    }}>Create Student</button></td>
                                </tr>
                                :
                                (this.state.privilege === "TEACHER" ||
                                    this.state.privilege === "ADMIN") &&
                                <tr>
                                    <td><button onClick={() => this.setState({
                                        addingStudent: true
                                    })}>Add Student</button></td>
                                </tr>
                        }
                    </tbody>
                </table> */}

                <button onClick={() =>
                    this.props.auth.signOut()
                }>Sign Out</button>
            </div >
        )
    }
}

export default DataDisplay;