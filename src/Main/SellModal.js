import React, { Component } from 'react';
import {IEXClient} from "iex-api";
import * as _fetch from "isomorphic-fetch";
import {database} from "../firebase";



const iex = new IEXClient(_fetch);

class SellModal extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            status: "initial",
            NumShares: null,
            Price: 0,
            Owned: 0,
            what: null
        });
    }

    //good learning use this to call initial functions instead of constructor as state has not been set
    componentDidMount(){
        this.SetUp(this.props.stock)
    }


    todaysDate(){
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //January is 0!
        let yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }

        if(mm<10) {
            mm = '0'+mm
        }

        return mm + '/' + dd + '/' + yyyy;
    }


    SetUp(ticker) {
        //note item is an object with all the stock data
        iex.stockQuote(ticker, false).then((item) => {
                this.setState({Price:item.latestPrice});
            }
        );

        database.ref("Users/"+this.props.UID+"/Stocks/"+ticker).on('value' , (snapshot) =>{
            let json = snapshot.toJSON();
            let num = json["Shares"];
            let value = json["Value"];
            this.setState({
                Owned: num,
                BuyPrice: value
            });
        });
    }

    ProcessSale(){
        let date = this.todaysDate();
        let totalEarnings = this.state.Price * this.state.NumSell;
        database.ref("Users/"+this.props.UID+"/Money").once('value').then((snapshot) => {
            let newAmount = snapshot.val() + totalEarnings;
            database.ref("Users/"+this.props.UID).update({Money:newAmount});
        });

        let StockListRef = database.ref("Users/"+this.props.UID+"/Stocks");
        let TransactionRef = database.ref("Users/"+this.props.UID+"/Transactions/Sell");

        //add purchase to transactions
        let TransName = this.props.stock + "-" + (new Date()).getTime();
        TransactionRef.child(TransName).set({
            BuyPrice: this.state.BuyPrice,
            Date: date,
            SellPrice: this.state.Price,
            Shares: this.state.NumSell
        });

        StockListRef.child(this.props.stock).once('value').then((data) => {
            let json = data.toJSON();
            let value = json["Value"];
            let numShares = json["Shares"];
            value -= (value/numShares*this.state.NumSell);
            numShares -= this.state.NumSell;
            if (numShares === 0){
                StockListRef.child(this.props.stock).remove();
            }else {
                StockListRef.child(this.props.stock).update({Value: value, Shares: numShares});
            }
        });



        this.setState({status:"confirmed"});
    }

    render() {
        let out = null;
        //should have a loading phase here
        if (this.state.status === "initial") {
            out = (
                <div>
                    The current share price is {this.state.Price} and you own {this.state.Owned} shares.
                    Please enter the number of shares you want to sell.
                <form onSubmit={(e, num = document.getElementById("NumShares").value) => {
                    e.preventDefault();
                    this.setState({
                        NumSell: num,
                        status: "set"
                    })
                }}>
                    <div className="form-group">
                        <input className="form-control" type="number" min="1" max={this.state.Owned} id="NumShares"/>
                    </div>
                    <input type="submit" className="btn btn-secondary btn-space" value="Submit"/>
                </form>
                </div>
            );
        } else if (this.state.status === "set") {
            let val = Math.round(this.state.NumSell * this.state.Price * 100)/100;
            out = (
                <div>
                    Are you sure that you would like to sell {this.state.NumSell} shares for ${val}?
                    <br/><br/>
                    <button onClick={()=> this.ProcessSale()}> Confirm </button>
                </div>
            );
        } else if (this.state.status === "confirmed") {
            out = (
                <div>
                    Sale Successfully Processed.
                </div>
            );
        }


        return (
            <div style={{"text-align":"center"}}>
                <h3>Sell Stock</h3>
                {out}
            </div>
        );
    }
}

export default SellModal;