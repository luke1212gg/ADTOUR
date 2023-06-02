import { React } from 'react';
import styled from 'styled-components';
import DailyAppVisits from './analytics-components/DailyAppVisits';
import UserCount from './analytics-components/UserCount';
import { useRef, useState, useEffect } from 'react';
import './styles/overview.styles.css'
import MonthlyAnalytics from './analytics-components/MonthlyAnalytics';
import YearlyAnalytics from './analytics-components/YearlyAnalytics';
import { UseAuth } from '../../contexts/AuthContext';
import { firestore } from '../../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

export default function Overview() {
  const monthsRef = useRef();
  const yearsRef = useRef();
  
  const [selectedMenu, setSelectedMenu] = useState(monthsRef);
  const [menuToRender, setmenuToRender] = useState();
  const {currentUser, logOut} = UseAuth();
  const [adminName, setAdminName] = useState();

  useEffect(() => {
    function menuToRenderLogic(){
      if(selectedMenu == monthsRef){
        setmenuToRender(<MonthlyAnalytics />)
      }else{
        setmenuToRender(<YearlyAnalytics />)
      }
    }  
    selectedMenu.current.classList.add("menu_selected");
    menuToRenderLogic();
  }, [selectedMenu]);

  function changeMenu(menuRef){
    selectedMenu.current.classList.remove("menu_selected");
    setSelectedMenu(menuRef);
  }

  useEffect(()=>{
    if(!currentUser){
      return;
    }
    getDoc(doc(collection(firestore, 'users'), currentUser.uid)).then((value)=>{
      const data = value.data();
      setAdminName(data['first_name'] + " " + data['last_name'])
    })
    getDoc(doc(collection(doc(collection(firestore, 'admin'), 'users'), 'admin_access'),currentUser.email)).then((value)=>{
      if(!value.exists()){
        console.log('hello')
        alert("no admin access!");
        logOut();
      }else{
        if(!value.data()['permitted']){
          alert("no admin access!");
          logOut();
        }
      }
    })
  }, [])

  


  return (
    <Container>
      <Header>
        <Title><h1>Overview</h1> <p>Exploring the latest of Tourism Performance in Iloilo City</p></Title>
        <Profile>
          <Frame></Frame>
          <Name>{adminName && adminName}</Name>
        </Profile>
      </Header>
      <Selection>
          <Menu ref={monthsRef} onClick={()=>{changeMenu(monthsRef)}}>Months</Menu>
          <Menu ref={yearsRef} onClick={()=>{changeMenu(yearsRef)}}>Years</Menu>
        </Selection>
        <hr />
      <Analytics>
        {
          menuToRender && menuToRender
        }
      </Analytics>
    </Container>
  )
}

const Countables = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
  width: 100%;
`;



const Menu = styled.button`
  border: none;
  padding: 1em;
  background-color: transparent;
  font-size: 1.1em;
  color: #00000096;
  width: 100px;
`;

const Analytics = styled.div`
  display: flex;
  /* flex-direction: column; */
  flex-wrap: wrap;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  background-color: #ececec !important;

  hr {
    border-top: 1px solid #C73866;
    width: calc(100% - 50px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  padding-left: 1em;

  h1{
    margin-bottom: 0.1em;
  }
  p{
    margin-top: 0.1em;
  }
`;

const Profile = styled.div`
  display: flex;
  width: 200px;
  height: 3em;
  background-color: white;
  margin-right: 2em;
  border-radius: 10px;
  align-items: center;
  padding: 0px 10px;
  gap: 5px;
`;

const Frame = styled.div`
  width: 30px;
  height: 30px;
  background-color: gray;
  border-radius: 50%;
`;

const Name = styled.h3``;



const Selection = styled.div`
  display: flex;
  width: calc(100% - 50px);
  margin: 0 auto;
`;