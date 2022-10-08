import React from 'react';
import ReactDOM from 'react-dom/client';

import "bootstrap/dist/css/bootstrap.min.css"
import {MyRedusers} from "./reduser/MyRedusers";
import {createStore} from "redux";
import {BrowserRouter} from "react-router-dom";

import Provider from "react-redux/es/components/Provider";
import App from './App';


const store = createStore(MyRedusers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

