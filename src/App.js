import React, { Component } from 'react';
import './App.css';
import LoginController from "./Login/LoginController";
import {Link,Route,Redirect, Switch, BrowserRouter} from 'react-router-dom'
import Dashboard from "./Protected/Dashboard.js"
import MainPageController from "./Main/MainPageController.js"

class PrivateRoute extends Component{
    render(){
        let out;
        if(this.props.authed){
            out = <Route path = {this.props.path} exact render={(props) => <this.props.component user={this.props.user} />} />
        }else{
            out = <Route render={(props) => <Redirect to={{pathname: '/'}} />}/>
        }

        return(
            out
        );
    }
}


class App extends Component {
  /*firebase auth on state change*/
    constructor(props){
        super(props);
        this.state = {
            authed:false,
            redirect:null,
            User:null
        }
        this.signInSuccess = this.signInSuccess.bind(this);
    }

    signInSuccess(user){
        this.setState({
            authed:true,
            User: user
        });
        this.setState({redirect:<Redirect to="/home"/>})
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                <Switch>
                    <Route path='/' exact render={(props) => <LoginController SignedIn={this.signInSuccess} /> }/>
                    <PrivateRoute authed={this.state.authed} user = {this.state.User} path='/home' component={MainPageController} />
                    <Route render={() => <h3>Error 404: File Not Found</h3>} />
                </Switch>
                    {this.state.redirect}
            </div>
            </BrowserRouter>
        );
      }
}

export default App;
