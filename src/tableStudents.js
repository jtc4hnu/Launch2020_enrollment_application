import React, { useState } from "react";

function DataTable(props) {
    const [addingUser, setAddingUser] = useState(false);
    const [columnSpan, setColSpan] = useState(6);

    return (
        <div className="CustomTable">
            <h3>Students</h3>
            <div className="ScrollableTable">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Parent Email</th>
                            <th>ID</th>
                            {
                                props.Data.privilege === "ADMIN" &&
                                <th>Remove Student</th>
                            }
                            <th colSpan={columnSpan}>Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.Data.users.map(user => {
                                if (user.classes.length >= columnSpan)
                                    setColSpan(user.classes.length + 1);

                                return (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.parentEmail}</td>
                                        <td>{user.id}</td>
                                        {
                                            props.Data.privilege === "ADMIN" &&
                                            <td className="Caution">
                                                <button onClick={() => {
                                                    props.Methods.DeleteStudent(user)
                                                }}>Remove This Student</button>
                                            </td>
                                        }
                                        {
                                            user.classes.map(course => {
                                                return (
                                                    <td key={course}>
                                                        {
                                                            (props.Data.privilege === "ADMIN" || props.Data.privilege === "TEACHER") ?
                                                                <button onClick={() => {
                                                                    props.Methods.RemoveStudent(user, course)
                                                                }}>{course}</button>
                                                                :
                                                                <text>{course}</text>
                                                        }
                                                    </td>
                                                )
                                            })
                                        }
                                        {
                                            (props.Data.privilege === "ADMIN" || props.Data.privilege === "TEACHER") &&
                                            <td>
                                                <form onSubmit={e => {
                                                    e.preventDefault();
                                                    props.Methods.AssignStudent(
                                                        user,
                                                        e.target.firstElementChild.value
                                                    )
                                                    e.target.firstElementChild.value = "";
                                                }}>
                                                    <input type="text" placeholder="Add a Class" list="ClassesS" />
                                                </form>

                                                <datalist id="ClassesS">
                                                    {props.Data.classes.map(course => {
                                                        return (
                                                            <option key={course.number + "T"}>{course.title}</option>
                                                        )
                                                    })}
                                                    {props.Data.classes.map(course => {
                                                        return (
                                                            <option key={course.number + "N"}>{course.number}</option>
                                                        )
                                                    })}
                                                </datalist>
                                            </td>
                                        }
                                    </tr>
                                )
                            })
                        }
                        {
                            addingUser ?
                                <tr>
                                    <td><input id="StudentName" placeholder="Name" /></td>
                                    <td><input id="StudentEmail" type="email" placeholder="Email" /></td>
                                    <td><input id="ParentEmail" type="email" placeholder="Parent Email" /></td>
                                    <td><button onClick={() => {
                                        const nameElem = document.getElementById("StudentName");
                                        const emailElem = document.getElementById("StudentEmail");
                                        const parentEmailElem = document.getElementById("ParentEmail");

                                        props.Methods.CreateStudent(
                                            nameElem.value,
                                            emailElem.value,
                                            parentEmailElem.value
                                        )

                                        nameElem.value = "";
                                        emailElem.value = "";
                                        parentEmailElem.value = "";
                                        setAddingUser(false);
                                    }}>Create Account</button></td>
                                </tr>
                                :
                                props.Data.privilege === "ADMIN" &&
                                <tr>
                                    <td><button onClick={() => setAddingUser(true)}>Add Student</button></td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataTable;
