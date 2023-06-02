import styled from "styled-components";
import { UseAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useState } from "react";


const Users = (props) => {
    const [userList, setUserList] = useState();
    const [renderedUsers, setRenderedUsers] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [userRender, setUserRender] = useState();

    const { getUsers } = UseAuth();

    function userSelected(user){
        setSelectedUser(user)
    }

    useEffect(()=>{
        if(!selectedUser) return;
        const userData = selectedUser.data();
        setUserRender(
            <UserProfileView>
                <BackButton onClick={()=>{setUserRender(null)}}>X</BackButton>
                <UserProfile>
                    <h1>Name: {userData.last_name}, {userData.first_name}</h1>
                    <h2>Age: {userData.age}</h2>
                    <h2>Gender: {userData.gender}</h2>
                    <h2>Home Adress: {userData.location}</h2>
                    <h2>Contact: {userData.phone_number}</h2>
                    <h2>Type of Tourist: {userData.tourist_type}</h2>
                </UserProfile>
            </UserProfileView>
        )

    },[selectedUser])
    
    function renderList(){
        const rows = []
        if(userList){
            userList.map((doc)=>{
                const user = doc.data();
                rows.push(
                    <div onClick={()=>{
                        userSelected(doc)
                    }}>{user.last_name}, {user.first_name} ({user.age} yrs old)</div>
                )
            })
        }
        setRenderedUsers(rows);
    }

    useEffect(() => {
        let usersArr = [];
        getUsers().then(users => {
            users.forEach((doc) => {
                usersArr.push(doc)
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
            {
                userRender && userRender
            }
        </Container>

    )
}

const Container = styled.div`
   
`;

const Title = styled.h1`
    text-align: center;
`;

const UserList = styled.div`
    border-radius: 11px;
    width: 80%;
    margin: 0 auto;
    margin-top: 5em;
    padding: 1em 0.5em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1em;

    div{
        padding: 7px 1em;
        border: 1px solid #C73866;
        min-width: 180px;
        border-radius: 10px;
    }
`;

const User = styled.div`
    display: flex;
    justify-content: space-between;
    
`;

const UserProfileView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0000005c;
`;

const BackButton = styled.button`
    position: absolute;
    right: 30px;
    top: 30px;
    transform: scale(2);
    float: right;
`;

const UserProfile = styled.div`
    background-color: #FE676E;
    color: white;
    width: 600px;
    height: 80vh;
    /* overflow-y: scroll; */
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: space-evenly;
    padding: 2em;

`;

const Actions = styled.div`
    display: flex;
    flex-wrap: wrap;
    border-radius: 15px;
    background: #C73866;
    box-shadow: inset 10px 10px 20px #C73866,
                inset -10px -10px 20px #C73866;
    width: 100%;
    height: 50%;
    padding: 1em;
    box-sizing: border-box;
    gap: 0.5em;
    align-content: flex-start;
    justify-content: space-between;
`;

const Action = styled.button`
    height: min-content;
    padding: 0.5em;
`;

export default Users