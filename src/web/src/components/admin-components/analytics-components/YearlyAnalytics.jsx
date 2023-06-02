import React from 'react'
import UserCount from './UserCount'
import DailyAppVisits from './DailyAppVisits'
import styled from 'styled-components'
import FeedbackCount from './FeedbackCount'
import PositiveCount from './PositiveCount'
import NegativeCount from './NegativeCount'
import TouristType from './TouristType'
import Gender from './Gender'
import Performance from './Performance'

export default function YearlyAnalytics() {
  return (
    <>
            <Countables>
                <UserCount />
                <PositiveCount />
                <NegativeCount />
                <FeedbackCount />
            </Countables>
            <Container>
                <Performance />
                <Gender />
                <DailyAppVisits />
                <TouristType />
            </Container>
        </>
  )
}


const Map = styled.div`
  margin: 1rem auto;
  width: 50%;

  svg {
    stroke: #fff;

    path {
      fill: #b3d8e9;
      outline: none;

      &:hover {
        fill: #00aeff;
      }

      // When a layer is 'selected' (via currentLayers prop).
      &[aria-current='true'] {
        fill: #382ba8;
      }
    }
  }
`;

const Container = styled.div`
    display: flex;
    padding: 3em;
    flex-wrap: wrap;
    row-gap: 5em;
`;

const Countables = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 1em;
`;