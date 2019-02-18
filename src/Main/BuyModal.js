import React, { Component } from 'react';


class BuyModal extends Component{
    constructor(props){
        super(props);
        this.BuyRequest = this.BuyRequest.bind(this);
        this.TradeConfirmed = this.TradeConfirmed.bind(this);
        this.state = {
            status: "initial",//initial for screen with number of shares - final for confirmation
            purchasePrice: 0,
            numShares: 0
        }
    }

    BuyRequest(e,num){
        e.preventDefault();
        let puchasePrice = num * this.props.stock.latestPrice;
        this.setState({
            status:"final",
            purchasePrice: puchasePrice,
            numShares: num
        })
    }

    TradeConfirmed(){
        this.props.confirm(this.state.numShares,this.props.stock);
    }

    render(){
        let out;
        if (this.state.status === "initial"){
            out = (
                <form onSubmit = {(e,num = document.getElementById("NumShares").value) => {this.BuyRequest(e,num)}}>
                    <div className="form-group">
                        <label>Number of Shares:</label>
                        <input className="form-control" type="text" id="NumShares" />
                    </div>
                    <input type="submit" className="btn btn-secondary btn-space" value="Submit" />
                </form>
            );
        }else if (this.state.status === "final"){
            out = (<div>
                This will cost ${this.state.purchasePrice}.<br/>
                Are you sure you wish to continue and make the Trade?<br/>
                <button onClick={this.TradeConfirmed}>Confirm Trade</button>
            </div>);
        }


        return(
            <div>
                <h3>Buy {this.props.stock.companyName}</h3>
                {out}
            </div>
        );
    }

}

export default BuyModal;

