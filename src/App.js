import React from 'react';
import {Routes, Route} from "react-router-dom";
import Main from "./Pages/main";
import SignIn from "./Pages/SignIn";
import Admin from "./Pages/AdMin";
import Tyuter from "./Pages/tyuter";
import 'react-toastify/dist/ReactToastify.css';

import FulInfo from "./Pages/Ful_Info";

function App(props) {
    return (
        <div>
            <Routes>
                <Route path={"/"} element={<SignIn/>}/>
                <Route path={"/DekanPage"} element={<Main/>}/>
                <Route path={"/TyutorPage"} element={<Tyuter/>}/>
                <Route path={"/AdminPage/*"} element={<Admin/>}/>
                <Route path={"/FulInfo/:id"} element={<FulInfo/>}/>
            </Routes>
        </div>
    );
}

export default App;