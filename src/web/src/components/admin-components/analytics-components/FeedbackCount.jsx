import React from 'react'
import { useState, useEffect } from 'react';
import commentsSVG from './arts/comments.svg'
import { firestore } from '../../../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';

export default function FeedbackCount() {
    const [feedbackCount, setfeedbackCount] = useState();

    useEffect(() => {
       const analyticsRef = doc(collection(firestore, 'admin'), 'analytics')
       getDoc(analyticsRef).then((result)=>{
        const data = result.data();
        setfeedbackCount(data['check_ins'])
       })
    }, []);


    return (
        <Container>
            <Top>
                <Info>Total No. of Check-in</Info>
                <Icon src={commentsSVG}></Icon>
            </Top>
            <Bottom>
                <Count>{feedbackCount && feedbackCount}</Count>
            </Bottom>
        </Container>
    )
}


const Container = styled.div`
    width: 200px;
    background-color: #FE676E;
    padding: 10px;
    border-radius: 10px;
    box-sizing: border-box;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
`;
const Bottom = styled.div``;

const Info = styled.p`
    color: #FFFFFF;
    margin: 0px;
`;
const Icon = styled.img``;

const Count = styled.p`
    font-weight: bold;
    margin: 0px;
    font-size: 2em;
    color: #FFFFFF;
`;
