import React, { useState } from "react";
import "./tableCustom.css";

function DataTable(props) {
    const [addingUser, setAddingUser] = useState(false);

    console.log(props.Data.classes);

    return (
        <div>
            <h3>{props.Data.collection}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>ID</th>
                        <th colSpan="6">Classes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.Data.users.map(user => {

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
                                                        <option>{course[0]}</option>
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
                                <td><input id="NewName" placeholder="Name" /></td>
                                <td><input id="NewEmail" type="email" placeholder="Email" /></td>
                                <td><button onClick={() => {
                                    const nameElem = document.getElementById("NewName");
                                    const emailElem = document.getElementById("NewEmail");

                                    props.Methods.CreateUser(
                                        nameElem.value,
                                        emailElem.value
                                    )

                                    nameElem.value = "";
                                    emailElem.value = "";
                                    setAddingUser(false);
                                }}>Create Account</button></td>
                            </tr>
                            :
                            props.Data.privilege === "ADMIN" &&
                            <tr>
                                <td><button onClick={() => setAddingUser(true)}>Add Element</button></td>
                            </tr>
                    }
                </tbody>
            </table>

        </div>
    )
}

export default DataTable;
