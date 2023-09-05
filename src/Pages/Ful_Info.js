import React, {useEffect, useState} from 'react';
import "../Assets/full_info.scss"
import axios from "axios";
import {useParams} from "react-router";
import {useNavigate} from "react-router";
import {ApiName} from "../APIname";
import {toast, ToastContainer} from "react-toastify";
import AOS from "aos";

function FulInfo(props) {
    const navigate = useNavigate();
    const {id} = useParams();
    const [student, setStudent] = useState({});
    const [message, setMessage] = useState('');


    useEffect(() => {
        Studen()
    },[]);

    function Studen() {
        axios.get(`${ApiName}/auth/student/${id}`)
            .then((response)=>{
            setStudent(response.data);
                console.log(response.data);

        }).catch((error) => {
            console.log(error.response);
            navigate("/");
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

    useEffect(() => {
        window.addEventListener("contextmenu", e => e.preventDefault());
        // const noRightClick = document.getElementId("myElement");
        const noRightClick = document.getElementById("myElement");
        noRightClick.addEventListener("contextmenu", e => e.preventDefault());
        AOS.init()
    });
    window.addEventListener("contextmenu", e => e.preventDefault());
    return (
        <div className="fullInfo" id='myElement'>
            <ToastContainer/>
            <div className="header">
               <div className="title">
                   ISLOM KARIMOV NOMIDAGI <br/>
                   TOSHKENT DAVLAT TEXNIKA UNIVERSITETI
               </div>
                <img className='logo' src="/img/LOGOWIGHT.svg" alt=""/>
            </div>

            <div className="UserNameBox">
                {student.image !== '' && student.image != null  ?
                      <img className='user' src={student.image} alt=""/>
                      :
                      <img className='user' src="/img/user.png" alt=""/>
                }

                <div className="NameInfo">
                    <span> {student.fullName}</span>
                    <p>{student.studentIdNumber}</p>
                </div>
            </div>

            <div className="ButtonBox">
                <button className="btn">Shaxsiy ma’lumotlar</button>
                <button className="btn">
                    <a href="https://student.tdtu.uz/dashboard/login" target="_blank">HEMIS</a>
                </button>
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 FISHbox">
                        <div className="FISH">
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/fakulty.png" alt=""/>
                                    Fakultet
                                </div>
                                <div className="righte">{student?.department?.name}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/direction.png" alt=""/>
                                    Yo'nalish
                                </div>
                                <div className="righte">{student?.specialty?.name}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/fakulty.png" alt=""/>
                                    Kurs
                                </div>
                                <div className="righte">{student?.level?.name}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/group.png" alt=""/>
                                    Guruh
                                </div>
                                <div className="righte">{student?.group?.name}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/number.png" alt=""/>
                                    Tel raqam
                                </div>
                                <div className="righte">{student.phone}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/data.png" alt=""/>
                                    Tug’ilgan yil
                                </div>
                                <div className="righte">{student.birthDate}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/location.png" alt=""/>
                                    Manzil
                                </div>
                                <div className="righte">{student?.country?.name} {student?.province?.name} {student?.district?.name}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-12 FISHbox">
                        <div className="FISH">
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/iconfish.png" alt=""/>
                                    Tyutor
                                </div>
                                <div className="righte">{student?.tutor?.fullName} </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default FulInfo;