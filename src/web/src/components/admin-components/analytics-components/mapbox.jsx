import React from 'react'
import Map from 'react-map-gl'

function Mapbox() {
    return (
        <Map
            mapboxAccessToken='pk.eyJ1Ijoibmp0YW4xNDIiLCJhIjoiY2w4d2pnZmZ6MG82dzN3cXZyb2FtOW1xZyJ9.G7-OEK4yKaaGEDjeYckmgA'
            initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5
            }}
            style={{ height: 800 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
        />
    );
}

export default Mapbox