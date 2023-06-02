import { firestore } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";



export async function getanalyticsdata() {
    var collectionRef = await collection(firestore, "LocationsData/cultural/destinations");
    var destinationsRef = await getDocs(collectionRef);
    var features = [];
    destinationsRef.docs.forEach((doc) => {
        let data = doc.data();
        let locationFeature = JSON.parse(JSON.stringify(feature));
        locationFeature.properties.mag = data.positive == undefined ? 1 : data.positive * 10 ;
        locationFeature.geometry.coordinates = [parseFloat(data.longitude), parseFloat(data.latitude), 0];
        features.push(locationFeature);
    })
    collectionRef = await collection(firestore, "LocationsData/manmade/destinations");
    destinationsRef = await getDocs(collectionRef);
    destinationsRef.docs.forEach((doc) => {
        let data = doc.data();
        let locationFeature = JSON.parse(JSON.stringify(feature));
        locationFeature.properties.mag = data.positive == undefined ? 1 * 10 : data.positive * 10;
        locationFeature.geometry.coordinates = [parseFloat(data.longitude), parseFloat(data.latitude), 0];
        features.push(locationFeature);
    })
    collectionRef = await collection(firestore, "LocationsData/specialinterest/destinations");
    destinationsRef = await getDocs(collectionRef);
    destinationsRef.docs.forEach((doc) => {
        let data = doc.data();
        let locationFeature = JSON.parse(JSON.stringify(feature));
        locationFeature.properties.mag = data.positive == undefined ? 1 : data.positive * 10;
        locationFeature.geometry.coordinates = [parseFloat(data.longitude), parseFloat(data.latitude), 0];
        features.push(locationFeature);
    })
    heatmapTemplate.features = features
    return heatmapTemplate;
}

function parseString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

let heatmapTemplate = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": [],
}

let feature = {
    "type": "Feature",
    "properties": { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 }, "geometry": { "type": "Point", "coordinates": [-151.5129, 63.1016, 0.0] }
}
