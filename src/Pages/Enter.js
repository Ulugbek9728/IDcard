import React, {useEffect, useState} from 'react';
import {toast, ToastContainer} from "react-toastify";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {ApiName} from "../APIname";
import AOS from "aos";
import "aos/dist/aos.css";

import "../Assets/enter.scss"

function Enter(props) {
    useEffect(() => {
        AOS.init()
    });
    const [login, setLogin] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    function enterInfo() {
        axios.get(`${ApiName}/auth/student/${login}`).
        then((response)=>{
            navigate(`/Info/${login}`)
        }).catch((error) => {
            if (error.response.status === 405){
                setMessage(error.response.data)
            }
        })

    }
    useEffect(() => {
        notify();
        setMessage('')
    },[message]);

    function notify() {
        if (message.trim().length > 0 ){
            toast.error(message)
        }
    }

    return (
        <div className='Enter'>
            <ToastContainer/>
            <h3 className='mt-5'
                data-aos="zoom-in"
                data-aos-duration="900"
                data-aos-easing="ease-in-sine"
            >ISLOM KARIMOV NOMIDAGI TOSHKENT DAVLAT TEXNIKA UNIVERSITETI</h3>
            <div className="Signbox">
                <img className="Logo" src="/img/LOGOWIGHT.svg " alt=""
                     data-aos="flip-left"
                     data-aos-duration="1000"
                     data-aos-easing="ease-in-sine"/>
                <h3
                    data-aos="fade-up"
                    data-aos-duration="900"
                    data-aos-easing="ease-in-sine"
                    data-aos-delay="100">Universitet talabalari haqida ma'lumot</h3>

                <input type="text" value={login} onChange={(e) => setLogin(e.target.value.toUpperCase())}
                       className="form-control" placeholder="HEMIS Talaba ID"
                       data-aos="fade-up"
                       data-aos-duration="900"
                       data-aos-easing="ease-in-sine"
                       data-aos-delay="600"/>

                <button onClick={enterInfo} className="form-control loginbtn"
                        data-aos="fade-up"
                        data-aos-duration="900"
                        data-aos-easing="ease-in-sine"
                        data-aos-delay="200">
                    Batafsil
                </button>

            </div>
            <div className="footer ">
                <button className='form-control'
                        data-aos="fade-right"
                        data-aos-duration="800"
                        data-aos-easing="ease-in-sine"
                        data-aos-delay="700">
                    <a href="http://tdtu.uz" target='_blank'>Universitet rasmiy web sayti</a>
                </button>
                <button className='form-control'
                        data-aos="fade-left"
                        data-aos-duration="800"
                        data-aos-easing="ease-in-sine"
                        data-aos-delay="700">
                    <Link to="/Login/">Kirish</Link>
                </button>
            </div>
            <img className="GroupImg" src="./img/Group5.svg" alt=""/>


        </div>
    );
}

export default Enter;