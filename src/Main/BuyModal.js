import React, { Component } from 'react';


class BuyModal extends Component{
    constructor(props){
        super(props);
        this.BuyRequest = this.BuyRequest.bind(this);
        this.TradeConfirmed = this.TradeConfirmed.bind(this);
        this.state = {
            status: "initial",//initial for screen with number of shares - final for confirmation
            purchasePrice: 0,
            numShares: 0,
            errorMsg: ""
        }
    }

    BuyRequest(e,num){
        e.preventDefault();
        let purchasePrice = num * this.props.stock.latestPrice;
        if (purchasePrice < this.props.userCash) {
            this.setState({
                status: "final",
                purchasePrice: purchasePrice,
                numShares: num
            })
        }else{
            this.setState({errorMsg : "Error, this costs $" + Math.round(purchasePrice*100)/100 +" USD - you do not have enough money to make the purchase"});
        }
    }

    TradeConfirmed(){
        this.props.confirm(this.state.numShares,this.props.stock, this.state.purchasePrice);
    }

    render(){
        let out;
        if (this.state.status === "initial"){
            out = (
                <form onSubmit = {(e,num = document.getElementById("NumShares").value) => {this.BuyRequest(e,num)}}>
                    <div className="form-group">
                        <label>Number of Shares:</label>
                        <input className="form-control" type="number" min="1" id="NumShares"/>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            );
        }else if (this.state.status === "final"){
            out = (<div>
                This will cost ${Math.round(this.state.purchasePrice*100)/100}.<br/>
                Are you sure you wish to continue and make the Trade?<br/>
                <button onClick={this.TradeConfirmed}>Confirm Trade</button>
            </div>);
        }


        return(
            <div>
                <h3>Buy {this.props.stock.companyName}</h3>
                {this.state.errorMsg}
                {out}
            </div>
        );
    }

}

export default BuyModal;

