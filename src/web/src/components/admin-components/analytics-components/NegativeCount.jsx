import React from 'react'
import { useState, useEffect } from 'react';
import { firestore } from '../../../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import styled from 'styled-components';
import commentsSVG from './arts/comments.svg'

export default function NegativeCount() {
    const [negativeCount, setPositiveCount] = useState();

    useEffect(() => {
        const analyticsRef = doc(firestore, 'admin', 'analytics','negative','2023-1')
       getDoc(analyticsRef).then((result)=>{
        const data = result.data();
        if(data['negative']){
            setPositiveCount(data['negative'])
        }else{
            setPositiveCount(0)
        }
       })
    }, []);


    return (
        <Container>
            <Top>
                <Info>Negative</Info>
                <Icon src={commentsSVG}></Icon>
            </Top>
            <Bottom>
                <Count>{negativeCount && negativeCount}</Count>
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

