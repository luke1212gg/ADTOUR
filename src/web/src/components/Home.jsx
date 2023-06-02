import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import AdtourLogo from '../adtour_logo.svg';
import Overview from './admin-components/Overview';
import Reports from './admin-components/Reports';
import Settings from './admin-components/Settings';
import { UseAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const overViewRef = useRef();
  const reportsRef = useRef();
  const settingsRef = useRef();
  const [currentNavigation, setCurrentNavigation] = useState(overViewRef);
  const [contentRender, setContentRender] = useState(null);
  const { currentUser, getData, logOut } = UseAuth();
  


  function selectNavigation(navRef) {
    if (currentNavigation == null) return;
    if (currentNavigation === navRef) return;
    currentNavigation.current.classList.remove('NavigationSelected');
    setCurrentNavigation(navRef);
    updateNavigation(navRef);
  }

  useEffect(() => {
    currentNavigation.current.classList.add('NavigationSelected');
  }, [currentNavigation]);

  useEffect(()=>{
    setContentRender(<Overview></Overview>);
  },[])

  function updateNavigation(navRef) {
    let targetContent = navRef.current.innerHTML;
    switch (targetContent) {
      case 'Overview':
        setContentRender(<Overview></Overview>);
        break;
      case 'Reports':
        setContentRender(<Reports></Reports>);
        break;
      case 'Settings':
        setContentRender(<Settings></Settings>);
        break;
      default:
        break;
    }
  }

  return (
    <Container>
      {!currentUser &&
        <Navigate to="/login"></Navigate>
      }
      <NavigationContainer>
        <Logo src={AdtourLogo}></Logo>
        <Navigation ref={overViewRef} onClick={() => selectNavigation(overViewRef)}>Overview</Navigation>
        <Navigation ref={reportsRef} onClick={() => selectNavigation(reportsRef)}>Reports</Navigation>
        <Navigation ref={settingsRef} onClick={() => selectNavigation(settingsRef)}>Settings</Navigation>
        <Navigation onClick={() => logOut()}>Logout</Navigation>
      </NavigationContainer>
      <ContentContainer>
        {contentRender}
      </ContentContainer>
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #e5e5e5;
`;

const NavigationContainer = styled.div`
  height: 100vh;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
`;
const ContentContainer = styled.div`
  height: 100vh;
  width: 100%;
`;

const Logo = styled.img`
  width: 70%;
`;

const Navigation = styled.button`
  width: 90%;
  border-radius: 20px;
  border: none;
  padding: 1em 0em;
  background-color: transparent;
  font-size: 1.25em;
  text-align: start;
  padding-left: 1em;
  
`;