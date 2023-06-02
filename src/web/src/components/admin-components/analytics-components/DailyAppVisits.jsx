import React from 'react'
import { useEffect, useState } from 'react';
import { firestore } from '../../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import { useRef } from 'react';


function DailyAppVisits() {
    const [analyticsData, setAnalyticsData] = useState();
    const DaysRef = {
        sunday: useRef(),
        monday: useRef(),
        tuesday: useRef(),
        wednesday: useRef(),
        thursday: useRef(),
        friday: useRef(),
        saturday: useRef(),
    }


    const [day, setDay] = useState();
    const [logins, setLogins] = useState({});
    let loginsReference = {
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
    }

    useEffect(() => {
        let analyticsReference = doc(collection(firestore, "admin"), "analytics");
        getDoc(analyticsReference).then((result) => {
            setAnalyticsData(result.data());
        })
        var today = new Date(Date.now());
        var month = today.getUTCMonth() + 1; 
        var day = today.getDate();
        var year = today.getUTCFullYear();
        var todayDate = year + "-" + month + "-" + day;
        console.log(todayDate)
        today = new Date(todayDate)

        DaysRef[getDay(today.getDay())].current.classList.add('today')

        let loginsDataReference = collection(doc(collection(firestore, "admin"), "analytics"), "logins");
        getDocs(loginsDataReference).then((results) => {
            results.forEach((result) => {
                if (logins != null) {
                    loginsReference = logins;
                }
                loginsReference[getDay(new Date(result.id).getDay())] = result.data().logins;
                setLogins(loginsReference);
            })
        })

    }, []);

    function getDay(day) {
        switch (day % 7) {
            case 0:
                return ("sunday");
            case 1:
                return ("monday");
            case 2:
                return ("tuesday");
            case 3:
                return ("wednesday");
            case 4:
                return ("thursday");
            case 5:
                return ("friday");
            case 6:
                return ("saturday");
            default:
                break;
        }
    }

    



    return (
        <Container>
            <Title>Daily App Visits</Title>
            <DailyAppVisitsDays>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["sunday"] != null ? logins["sunday"] : 0}</div>
                        <div ref={DaysRef.sunday} className="barDraw" style={{ height: (logins && logins["sunday"] != null ? logins["sunday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Sun</div>
                </div>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["monday"] != null ? logins["monday"] : 0}</div>
                        <div ref={DaysRef.monday} className="barDraw" style={{ height: (logins && logins["monday"] != null ? logins["monday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Mon</div>
                </div>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["tuesday"] != null ? logins["tuesday"] : 0}</div>
                        <div ref={DaysRef.tuesday} className="barDraw" style={{ height: (logins && logins["tuesday"] != null ? logins["tuesday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Tue</div>
                </div>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["wednesday"] != null ? logins["wednesday"] : 0}</div>
                        <div ref={DaysRef.wednesday} className="barDraw" style={{ height: (logins && logins["wednesday"] != null ? logins["wednesday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Wed</div>
                </div>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["thursday"] != null ? logins["thursday"] : 0}</div>
                        <div ref={DaysRef.thursday} className="barDraw" style={{ height: (logins && logins["thursday"] != null ? logins["thursday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Thu</div>
                </div>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["friday"] != null ? logins["friday"] : 0}</div>
                        <div ref={DaysRef.friday} className="barDraw" style={{ height: (logins && logins["friday"] != null ? logins["friday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Fri</div>
                </div>
                <div className="dayContainer">
                    <div className="bar">
                        <div className="barCount">{logins && logins["saturday"] != null ? logins["saturday"] : 0}</div>
                        <div ref={DaysRef.saturday} className="barDraw" style={{ height: (logins && logins["saturday"] != null ? logins["saturday"] : 0) * (170 / (Math.max(...Object.values(logins)))) + 'px' }}></div>
                    </div>
                    <div className="day">Sat</div>
                </div>
            </DailyAppVisitsDays>
        </Container>
    )
}

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin-top: 0px;
  text-align: center;
`;

const DailyAppVisitsDays = styled.div`
  margin: 5px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 200px;

  .dayContainer{
    display: flex;
    flex-direction: column;
    height: max-content;
    justify-content: space-between;
  }

  .bar{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex-grow: 1;
  }

  .barDraw{
    background-color: #FFBD71;
    width: 100%;
    min-height: 5px;
    border-radius: 3px;
  }

  .barCount{
    text-align: center;
  }

  .today{
    background-color: #FD8F52;
  }

`;

const Container = styled.div`
`;


export default DailyAppVisits