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

    StockIn(event, ticker) {
        event.preventDefault();
        this.setState({confirmed: false});
        let StockName = null, Price = null;

        iex.stockQuote(ticker, false).then((item) => {
                if (item === "Unknown symbol") {
                    this.setState({
                            Status: "Ticker Not Found",
                            StockInfo:null,
                            Ticker: null
                        }
                    );
                } else {
                    let price = item.latestPrice;
                    let name = item.companyName;

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

    purchase(num,item){
        let name = item.symbol;
        let date = this.todaysDate();
        let price = item.latestPrice;
        let StockListRef = database.ref("Users/"+this.props.UID+"/Stocks");
        StockListRef.child(name).set({
            Date:date,
            Price:price,
            Shares:num
        }).catch((error)=>{alert(error.message)});
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