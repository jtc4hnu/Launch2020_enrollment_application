import React, { Component } from "react";
import "./landingPage.css";

class LandingPage extends Component {
    state = {
        hasaccount: true,
        privilege: "TEACHER"
    }

    render() {
        return (
            <div>
                <p>
                    {this.state.hasaccount ?
                        "If you have an account, Sign In below. Otherwise, please " :
                        "If you do not have an account, create one below. Otherwise, please "}

                    <button type="button" onClick={elem => this.setState({ hasaccount: !this.state.hasaccount })}>
                        {this.state.hasaccount ? "Create an Account" : "Sign In"}
                    </button>
                </p>

                <div className="userInputField">
                    <input id="inputEmail" type="email" placeholder="Enter your Email" />
                    <input id="inputPassword" type="password" placeholder="Enter your password" />
                    {!this.state.hasaccount && <input id="confirmPassword" type="password" placeholder="Confirm your password" />}
                </div>
                {
                    this.state.hasaccount ?
                        <div className="SignIn">
                            <button type="button" onClick={() => {
                                this.props.auth.signInWithEmailAndPassword(
                                    document.getElementById("inputEmail").value,
                                    document.getElementById("inputPassword").value
                                )
                            }}>Sign In</button>
                        </div>
                        :
                        <div className="CreateAccount">
                            <select onChange={elem => {
                                this.setState({
                                    privilege: elem.target.value
                                })
                            }}>
                                <option defaultChecked value="TEACHER">Teacher</option>
                                <option value="STUDENT">Student</option>
                                <option value="ADMIN">Administrator</option>
                            </select>

                            {this.state.privilege !== "STUDENT" && <input id="priviledgeAuthentication" placeholder="Authentication Key" />}

                            <button type="button" onClick={() => {
                                if (document.getElementById("inputPassword").value ===
                                    document.getElementById("confirmPassword").value) {
                                    if (this.state.privilege === "STUDENT" ||
                                        (this.state.privilege === "TEACHER" && document.getElementById("priviledgeAuthentication").value === process.env.REACT_APP_TEACHER_AUTH) ||
                                        (this.state.privilege === "ADMIN" && document.getElementById("priviledgeAuthentication").value === process.env.REACT_APP_ADMIN_AUTH)) {
                                        this.props.auth.createUserWithEmailAndPassword(
                                            document.getElementById("inputEmail").value,
                                            document.getElementById("inputPassword").value
                                        )
                                            .catch(function (error) {
                                                console.log(error.code, error.message);
                                                return;
                                            })
                                            .then(apicall => {
                                                this.props.database.collection("Privileges").doc(apicall.user.uid).set({
                                                    privilege: this.state.privilege
                                                })

                                                this.props.auth.signInWithEmailAndPassword(
                                                    document.getElementById("inputEmail").value,
                                                    document.getElementById("inputPassword").value
                                                )
                                            })
                                    }
                                }
                            }}>Create Account</button>
                        </div>
                }
            </div >
        )
    }
}

export default LandingPage;