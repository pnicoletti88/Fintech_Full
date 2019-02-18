import React, { Component } from 'react';
import {database} from "../firebase";

class Buy extends Component{
    constructor(props){
        super(props);

    }


    purchase(e,name,price,num,date){
        e.preventDefault();
        alert(this.props.UID);
        let StockListRef = database.ref("Users/"+this.props.UID+"/Stocks");
        //let newStock = StockListRef.push({Name:name});
        StockListRef.child(name).set({
            Date:date,
            Price:price,
            Shares:num
        }).catch((error)=>{alert(error.message)})

    }


    render(){


        return(
            <div>
                <form onSubmit={(e, name = document.getElementById("Name").value ,
                                 price = document.getElementById("Date").value,
                                 num =document.getElementById("Price").value ,
                                 date = document.getElementById("Num").value)=> {this.purchase(e,name,price,num,date)}}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input className="form-control" type="text"id="Name"
                               placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input className="form-control" type="text" id="Date"
                               placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input className="form-control" type="text" id="Price"
                               placeholder="Enter email"/>
                    </div>
                    <div className="form-group">
                        <label>Number of Shares:</label>
                        <input className="form-control" type="text" id="Num"
                               placeholder="Enter email"/>
                    </div>
                    <input type="submit" className="btn btn-secondary btn-space" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default Buy;