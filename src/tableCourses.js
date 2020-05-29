import React, { useState } from "react";
import "./tableCustom.css";

function CourseTable(props) {
    const [addingClass, setAddingClass] = useState(false);

    return (
        <div className="CustomTable">
            <h3>Courses</h3>
            <div className="ScrollableTable">
                <table>
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Course Abbreviation</th>
                            <th>Course Numeric</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.Data.classes.map(course => {
                                return (
                                    <tr>
                                        <td>{course.title}</td>
                                        <td>{course.abbrev}</td>
                                        <td>{course.number}</td>
                                        <td>{course.start}</td>
                                        <td>{course.end}</td>
                                    </tr>
                                )
                            })
                        }
                        {/* {
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
                        } */}
                        {
                            addingClass ?
                                <tr>
                                    <td><input id="NewTitle" placeholder="Name" /></td>
                                    <td><input id="NewAbbrev" type="email" placeholder="Email" /></td>
                                    <td><button onClick={() => {
                                        const nameElem = document.getElementById("NewName");
                                        const emailElem = document.getElementById("NewEmail");

                                        nameElem.value = "";
                                        emailElem.value = "";
                                        setAddingClass(false);
                                    }}>Create Account</button></td>
                                </tr>
                                :
                                props.Data.privilege === "ADMIN" &&
                                <tr>
                                    <td>
                                        <button onClick={() => setAddingClass(true)}>Add Element</button>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CourseTable;
