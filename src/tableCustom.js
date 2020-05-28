import React, { useState } from "react";

function DataTable(props) {
    const [addingUser, setAddingUser] = useState(false);

    return (
        <table className="Teachers">
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
                    props.users.map(user => {
                        console.log(user);

                        return (
                            <tr>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.id}</td>
                                {
                                    user.classes.map(course => {
                                        return <td><button>{course}</button></td>
                                    })
                                }
                                {
                                    (props.privilege === "ADMIN" || props.privilege === "TEACHER") &&
                                    user.classes.length < 6 &&
                                    <td><button>Add Course</button></td>
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

                                props.CreateUser(
                                    nameElem.value,
                                    emailElem.value
                                )

                                nameElem.value = "";
                                emailElem.value = "";
                                setAddingUser(false);

                                // this.props.auth.createUserWithEmailAndPassword(
                                //     document.getElementById("inputEmail").value,
                                //     process.env.REACT_APP_DEFAULT_PASSWORD
                                // )
                                //     .then(apicall => {
                                //         this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                                //             privilege: "TEACHER"
                                //         })
                                //     })
                                // this.GetCollections();
                            }}>Create Account</button></td>
                        </tr>
                        :
                        props.privilege === "ADMIN" &&
                        <tr>
                            <td><button onClick={() => setAddingUser(true)}>Add Element</button></td>
                        </tr>
                }
            </tbody>
        </table>
    )
}

export default DataTable;
