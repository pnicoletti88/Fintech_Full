import React, { Component } from 'react';
import Show from "./Show.js"
import Buy from "./Buy.js"
import Sell from "./Sell.js"
import firebase, { auth, provider, database, db } from '../firebase.js';




class MainPageController extends Component {
    constructor(props){
        super(props);
        this.state = {
            Display: <Show UID = {this.props.user.uid}/>,
            cash: "",
        }
    }

    componentDidMount() {
        this.moneyController();
    }

    uidEnter(e,UID){
        e.preventDefault();
        this.setState({UID:UID})
    }


    change(to){
        if (to === "Show"){
            this.setState({Display: <Show UID = {this.props.user.uid}/>})
        }else if (to === "Buy"){
            this.setState({Display: <Buy UID = {this.props.user.uid} userCash={this.state.cash}/>})
        }else if (to === "Sell"){
            this.setState({Display: <Sell UID = {this.props.user.uid}/>})
        }
    }

    moneyController(){
        database.ref("Users/"+this.props.user.uid+"/Money").on('value', (snapshot) => {
            this.setState({cash: Math.round(snapshot.val())});
        });
    }

    render() {
        return (
            <div>
                <div>
                    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand">Fintech Trading</a>
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
                <br></br>
                <br></br>

                <div style={{"background-color":"#4F2683"}} className={"p-3 mb-2 text-white"}>
                    <div style={{ "textAlign": "center" }}>
                        Current Cash Value: ${this.state.cash} USD
                    </div>
                </div>
                <div>
                    {this.state.Display}
                </div>
            </div>
        );
    }
}

export default MainPageController;
