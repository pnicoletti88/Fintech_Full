import React, { Component } from 'react';
import firebase, { auth, provider, database, db } from '../firebase.js';

class Sell extends Component{
    constructor(props){
        super(props);
        this.state = {stocks:null}
    }

    GetData(UID){
        database.ref("Users/"+UID+"/Stocks").on('value', (snapshot) => {
            let list = [];
            let json;

            json = snapshot.toJSON();
            for (let key in json){
                if (key !== "NullStock") {
                    let tempObj = {Name: "", Date: "", Price: "", Shares: ""};
                    tempObj.Name = key;
                    for (let key2 in json[key]) {
                        tempObj[key2] = json[key][key2];
                    }

                    list.push(tempObj)
                }
            }

            //this.setState({stocks:list});
            this.formatTable(list);
        });

    }

    formatTable(data){
        let out;
        if (data.length !==0) {
            let head = (
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Purchase Price</th>
                    <th scope="col">Number of Shares</th>
                    <th scope="col">Sell</th>
                </tr>
                </thead>);
            let rows = [];
            for (let x = 0; x < data.length; x++) {
                ;
                rows.push((<tr>
                        <th scope="row">{data[x].Name}</th>
                        <td>{data[x].Date}</td>
                        <td>{data[x].Price}</td>
                        <td>{data[x].Shares}</td>
                        <td>
                            <button onClick={() => {
                                this.Sold(data[x].Name)
                            }}>Sell
                            </button>
                        </td>
                    </tr>
                ));
            }

            out = (
                <table className="table">
                    {head}
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            );
        }else{
            out = (
                <div style={{ "textAlign": "center" }}>You currently don't own any stocks!</div>
            );
        }
        this.setState({stocks: out});
    }


    Sold(name){
        database.ref("Users/"+this.props.UID+"/Stocks/"+name).remove().catch((error)=> {alert(error.message)});
    }

    render(){

        let table = null;
        if (this.state.stocks !== null){
            table = this.state.stocks;
        }else{
            this.GetData(this.props.UID);
        }
        return(
            <div>
                {table}
            </div>
        );
    }
}

export default Sell;