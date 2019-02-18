import React from "react";
import {auth} from "../firebase";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginStatus: ""
        };
        //this.submit = this.submit.bind(this);
    }
    loginStatus(updateVal) {
        this.setState({
            loginStatus: updateVal
        });
    }

    submit(e, user, pass) {
        e.preventDefault();
        auth.signInWithEmailAndPassword(user, pass).then((value) => {
            this.setState({ loginStatus: "Login Sucessful. UID is: " + value.user.uid });
            this.props.userback(value.user);
        }).catch((error) => {
            var errorCode = error.code;
            this.setState({ loginStatus: error.message + " Please try again." });

        });
    }


    render() {
        return (
            <div>
                <h1>Login</h1>
                {this.state.loginStatus}
                <form onSubmit={(e, user = document.getElementById("LoginUsername").value, pass = document.getElementById("LoginPassword").value) => { this.submit(e,user,pass) }}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input className="form-control" type="text" name="LoginUsername" id="LoginUsername" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                    <label>Password:</label>
                    <input className="form-control" type="password" name="LoginPassword" id="LoginPassword" placeholder="Enter password" />
                    </div>
                    <input type="submit" className="btn btn-secondary btn-space" value="Submit" />
                </form>
            </div >
        );
    }
}

export default Login;