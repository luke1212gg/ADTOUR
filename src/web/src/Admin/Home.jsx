import styled from "styled-components";
import { UseAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useState } from "react";


const Home = (props) => {
    const [userList, setUserList] = useState();
    const [renderedUsers, setRenderedUsers] = useState();

    const { getUsers } = UseAuth();
    
    function renderList(){
        const rows = []
        if(userList){
            userList.map((user)=>{
                rows.push(
                    <div>{user.name}({user.age} yrs old)</div>
                )
            })
        }
        setRenderedUsers(rows);
    }

    useEffect(() => {
        let usersArr = [];
        getUsers().then(users => {
            users.forEach((doc) => {
                usersArr.push(doc.data())
            })
        }).then(()=>{
        setUserList(usersArr)
        })
    }, []);

    useEffect(()=>{
        renderList();
    },[userList])

    return (
        <Container>
            <Title>List of Users</Title>

            <UserList>
                {renderedUsers}
            </UserList>

        </Container>

    )
}

const Container = styled.div`
    width: 50vw;
    height: 80vh;

    margin: 0 auto;
    margin-top: 5vh;
    border-radius: 50px;
    background: #e0e0e0;
    box-shadow:  20px 20px 60px #bebebe,
                -20px -20px 60px #ffffff;
    padding-top: 5em;
`;

const Title = styled.h1`
    text-align: center;
`;

const UserList = styled.div`
    overflow-y: scroll;
    border-radius: 11px;
    background: #e0e0e0;
    box-shadow: inset 7px 7px 14px #bebebe,
                inset -7px -7px 14px #ffffff;
    width: 50%;
    height: 50vh;
    margin: 0 auto;
    margin-top: 5em;
    padding: 1em 0.5em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    div{
        padding: 7px 1em;
        border: 1px solid #2261a8;
        min-width: 180px;
        border-radius: 10px;
    }
`;

const User = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default Home