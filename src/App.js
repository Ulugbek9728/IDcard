import React, {useEffect} from 'react';
import {Routes, Route} from "react-router-dom";
import Main from "./Pages/main";
import SignIn from "./Pages/SignIn";
import Admin from "./Pages/AdMin";
import Tyuter from "./Pages/tyuter";
import 'react-toastify/dist/ReactToastify.css';

import FulInfo from "./Pages/Ful_Info";
import Enter from "./Pages/Enter";

function App(props) {


    return (
        <div >

            <Routes>
                <Route path={"/"} element={<Enter/>}/>
                <Route path={"/Login"} element={<SignIn/>}/>
                <Route path={"/DekanPage"} element={<Main/>}/>
                <Route path={"/TyutorPage"} element={<Tyuter/>}/>
                <Route path={"/AdminPage/*"} element={<Admin/>}/>
                <Route path={"/Info/:id"} element={<FulInfo/>}/>
            </Routes>
        </div>
    );
}

export default App;