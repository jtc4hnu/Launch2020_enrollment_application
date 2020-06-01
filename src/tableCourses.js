import React, { useState } from "react";

function CourseTable(props) {
    const [addingClass, setAddingClass] = useState(false);

    return (
        <div className="CustomTable">
            <h3>Courses</h3>
            <div className="FixedTable">
                <table>
                    <thead>
                        <tr>
                            <th>Course Title</th>
                            <th>Course Numeric</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Assigned Teacher</th>
                            <th>Assigned Students</th>
                            {props.Data.privilege === "ADMIN" &&
                                <th>Remove Class</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.Data.classes.map(course => {
                                return (
                                    <tr key={course.number}>
                                        <td>{course.title}</td>
                                        <td>{course.number}</td>
                                        <td>{course.start}</td>
                                        <td>{course.end}</td>
                                        <td>{course.teacher}</td>
                                        <td className="Student-Listing">
                                            {course.students.map(student => {
                                                return <div key={student} >
                                                    {student}
                                                </div>
                                            })}
                                        </td>
                                        {
                                            props.Data.privilege === "ADMIN" &&
                                            <td className="Caution"><button onClick={() => {
                                                props.Methods.DeleteClass(course)
                                            }}>Delete This Class</button></td>
                                        }
                                    </tr>
                                )
                            })
                        }
                        {
                            addingClass ?
                                <tr>
                                    <td><input id="CourseTitle" placeholder="Class Title" /></td>
                                    <td><input id="CourseID" placeholder="Unique ID" /></td>
                                    <td><input id="CourseStart" placeholder="Start Time" /></td>
                                    <td><input id="CourseEnd" placeholder="End Time" /></td>
                                    <td><input id="CourseTeacher" placeholder="Assigned Teacher" /></td>
                                    <td>{" "}</td>
                                    <td><button onClick={() => {

                                        const titleElem = document.getElementById("CourseTitle");
                                        const idElem = document.getElementById("CourseID");
                                        const teacherElem = document.getElementById("CourseTeacher");
                                        const startElem = document.getElementById("CourseStart");
                                        const endElem = document.getElementById("CourseEnd");

                                        props.Methods.AddClass({
                                            title: titleElem.value,
                                            start: startElem.value,
                                            end: endElem.value,
                                            teacher: teacherElem.value === "" ? "Not Assigned" : teacherElem.value,
                                            students: []
                                        }, idElem.value)

                                        titleElem.value = "";
                                        idElem.value = "";
                                        teacherElem.value = "";
                                        startElem.value = "";
                                        endElem.value = "";
                                        setAddingClass(false);
                                    }}>Create Class</button></td>
                                </tr>
                                :
                                props.Data.privilege === "ADMIN" &&
                                <tr>
                                    <td>
                                        <button onClick={() => setAddingClass(true)}>Add Class</button>
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
