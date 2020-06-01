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
                            {
                                props.Data.privilege === "ADMIN" &&
                                <th>Remove Teacher</th>
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
                                        <td>{user.id}</td>
                                        {
                                            props.Data.privilege === "ADMIN" &&
                                            <td className="Caution">
                                                <button onClick={() => {
                                                    props.Methods.DeleteTeacher(user);
                                                }}>Remove This Teacher</button>
                                            </td>
                                        }

                                        {
                                            user.classes.map(course => {
                                                return (
                                                    <td key={course}>
                                                        {
                                                            props.Data.privilege === "ADMIN" ?
                                                                <button onClick={() => {
                                                                    props.Methods.RemoveTeacher(user, course)
                                                                }}>{course}</button>
                                                                :
                                                                <div>{course}</div>
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
                                                    props.Methods.AssignTeacher(
                                                        user,
                                                        e.target.firstElementChild.value
                                                    )
                                                    e.target.firstElementChild.value = "";
                                                }}>
                                                    <input type="text" placeholder="Add a Class" list="ClassesT" />
                                                </form>

                                                <datalist id="ClassesT">
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
