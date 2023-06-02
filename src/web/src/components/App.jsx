import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Destination from "../Destination";
import Users from "./Admin/Users";
import Home from "./Home";
import Destinations from "./Admin/Destinations";
import Locations from "./Admin/Locations";
import Login from "./Login";
import Feedbacks from "./admin-components/analytics-components/Feedbacks";
import Mapbox from "./admin-components/analytics-components/mapbox";
import MapboxHeatmap from "./admin-components/analytics-components/app.tsx";




const App = (props) => {
    return (
        <React.Fragment>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/destination" element={<Destination />} />
                        <Route exact path="/users" element={<Users />} />
                        <Route exact path="/destinations" element={<Destinations />} />
                        <Route exact path="/locations" element={<Locations />} />
                        <Route exact path="/feedbacks" element={<Feedbacks />} />
                        <Route exact path="/map" element={<Mapbox />} />
                        <Route exact path="/heatmap" element={<MapboxHeatmap />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </React.Fragment>
    )
}



export default App;