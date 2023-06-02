import { app, firestore } from './firebase'
import { collection, doc, setDoc } from "firebase/firestore";
import styled from 'styled-components';
import { useRef } from 'react';


function Destination() {
  const category = useRef();
  const name = useRef();
  const location = useRef();
  const description = useRef();
  const latitude = useRef();
  const longitude = useRef();


  const postLocation = async (e) => {
    e.preventDefault();

    const locationsRef = collection(firestore, 'LocationsData');
    let docRef;

    switch (category.current.value) {
      case 'cultural':
        docRef = doc(locationsRef, 'cultural');
        break;
      case 'manmade':
        docRef = doc(locationsRef, 'manmade');
        break;
      case 'specialevents':
        docRef = doc(locationsRef, 'festival');
        break;
      case 'specialinterest':
        docRef = doc(locationsRef, 'specialinterest');
        break;
      default:
        break;
    }

    if(docRef === undefined){
      return;
    }
    const categoryRef = collection(docRef, 'destinations')
    const destinationRef = doc(categoryRef, )


    const attractions = {
      name: name.current.value,
      location: location.current.value,
      description: description.current.value,
      latitude: latitude.current.value,
      longitude: longitude.current.value
    }

    const result = await setDoc(destinationRef,attractions).then(()=>{
      alert("data saved")
    });



  }


  return (
    <Container>
      <FormGroup onSubmit={postLocation}>
        <Input>
          <Label>Category</Label>
          <select name="category" id="category" ref={category}>
            <option value="cultural">Cultural</option>
            <option value="manmade">Man-made</option>
            <option value="specialevents">Festival / Special Events</option>
            <option value="specialinterest">Special Interests</option>

          </select>
        </Input>

        <Input>
          <Label>Name</Label>
          <input type="text" ref={name} required />
        </Input>
        <Input>
          <Label>Location</Label>
          <input type="text" ref={location} required />
        </Input>
        <Input>
          <Label>Description</Label>
          <textarea name="description" id="description" cols="30" rows="10" ref={description} required></textarea>
        </Input>
        <Input>
          <Label>Location</Label>
          <input type="text" placeholder='latitude' ref={latitude} required />
          <input type="text" placeholder='longitude' ref={longitude} required />
        </Input>
        <Submit type="submit" value="Submit"></Submit>
      </FormGroup>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  width: 500px;
  font-size: 1.2em;
`;

const Input = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.h3`
  margin-bottom: 0px;
  font-weight: 600;
`;

const Submit = styled.input`
  font-size: 1.25em;
  padding: 10px 30px;
  background-color: #ddb502;
  margin-top: 1em;
  border: none;
  border-radius: 5px;
`;



export default Destination;
