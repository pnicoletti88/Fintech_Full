import Login from "./Login.js"
import Register from "./Register.js"
import React from "react";
import "./LoginController.css"
import {Link} from 'react-router-dom'


class LoginController extends React.Component {
    constructor(props) {
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.setLogin = this.setLogin.bind(this);
        this.state = {
            user: null,
            display: <Login userback={this.updateUser}/>,
            button:
                <button className="btn btn-secondary btn-space" onClick={(e)=>{this.RegisterButton(e)}}>
                    Register
                </button>
        };

    }
    setLogin(){
        this.setState({
            display: <Login userback={this.updateUser}/>,
            button:
                <button className="btn btn-secondary btn-space" onClick={(e)=>{this.RegisterButton(e)}}>
                    Register
                </button>
        });
    }

    setRegister(){
        this.setState({
            display:<Register login={(email) => {this.setLogin(email)}}/>,
            button:
                <button className="btn btn-secondary btn-space" onClick={(e)=>{this.setLogin(e)}}>
                    Login
                </button>
        })
    }

    updateUser(userIn) {
        this.setState({ user: userIn })
        this.props.SignedIn(userIn);
        //this.props.history.push('/page2');

    }
    RegisterButton(e){
        e.preventDefault();
        this.setRegister();
    }

    render() {
        return (
            <div className="jumbotron vertical-center">
                <div className="container">
                    <div style={{"background-color":"#4F2683"}} className={"p-3 mb-2 text-white"} >
                        <div style={{ "textAlign": "center" }}>
                            {this.state.display}
                            {this.state.button}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginController;
