import Chart from 'react-google-charts';
import React, { Component } from 'react';
import { IEXClient } from 'iex-api'
import * as _fetch from 'isomorphic-fetch'
const iex = new IEXClient(_fetch);

class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Data: null,
            Name: null,
            MaxInt: 0,
            Chart: null
        };
        this.getChartData();
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }


    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }



    getChartData(){
        let data = [];
        iex.stockChart(this.props.ticker,"1m").then((item) => {
                if (item === "Unknown symbol") {
                    this.setState({
                            Data: null,
                        }
                    );
                } else {
                    data.push([{type: 'number', label: 'x'},{type: 'number', label: 'values'}]);
                    for (let x = 0; x < item.length; x++){
                        data.push([new Date(item[x].date),item[x].close]);
                        if (item[x].close > this.state.MaxInt){
                            this.setState({MaxInt: item[x].close});
                        }
                    }
                    this.setState({
                        Data: data,
                    });
                    this.generateChart();
                }
            }
        );
    }
    generateChart(){
        this.setState({
            Chart: (
                <Chart
                width={this.state.width*0.85}
                height={500}
                chartType="AreaChart"
                loader={<div>Loading Chart</div>}
                data={this.state.Data}
                options={{
                    title: {title: 'bitchass'},
                    hAxis: {type: 'date', title: 'Date'},
                    vAxis: {title: 'Price', minValue: 0, maxValue:(this.state.MaxInt*1.25)},
                    intervals: {style: 'sticks'},
                    legend: 'none',
                    chartArea: {width: '80%', height: '85%'},
                }}
            />)
        })
    }

    render() {
        //code to compile chart

        //alert(this.state.MaxInt);
        return(
            <div style={{ "display": "inline-block","border":"1px solid black" }}>
            {this.state.Chart}
            </div>
            );
    }
}

export default Charts;