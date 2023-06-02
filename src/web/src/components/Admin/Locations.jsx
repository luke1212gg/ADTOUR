import { type } from '@testing-library/user-event/dist/type';
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react'
import styled from 'styled-components'

export default function Locations() {
  const [heirarchyRender, setHeirarchyRender] = useState();
  const [selectionRender, setSelectionRender] = useState();
  var typeRef = useRef();


  const heirarchy = [
    {
      title: "international",
      locations: [
        {
          title: "USA",
          locations: [
            {
              title: "machester",
              locations: [
                {
                  title: "UasfSA",
                  locations: [

                  ]
                },

              ]
            },
          ]
        },

      ]
    },
    {
      title: "local",
      locations: [
        {}
      ]
    }
  ]

  const [currentHeirarchy, setCurrentHeirarchy] = useState(heirarchy);


  function renderHeirarchy() {
    let toRender = (<>
      {heirarchy.map((value, index) => {
        return (
          <div key={index}>
            <h1>
              {value.title.toUpperCase()}
            </h1>
            <div>

            </div>
          </div>
        )
      })}
    </>)
    return toRender
  }

  function addSelection() {
    let selections = selectionRender != null ? selectionRender : [];
    let type = typeRef.current.value
    let options = currentHeirarchy[type].locations
    if (options.length <= 0) return;
    selections.push(
      <select ref={typeRef} key={selections.length} name={currentHeirarchy[type].title} id={currentHeirarchy[type].title}>
        {options.map((type, index) => {
          return (<option key={index} value={index}>{type.title}</option>)
        })}
      </select>
    )
    setCurrentHeirarchy(currentHeirarchy[type].locations)
    setSelectionRender(selections)
  }


  return (
    <Container>
      {renderHeirarchy()}
      <LocationAdder>
        <h2>Add Location</h2>
        <hr />
        <Selections>
          <select ref={typeRef} name="type" id="type" onChange={(event) => {
            typeRef.current = event.target
            setSelectionRender([])
            setCurrentHeirarchy(heirarchy)
          }}>
            {heirarchy.map((type, index) => {
              return (<option key={index} value={index}>{type.title}</option>)
            })}
          </select>
          {
            selectionRender ? selectionRender.map((el, index) => {
              return (<div key={index}>{el}</div>)
            }) : null
          }
        </Selections>
        <button onClick={() => {
          addSelection()
        }}>+</button>
        <br />
        <input type="text" placeholder='Location' />
        <button>Submit</button>
      </LocationAdder>
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  &>div{
    border: 1px solid gray;
    padding: 1em;
    width: 50vw;
    height: 100vh;
    box-sizing: border-box;
  }
  box-sizing: border-box;
`;

const LocationAdder = styled.div`
  position: absolute;
  bottom: 0;
  height: 200px !important;
  background-color: white;
  box-sizing: border-box;
`;

const Selections = styled.div`
  display: flex;
`;