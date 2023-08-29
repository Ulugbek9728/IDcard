import React, {useEffect, useState} from 'react';
import axios from "axios";
import "../css/fontawesome/css/all.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "../Assets/SignIn.scss";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {toast, ToastContainer} from "react-toastify";
import {ApiName} from "../APIname";


function SignIn(props) {
    useEffect(() => {
        AOS.init()
    });
    const navigate = useNavigate();

    const [passwordBoolin, setPasswordBoolin] = useState(true);
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);


    function Login() {
        setLoading(true);
        axios.post(`${ApiName}/auth/login`, {login, password}).then((response) => {
            if (response.status === 200) {
                setLoading(false);
                if (response.data.degree === 'ADMIN'){
                    localStorage.setItem("token", response.data.jwt);
                    localStorage.setItem("user_Info", response.data.name);
                    localStorage.setItem("id", response.data.id);

                    setLogin('');
                    setPassword('');
                    navigate("/AdminPage");
                }
            }
        }).catch((error) => {
            setLoading(false);
            if (error.response.status === 502) {
                setMessage("Serverda ulanishda xatolik")
            }
            if (error.response.status === 400){
                setMessage(error.response.data)
            }
            if (error.response.status === 408){
                setMessage(error.response.data)
            }
            if (error.response.status === 405){
                setMessage(error.response.data)
            }
        })}

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
        <div className="SignIn">
            {loading ?
                <div className="loding">
                    <div className="ring">
                        <img src="/LOGOTDTU.png" alt=""/>
                        <span></span>
                    </div>
                </div>
                :""}
            <Link to="/">
                <img className='nazad' src="/img/undo.png" alt=""
                     data-aos="flip-up"
                     data-aos-duration="1000"
                     data-aos-easing="ease-in-sine"/>
            </Link>

            <div className="Signbox">
                <ToastContainer/>
                <img className="Logo" src="/img/LOGOWIGHT.svg " alt=""
                     data-aos="flip-left"
                     data-aos-duration="1000"
                     data-aos-easing="ease-in-sine"/>
                <h3
                    data-aos="zoom-in"
                    data-aos-duration="900"
                    data-aos-easing="ease-in-sine"
                    >Shaxsiy kabinet</h3>
                <input type="text" value={login} onChange={(e) => setLogin(e.target.value.toUpperCase())}
                       className="form-control" placeholder="Login kiriting" maxLength="9"
                       data-aos="fade-up"
                       data-aos-duration="900"
                       data-aos-easing="ease-in-sine"
                       data-aos-delay="1150"/>
                <div className="inputBox"
                     data-aos="fade-up"
                     data-aos-duration="900"
                     data-aos-easing="ease-in-sine"
                     data-aos-delay="700">
                    <input type={passwordBoolin ? "password" : "text"}
                           className="form-control" placeholder="Parol kiriting"
                           value={password} onChange={(e) => setPassword(e.target.value)}/>
                    {passwordBoolin ?
                        <img onClick={() => setPasswordBoolin(!passwordBoolin)} src="/img/show(1).png" alt=""/>
                        :
                        <img onClick={() => setPasswordBoolin(!passwordBoolin)} src="/img/show.png" alt=""/>
                    }
                </div>
                <button onClick={Login} className="form-control loginbtn "
                        data-aos="fade-up"
                        data-aos-duration="900"
                        data-aos-easing="ease-in-sine"
                        data-aos-delay="200">Kirish</button>
            </div>
            <img className="GroupImg" src="/img/Group5.svg" alt=""/>

        </div>
    );
}

export default SignIn;