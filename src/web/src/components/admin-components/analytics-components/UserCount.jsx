import {React, useEffect, useState} from 'react'
import styled from 'styled-components'
import userSVG from './arts/users.svg'
import { firestore } from '../../../firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function UserCount() {
    const [userCount, setUserCount] = useState();

    useEffect(() => {
       const usersRef = collection(firestore, 'users')
       getDocs(usersRef).then((result) =>{
        setUserCount(result.size);
       })
    }, []);


    return (
        <Container>
            <Top>
                <Info>Total No. of Users</Info>
                <Icon src={userSVG}></Icon>
            </Top>
            <Bottom>
                <Count>{userCount && userCount}</Count>
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

