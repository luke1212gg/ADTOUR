import { React } from 'react';
import styled from 'styled-components';
import { useRef, useState, useEffect } from 'react';
import './styles/overview.styles.css'
import MonthlyAnalytics from './analytics-components/MonthlyAnalytics';
import YearlyAnalytics from './analytics-components/YearlyAnalytics';
import { UseAuth } from '../../contexts/AuthContext';
import { firestore } from '../../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import UserCount from './analytics-components/UserCount';
import PositiveCount from './analytics-components/PositiveCount';
import NegativeCount from './analytics-components/NegativeCount';
import FeedbackCount from './analytics-components/FeedbackCount';
import Performance from './analytics-components/Performance';
import Gender from './analytics-components/Gender';
import DailyAppVisits from './analytics-components/DailyAppVisits';
import TouristType from './analytics-components/TouristType';
import DestinationsAnalytics from './analytics-components/DestinationsAnalytics';
import Feedbacks from './analytics-components/Feedbacks';

export default function Reports() {
  const monthsRef = useRef();
  const yearsRef = useRef();

  const [selectedMenu, setSelectedMenu] = useState(monthsRef);
  const [menuToRender, setmenuToRender] = useState();
  const { currentUser, logOut } = UseAuth();
  const [adminName, setAdminName] = useState();
  const [generate, setGenerate] = useState(false);

  const reports = {
    users: false,
    positive: false,
    negative: false,
    feedback: false,
    performance: false,
    destribution: false,
    gender: false,
    visits: false,
    tourist: false,
    destinations: false,
    feedbacks: false,
  }

  const [toGenerate, setToGenerate] = useState(reports);



  useEffect(() => {
    function menuToRenderLogic() {
      if (selectedMenu == monthsRef) {
        setmenuToRender(<MonthlyAnalytics />)
      } else {
        setmenuToRender(<YearlyAnalytics />)
      }
    }
    selectedMenu.current.classList.add("menu_selected");
    menuToRenderLogic();
  }, [selectedMenu]);

  function changeMenu(menuRef) {
    selectedMenu.current.classList.remove("menu_selected");
    setSelectedMenu(menuRef);
  }

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    getDoc(doc(collection(firestore, 'users'), currentUser.uid)).then((value) => {
      const data = value.data();
      setAdminName(data['first_name'] + " " + data['last_name'])
    })
    getDoc(doc(collection(doc(collection(firestore, 'admin'), 'users'), 'admin_access'), currentUser.email)).then((value) => {
      if (!value.exists()) {
        console.log('hello')
        alert("no admin access!");
        logOut();
      } else {
        if (!value.data()['permitted']) {
          alert("no admin access!");
          logOut();
        }
      }
    })
  }, [])

  useEffect(() => {
    console.log(reports)
  }, [reports])




  return (
    <Container>
      {
        generate && 
        <ReportView> 
          {console.log(toGenerate.users)}
          {toGenerate.users && <UserCount />}
          {toGenerate.positive && <PositiveCount />}
          {toGenerate.negative && <NegativeCount />}
          {toGenerate.feedback && <FeedbackCount />}
          {toGenerate.performance && <Performance />}
          {toGenerate.gender && <Gender />}
          {toGenerate.visits && <DailyAppVisits />}
          {toGenerate.tourist && <TouristType />}
          {toGenerate.destinations && <DestinationsAnalytics />}
          {toGenerate.feedbacks && <Feedbacks />}
        </ReportView>
      }
      <Header>
        <Title><h1>Report</h1> <p>Exploring the latest of Tourism Performance in Iloilo City</p></Title>
        <Profile>
          <Frame></Frame>
          <Name>{adminName && adminName}</Name>
        </Profile>
      </Header>
      <Selection>
        <Menu ref={monthsRef} onClick={() => { changeMenu(monthsRef) }}>Months</Menu>
        <Menu ref={yearsRef} onClick={() => { changeMenu(yearsRef) }}>Years</Menu>
      </Selection>
      <hr />
      <Analytics>
        <Countables>
          <UserCount />
          <PositiveCount />
          <NegativeCount />
          <FeedbackCount />
        </Countables>
      </Analytics>
      <ReportChecking>
        <CheckBoxes>
          <Info>Costumize your report</Info>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.users = value.target.checked; console.log(reports) }} />
            <Label>Total No. of Users</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.positive = value.target.checked; console.log(reports) }} />
            <Label>Positive Ratings</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.negative = value.target.checked; console.log(reports) }} />
            <Label>Negative Ratings</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.feedback = value.target.checked; console.log(reports) }} />
            <Label>Total No. of Feedback</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.performance = value.target.checked; console.log(reports) }} />
            <Label>Iloilo Tourism Performance</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.gender = value.target.checked; console.log(reports) }} />
            <Label>Statistics by Gender</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.visits = value.target.checked; console.log(reports) }} />
            <Label>Daily App Visits</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.tourist = value.target.checked; console.log(reports) }} />
            <Label>Type of Tourist</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.destinations = value.target.checked; console.log(reports) }} />
            <Label>Tourist Attraction Responses</Label>
          </div>
          <div>
            <CheckBox type="checkbox" onChange={(value) => { reports.feedbacks = value.target.checked; console.log(reports) }} />
            <Label>Feedbacks</Label>
          </div>
        </CheckBoxes>
        <GenerateReport>
          <button onClick={() => {setGenerate(true); setToGenerate(reports)}}>Generate PDF</button>
        </GenerateReport>
      </ReportChecking>
    </Container>
  )
}

const ReportView = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: aliceblue;
  position: absolute;
  left: 0;
  display: flex;
  gap: 1em;
  padding: 5em;
  flex-direction: column;
  align-items: center;
`;

const Info = styled.p`
  font-size: 1.3em;
  color: #C73866;
`;

const GenerateReport = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  width: 50%;

  button{
    font-size: 2.5em;
    border-radius: 25px;
    padding: 1em;
    border: none;
    background-color: #C73866;
    color: #FFF;
  }
`;

const CheckBoxes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 50%;
  margin-left: 10em;
  color: black;
`;

const ReportChecking = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CheckBox = styled.input``;
const Label = styled.label``;

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