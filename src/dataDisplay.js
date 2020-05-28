import React, { Component } from "react";
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
        this.GetCollection("TEACHERS");
        this.GetCollection("STUDENTS");
    }

    GetPrivilege = () => {
        this.props.database.collection("Privileges").doc(this.props.account).get().then(doc => {
            this.setState({
                privilege: doc.data().privilege
            })
        })
    }
    GetCollection(collection) {
        this.props.database.collection(collection).get()
            .then(snapshot => {
                let users = []

                users.push(snapshot.docs.map(doc => {
                    return doc.data();
                }))

                this.state[collection.toLowerCase()] = users
                this.setState(this.state)
            })
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