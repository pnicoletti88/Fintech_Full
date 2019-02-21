import React, { Component } from 'react';
import {database} from "../firebase";
import { IEXClient } from 'iex-api'
import * as _fetch from 'isomorphic-fetch'
import Charts from "./Chart";
import Popup from "reactjs-popup";
import BuyModal from "./BuyModal.js";
import ControlledPopup from "./ControlledPopup.js"


const iex = new IEXClient(_fetch);



class Buy extends Component{
    constructor(props){
        super(props);
        this.purchase = this.purchase.bind(this);
        this.state = {
            StockInfo: null,
            Status: null,
            Ticker: null,
            confirmed: false
        };
    }

    //this function handle the API call to IEX to get the data
    StockIn(event, ticker) {
        event.preventDefault();
        this.setState({confirmed: false});
        let StockName = null, Price = null;

        //note item is an object with all the stock data
        iex.stockQuote(ticker, false).then((item) => {
                if (item === "Unknown symbol") {
                    this.setState({
                            Status: "Ticker Not Found",
                            StockInfo:null,
                            Ticker: null
                        }
                    );
                } else {
                    this.setState({
                        StockInfo: item,
                        Status: null,
                        Ticker: ticker
                    });
                }

            }
        );

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

    purchase(num,item,totalSpend){
        let name = item.symbol;
        let date = this.todaysDate();
        let price = item.latestPrice;
        let StockListRef = database.ref("Users/"+this.props.UID+"/Stocks");
        let TransactionRef = database.ref("Users/"+this.props.UID+"/Transactions/Buy");

        //add stock to portfolio
        database.ref("Users/"+this.props.UID+"/Stocks/"+name).once("value",(snapshot) =>{
            let val = 0;
            let number = 0;
            if (snapshot.exists()) {
                let json = snapshot.toJSON();
                val = json["Value"];
                number = json["Shares"];
            }
            StockListRef.child(name).set({
                Value:(price*num + val),
                Shares:(parseInt(num) + number)
            }).catch((error)=>{alert(error.message)});
        });


        //add purchase to transactions
        let TransName = name + "-" + (new Date()).getTime();
        TransactionRef.child(TransName).set({
            Date: date,
            Price: price,
            Shares: parseInt(num)
        });

        //Update amount of cash - notice once here very important for only single call
        database.ref("Users/"+this.props.UID+"/Money").once('value').then((snapshot) => {
            let newAmount = snapshot.val() - totalSpend;
            database.ref("Users/"+this.props.UID).update({Money:newAmount});
        });

        //makes the modal get unmounted
        this.setState({confirmed: true});
    }


    render(){
        let popUp = null;
            if (this.state.confirmed === false) {
                popUp = (
                    <ControlledPopup name={"Buy Stock"} content={<span> <BuyModal stock={this.state.StockInfo}
                                                                                  confirm={this.purchase}/> </span>}/>
                );
            }
        let stockData = "";
        if (this.state.StockInfo !== null) {
            stockData = (
                <div style={{ "textAlign": "center" }}>
                    {popUp}
                    <div class="d-flex justify-content-center">
                        <div className="p-2 bd-highlight">
                            <b>Name: </b>{this.state.StockInfo.companyName}
                            <br/>
                            <b>Sector: </b>{this.state.StockInfo.sector}
                        </div>
                        <div className="p-2 bd-highlight">
                            <b>Price: </b>{this.state.StockInfo.latestPrice}
                            <br/>
                            <b>Market Capacity:</b> {this.state.StockInfo.marketCap}
                        </div>
                        <div className="p-2 bd-highlight">
                            <b>52 Week Range:</b> {this.state.StockInfo.week52Low + " - " + this.state.StockInfo.week52High}
                            <br/>
                            <b>Price/Earnings Ratio: </b>{this.state.StockInfo.peRatio}
                        </div>
                        <div className="p-2 bd-highlight">
                            <b>% Day Change: </b>{this.state.StockInfo.changePercent}%
                            <br/>
                            <b>Average Volume:</b> {this.state.StockInfo.avgTotalVolume}
                        </div>
                    </div>
                    <div>
                        <Charts ticker={this.state.Ticker}/>
                    </div>
                </div>

            );
        }

        return(
            <div style={{ "textAlign": "center" }}>
                <form onSubmit={(e, input = document.getElementById("TickerBox").value) => { this.StockIn(e, input) }}>
                    <label>
                        Enter the Ticker of A Stock: &nbsp;
                        <input type="text" id="TickerBox" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {stockData}
                {this.state.Status}
            </div>
        );
    }
}

export default Buy;