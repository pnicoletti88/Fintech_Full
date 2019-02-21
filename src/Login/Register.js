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
    submit(e, user, pass, pass2, Name) {
        e.preventDefault();
        let outName = Name.toString();
        if (pass === pass2) {
            auth.createUserWithEmailAndPassword(user, pass).then((User) => {
                    this.setState({ loginStatus: "Register Successful" });
                    database.ref("Users").child(User.user.uid).set({
                        Money: 100000,
                        Name: Name
                    });
                    database.ref("Users").child(User.user.uid).child("Stocks").child("NullStock").set({
                        Value: 0,
                        Shares: 0
                    });
                    database.ref("Users").child(User.user.uid).child("Transactions").child("Buy").child("NullStock-0").set({
                        Date: "00/00/00",
                        Price: 0,
                        Shares: 0
                    });
                    database.ref("Users").child(User.user.uid).child("Transactions").child("Sell").child("NullStock-0").set({
                        BuyPrice: 0,
                        Date: "00/00/00",
                        Shares: 0,
                        SellPrice: 0
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
                <form onSubmit={(e, user = document.getElementById("RegUsername").value,
                                 pass = document.getElementById("RegPassword").value,
                                 pass2 = document.getElementById("RegPassword2").value,
                                 name = document.getElementById("Name").value) => { this.submit(e, user, pass,pass2,name) }}>

                    <div className="form-group">
                        <label>Name:</label>
                        <input className="form-control" type="text" id="Name" placeholder="Enter name"/>
                    </div>
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