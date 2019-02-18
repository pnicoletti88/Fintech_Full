import React from "react";
import {auth,database} from "../firebase";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loginStatus: "" };
    }
    loginStatus(updateVal) {
        this.setState({
            loginStatus: updateVal
        });
    }
    submit(e, user, pass, pass2) {
        e.preventDefault();
        if (pass === pass2) {
            auth.createUserWithEmailAndPassword(user, pass).then((User) => {
                    this.setState({ loginStatus: "Register Successful" });
                    database.ref("Users").child(User.user.uid).set({
                        Money: 100
                    });
                    database.ref("Users").child(User.user.uid).child("Stocks").child("NullStock").set({
                        Date: 0,
                        Price: 0,
                        Shares: 0
                    });
                    this.props.login();
                }
            ).catch((error) => {
                // Handle Errors here.
                this.setState({ loginStatus: error.message + ". Please try again." });

            });
        } else {
            this.setState({ loginStatus: "Passwords did not match. Please try again" });
        }
    }

    render() {
        return (
            <div>
                <h1>Register</h1>
                {this.state.loginStatus}
                <form onSubmit={(e, user = document.getElementById("RegUsername").value, pass = document.getElementById("RegPassword").value, pass2 = document.getElementById("RegPassword2").value) => { this.submit(e, user, pass,pass2) }}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input class="form-control" type="text" name="RegUsername" id="RegUsername" placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input class="form-control" type="password" name="RegPassword" id="RegPassword" placeholder="Enter password"/>
                    </div>
                    <div className="form-group">
                        <label>Re-Enter Password:</label>
                        <input class="form-control" type="password" name="RegPassword2" id="RegPassword2" placeholder="Re-enter password"/>
                    </div>
                    <input type="submit" class="btn btn-secondary btn-space" value="Submit" />
                </form>
            </div >
        );
    }
}

export default Register;