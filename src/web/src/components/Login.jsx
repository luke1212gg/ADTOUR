import React from 'react';
import styled from 'styled-components';
import { UseAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRef } from 'react';

export default function Login() {
  const { currentUser, logIn} = UseAuth();

  const emailRef = useRef();
  const passwordRef = useRef();


  function handleLogin(event){
    event.preventDefault();

    const result = logIn(emailRef.current.value, passwordRef.current.value)
    result.then((res) => {
        if(!res[0]){
            let error = res[1]
            alert(error.split(":")[2])
        }
    })

    
    
  }

    return (
        <Container>
            {
                currentUser &&
                <Navigate to="/"></Navigate>
            }
            
            <Title>Login to Console as ADMIN</Title>
            <LoginForm onSubmit={handleLogin}>
                <Email>
                    <Info>Email</Info>
                    <Input ref={emailRef} />
                </Email>
                <Password>
                    <Info>Password</Info>
                    <Input ref={passwordRef} type="password"/>
                </Password>
                <SignIn type="submit" value="Sign In"/>
            </LoginForm>
        </Container>
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #C73866;
    color: white;
`;

const Title = styled.h1`
    margin-top: -1em;
`;

const LoginForm = styled.form`
    width: 300px;
    height: max-content;
    display: flex;
    flex-direction: column;
    padding: 1em;
    align-items: center;
    border-radius: 27px;
    background: #FE676E;
    color: white;
    box-shadow:  7px 7px 14px #bababa,
                -7px -7px 14px #ffffff;

    p{
        margin: 0px;
    }
`;

const Email = styled.div`
    margin-bottom: 10px;
    
    
`;
const Password = styled.div``;
const SignIn = styled.input`
    width: 50%;
    border-radius: 20px;
  border: none;
    margin: 10px;
    padding: 0.5em;
    color: white;
    background-color: #C73866;
`;
const SignUp = styled.a`
    font-size: 12px;
`;

const Info = styled.p``;
const Input = styled.input``;



