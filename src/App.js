import React from 'react';
import {Routes, Route} from "react-router-dom";
import SignIn from "./Pages/SignIn";
import Admin from "./Pages/AdMin";
import 'react-toastify/dist/ReactToastify.css';

import FulInfo from "./Pages/Ful_Info";
import Enter from "./Pages/Enter";


function App(props) {


    return (
        <div >

            <Routes>
                <Route path={"/"} element={<Enter/>}/>
                <Route path={"/Login"} element={<SignIn/>}/>
                <Route path={"/AdminPage/*"} element={<Admin/>}/>
                <Route path={"/Info/:id"} element={<FulInfo/>}/>
            </Routes>
        </div>
    );
}

export default App;