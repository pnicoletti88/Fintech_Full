import React, { Component } from 'react';
import firebase, { auth, provider, database, db } from '../firebase.js';

class Show extends Component{
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
                let tempObj = { Name: "", Value: "", Shares: "" };
                if (key !== "NullStock") {
                    tempObj.Name = key;
                    for (let key2 in json[key]) {
                        tempObj[key2] = json[key][key2];
                    }

                    list.push(tempObj)
                }
            }

            this.formatTable(list);
        });

    }

    formatTable(data){
        let out;
        if(data.length !== 0) {
            let head = (
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Average Purchase Price</th>
                    <th scope="col">Number of Shares</th>
                </tr>
                </thead>);
            let rows = [];
            for (let x = 0; x < data.length; x++) {
                ;
                rows.push((<tr>
                        <th scope="row">{data[x].Name}</th>
                        <td>{data[x].Value/data[x].Shares}</td>
                        <td>{data[x].Shares}</td>
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
                <div style={{ "textAlign": "center" }}>Welcome! You currently don't own any stocks! Please buy some!</div>
            );
        }
        this.setState({stocks: out});
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

export default Show;