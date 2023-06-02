import { FeatureCollection } from 'geojson';
import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import MapGL, {Source, Layer} from 'react-map-gl';
import {heatmapLayer} from './heatmap/map-style';
import * as reactMapGl from 'react-map-gl';
import { getanalyticsdata } from './analytics_to_json';
const eqdata = require('./earthquakes.geojson');


const MAPBOX_TOKEN = ''; // Set your mapbox token here



function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter(feature => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return {type: 'FeatureCollection', features};
}

export default function MapboxHeatmap() {
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
      .then(resp => resp.json())
      .then(json => {
        // Note: In a real application you would do a validation of JSON data before doing anything with it,
        // but for demonstration purposes we ingore this part here and just trying to select needed data...
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        // setEarthQuakes(eqdata);
        selectTime(endTime);
        getanalyticsdata().then((result) => {
          let eq = JSON.parse(JSON.stringify(result))
          console.log(eq)
          console.log(json)
          setEarthQuakes(eq);
        });
      })
      .catch(err => console.error('Could not load data', err)); // eslint-disable-line
  }, []);

  const data = useMemo(() => {
    return allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime);
  }, [earthquakes, allDays, selectedTime]);

  return (
    <>
      <MapGL
        initialViewState={{
          latitude: 10.7102,
          longitude: 122.5521,
          zoom: 12
        }}
        attributionControl={false}
        style={{width: 700 ,height: 450}}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken="pk.eyJ1Ijoibmp0YW4xNDIiLCJhIjoiY2w4d2pnZmZ6MG82dzN3cXZyb2FtOW1xZyJ9.G7-OEK4yKaaGEDjeYckmgA"
      >
        {data && (
          <Source type="geojson" data={data as FeatureCollection}>
            <Layer {...heatmapLayer as reactMapGl.HeatmapLayer} />
          </Source>
        )}
      </MapGL>
      
    </>
  );
}

// export function renderToDom(container) {
//   createRoot(container).render(<MapboxHeatmap />);
// }