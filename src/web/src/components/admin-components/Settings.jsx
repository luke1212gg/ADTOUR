import React from 'react';
import styled from 'styled-components';

export default function Settings() {
  return (
    <Container>
      <Heading>
        <Title>Settings</Title>
        <Description>Manage Users and Destinations</Description>
      </Heading>
      <ContentContainer>
        <Card>
          <CardTitle>Actions</CardTitle>
          <CardFunctions>
            <CardFunction onClick={()=>{window.location = "/users"}}>Manage users</CardFunction>
            <CardFunction onClick={()=>{window.location = "/destinations"}}>Manage destinations</CardFunction>
          </CardFunctions>
        </Card>
      </ContentContainer>
    </Container>
  )
}


const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
`;

const Heading = styled.div`

`;

const Title = styled.h1`
  font-size: 4em;
  margin: 0px;
`;

const Description = styled.p`
  margin-left: 3em;
  font-size: 1.5em;
  color: gray;
`;

const ContentContainer = styled.div`
  padding-top: 5em;
  display: flex;
  justify-content: space-evenly;
`;

const Card = styled.div`
  width: 35%;
  height: 400px;
  border-radius: 20px;
  background-color: #FFDCA2;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardTitle = styled.h1`
  margin-bottom: 0px;
`;
const CardDescription = styled.p`
  margin-top: 0.5em;

`;

const CardFunctions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3em;
  padding: 0px 2em;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  gap: 0.5em;
`;

const CardFunction = styled.button`
  border: none;
  border-radius: 5px;
  padding: 10px 10px;
  background-color: #C73866;
  color: white;
`;