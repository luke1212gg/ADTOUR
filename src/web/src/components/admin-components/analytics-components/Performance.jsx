import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { firestore } from '../../../firebase';
import { collection, doc, getDocs } from 'firebase/firestore';

const firstData = [
    {
        name: 'January',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'February',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'March',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'April',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'May',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'June',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'July',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'August',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'September',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'October',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'November',
        count: 0,
        pv: 0,
        amt: 0,
    },
    {
        name: 'December',
        count: 0,
        pv: 0,
        amt: 0,
    },
]

export default class Performance extends PureComponent {
    static demoUrl = 'https://codesandbox.io/s/simple-area-chart-4ujxw';
    
    state = {
        data: []
    }
    
    componentDidMount(){
        this.getData();
    }

    getData = () => {
        const today = new Date(Date.now());
        console.log(today.getMonth(), this.state.data[today.getMonth()])
        getDocs(collection(doc(collection(firestore, 'admin'), 'analytics'), 'positive')).then((result) => {
            result.docs.forEach((pdata) => {
                const newData = firstData;
                console.log(newData)
                newData[pdata.id.split("-")[1] - 1]['count'] = pdata.data()['positive']
                console.log(newData[pdata.id.split("-")[1] - 1])
                this.setState({
                    data: newData
                }, () => {
                    console.log(this.state.data)
                })
            })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.data && <AreaChart
                    width={500}
                    height={275}
                    data={this.state.data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#FD8F52" fill="#FFBD71" />
                </AreaChart>
                }
                
            </div>
        );
    }
}


const Container = styled.div``;