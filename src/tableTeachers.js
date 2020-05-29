import React, { useState } from "react";

function TeacherTable(props) {
    const [addingTeacher, setAddingTeacher] = useState(false);
    const [columnSpan, setColSpan] = useState(1);

    return (
        <div className="CustomTable">
            <h3>Teachers</h3>
            <div className="ScrollableTable">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>ID</th>
                            <th colSpan={columnSpan}>Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.Data.users.map(user => {
                                if (user.classes.length >= columnSpan)
                                    setColSpan(user.classes.length + 1);

                                return (
                                    <tr>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.id}</td>
                                        {
                                            user.classes.map(course => {
                                                return (
                                                    <td key={course}>
                                                        {
                                                            (props.Data.privilege === "ADMIN" || props.Data.privilege === "TEACHER") ?
                                                                <button onClick={() => {
                                                                    props.Methods.RemoveClass(user.id, course)
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
                                                    props.Methods.AddClass(
                                                        props.Data.collection,
                                                        user.id,
                                                        e.target.firstElementChild.value
                                                    )
                                                    e.target.firstElementChild.value = "";
                                                }}>
                                                    <input type="text" placeholder="Add a Class" list="Classes" />
                                                </form>

                                                <datalist id="Classes">
                                                    {props.Data.classes.map(course => {
                                                        return (
                                                            <option key={course[0]}>{course[0]}</option>
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
                            props.Data.privilege === "ADMIN" &&
                                addingTeacher ?
                                <tr>
                                    <td><input id="TeacherName" placeholder="Name" /></td>
                                    <td><input id="TeacherEmail" type="email" placeholder="Email" /></td>
                                    <td><button onClick={() => {
                                        const nameElem = document.getElementById("TeacherName");
                                        const emailElem = document.getElementById("TeacherEmail");

                                        props.Methods.CreateTeacher(
                                            nameElem.value,
                                            emailElem.value
                                        )

                                        nameElem.value = "";
                                        emailElem.value = "";
                                        setAddingTeacher(false);
                                    }}>Create Account</button></td>
                                </tr>
                                :
                                <tr>
                                    <td><button onClick={() => setAddingTeacher(true)}>Add Teacher</button></td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeacherTable;
