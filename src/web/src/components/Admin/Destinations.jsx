import React from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from '../../firebase';
import { useState, useEffect, useRef } from 'react';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';


export default function Destinations() {

    const [destinations, setDestinations] = useState([]);
    const [destinationsToRender, setDestinationsToRender] = useState();
    const [selectedCategory, setSelectedCategory] = useState("cultural");
    const [editing, setEditing] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState();

    const selectionRef = useRef();


    const category = useRef();
    const name = useRef();
    const location = useRef();
    const description = useRef();
    const latitude = useRef();
    const longitude = useRef();
    const imageRef = useRef();
    const [image, setImage] = useState()



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

        if (docRef === undefined) {
            return;
        }
        const categoryRef = collection(docRef, 'destinations')
        const destinationRef = doc(categoryRef,)


        const attractions = {
            name: name.current.value,
            location: location.current.value,
            description: description.current.value,
            latitude: latitude.current.value,
            longitude: longitude.current.value
        }

        const result = await setDoc(destinationRef, attractions).then(() => {
            uploadProfile(destinationRef);
        });



    }



    useEffect(() => {
        async function getDoc(category) {
            const destinationquery = query(collection(doc(collection(firestore, 'LocationsData'), category), 'destinations'))
            const querySnapshot = await getDocs(destinationquery);
            let cl = [];
            querySnapshot.forEach((doc) => {
                cl.push(doc);
            });
            setDestinations(cl);
        }
        getDoc(selectedCategory)
    }, [selectedCategory])

    useEffect(() => {
        if (!destinations) return;

        function editLocation(data) {
            setImage(null);
            setEditing(true)
            setSelectedDestination(data)
            const destination = data.data();
            category.current.value = selectedCategory
            name.current.value = destination.name
            location.current.value = destination.location
            description.current.value = destination.description
            latitude.current.value = destination.latitude
            longitude.current.value = destination.longitude

            const profileRef = ref(storage, category.current.value + " - " + name.current.value)
            getDownloadURL(profileRef).then((url) => {
                setImage(url);
            });
        }
        const toRender = [];
        destinations.forEach((doc) => {
            const destination = doc.data();
            toRender.push(<Location onClick={() => { editLocation(doc) }}>{destination.name}</Location>)
        })
        setDestinationsToRender(toRender);
    }, [destinations, selectedCategory])

    function selectionChange() {
        setSelectedCategory(selectionRef.current.value)
    }



    function updateLocation(e) {
        e.preventDefault();

        const destinationRef = doc(collection(doc(collection(firestore, 'LocationsData'), category.current.value), 'destinations'), selectedDestination.id)

        getDoc(destinationRef).then((destination) => {
        })

        setDoc(destinationRef, {
            name: name.current.value,
            location: location.current.value,
            description: description.current.value,
            latitude: latitude.current.value,
            longitude: longitude.current.value
        }).then(() => {
            uploadProfile(destinationRef);
        })


    }
    function deleteLocation() {
        const destinationRef = doc(collection(doc(collection(firestore, 'LocationsData'), category.current.value), 'destinations'), selectedDestination.id)

        deleteDoc(destinationRef).then(() => {
            window.location.reload();
        })
    }

    function fileToDataUri(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    function showImage(e) {
        const profileURI = fileToDataUri(e.target.files[0])
        profileURI.then((data) => {
            setImage(data);
        })
    }

    async function getDataURL(url) {
        let blob = await fetch(url).then(r => r.blob());
        let dataUrl = await new Promise(resolve => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        return dataUrl;
    }

    function toDataURL(src, callback) {
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = function () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            context.drawImage(this, 0, 0);
            var dataURL = canvas.toDataURL('image/jpeg');
            callback(dataURL);
        };
        image.src = src;
    }

    function uploadProfile(destinationRef) {
        // setLoading(true);
        if (image == null) {
            window.location.reload();
            return;
        };
        const profileRef = ref(storage, category.current.value + " - " + name.current.value)
        if (image.includes("https")) {
            updateDoc(destinationRef, { image_url: image })
            window.location.reload();
        } else {
            uploadString(profileRef, image, 'data_url', { contentType: 'image/' }).then(() => {
                getDownloadURL(profileRef).then((url) => {
                    updateDoc(destinationRef, { image_url: url })
                }).then(() => {
                    window.location.reload();
                }).catch((e) => {
                    window.location.reload();
                })
            });
        }

    }

    return (

        <Container>
            <Explore >
                <select ref={selectionRef} name="" id="" onChange={() => { selectionChange() }}>
                    <option value="cultural">Cultural</option>
                    <option value="manmade">Man-made</option>
                    <option value="specialevents">Festival / Special Events</option>
                    <option value="specialinterest">Special Interest</option>

                </select>
                <div>
                    {
                        destinationsToRender ? destinationsToRender : null
                    }
                </div>

            </Explore>
            <Add>
                <FormGroup onSubmit={!editing ? postLocation : updateLocation}>
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
                    <Input>
                        <Label>Picture</Label>
                        {image && <img src={image}></img>}
                        <input ref={imageRef} type="file" accept='image/*' onChange={showImage} />
                    </Input>
                    {
                        !editing ? <Submit type="submit" value="Submit"></Submit> : <Submit type="submit" value="Update"></Submit>
                    }
                </FormGroup>
                {
                    editing && <button onClick={deleteLocation}>Delete</button>
                }
            </Add>
        </Container>
    )
}


const Container = styled.div`
    display: flex;
    height: 100vh;
    align-items: stretch;
`;

const Explore = styled.div`
    width: 50vw;
    border: 1px solid black;
    
    &>select{
        display: block;
        width: 50%;
        margin: 0 auto;
        margin-top: 1em;
        padding: 0.5em 0em;
        text-align: center;
        border-radius: 20px;
    }
    
    &>div{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-content: flex-start;
        justify-content: space-evenly;
        padding-top: 1em;
        overflow-y: scroll;
    }
`;
const Add = styled.div`
    width: 50vw;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
    padding-top: 1em;

    &>button{
        width: 50%;
        margin-top: 1em;
        padding: 0.5em 0em;
    }

    img{
        width: 200px;
        display: block;
        margin: 0 auto;
        border: 1px solid #13c2e0;
        padding: 5px;
        border-radius: 5px;
    }
`;

const Location = styled.div`
    width: 25%;
    height: 100px;
    border: 1px solid blue;
    border-radius: 10px;
    padding: 5px 10px;
    overflow-y: scroll;
`;


const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  width: 500px;
  font-size: 1.2em;
  transform: scale(90%);
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
  background-color: #C73866;
  margin-top: 1em;
  border: none;
  border-radius: 5px;
  color: white;
`;
