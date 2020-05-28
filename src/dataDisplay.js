import React, { Component } from "react";
import "./dataDisplay.css";

class DataDisplay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addingTeacher: false,
            addingStudent: false,
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



        //this.state[collection.toLowerCase()] = users
        this.setState(this.state)
    }

    GenerateID = () => {
        let unique = false;
        let id = 0;

        while (!unique) {
            unique = true;
            id = Math.ceil(Math.random() * 100000);

            for (let i = 0; i < this.state.users.length; i++) {
                if (this.state.users[i].id === id) {
                    unique = false;
                    break;
                }
            }
        }
        return id.toString();
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <table className="Teachers">
                    <thead>
                        <tr>
                            <th>Teacher Name</th>
                            <th>Teacher Email</th>
                            <th>Teacher ID</th>
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
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <table className="Students">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Student ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.students.map(teacher => {
                                return (
                                    <tr>
                                        <td>{teacher.name}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.id}</td>
                                    </tr>
                                )
                            })
                        }
                        {
                            this.state.addingStudent ?
                                <tr>
                                    <td><input placeholder="Student Name" /></td>
                                    <td><input placeholder="Student Email" /></td>
                                    <td><input value={"Generated Key"} /></td>
                                </tr>
                                :
                                this.state.privilege === "Teacher" ||
                                this.state.privilege === "ADMIN" &&
                                <tr>
                                    <td><button onClick={() => this.setState({
                                        addingStudent: true
                                    })}>Add Student</button></td>
                                </tr>
                        }
                    </tbody>
                </table>
                <button onClick={() =>
                    this.props.auth.signOut()
                }>Sign Out</button>
            </div >
        )
    }
}

export default DataDisplay;