import React, { Component } from 'react';
import Show from "./Show.js"
import Buy from "./Buy.js"
import Sell from "./Sell.js"



class MainPageController extends Component {
    constructor(props){
        super(props);
        this.state = {
            Display: <Show UID = {this.props.user.uid}/>
        }
    }

    uidEnter(e,UID){
        e.preventDefault();
        this.setState({UID:UID})
    }


    change(to){
        if (to === "Show"){
            this.setState({Display: <Show UID = {this.props.user.uid}/>})
        }else if (to === "Buy"){
            this.setState({Display: <Buy UID = {this.props.user.uid}/>})
        }else if (to === "Sell"){
            this.setState({Display: <Sell UID = {this.props.user.uid}/>})
        }
    }


    render() {
        return (
            <div>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand">NAME HERE</a>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" onClick={()=>{this.change("Show")}} href="#">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={()=>{this.change("Buy")}} href="#">Buy</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={()=>{this.change("Sell")}} href="#">Sell</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div>
                    {this.state.Display}
                </div>
            </div>
        );
    }
}

export default MainPageController;
