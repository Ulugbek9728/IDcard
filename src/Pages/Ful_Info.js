import React, {useEffect, useState} from 'react';
import "../Assets/full_info.scss"
import axios from "axios";
import {useParams} from "react-router";
import {ApiName} from "../APIname";

function FulInfo(props) {
    const {id} = useParams();
    const [student, setStudent] = useState({});
    const [Ticher, setTicher] = useState({});
    const [groupNumber, setGroupNumber] = useState('');

    useEffect(() => {
        Studen();
    },[]);

    function Studen() {
        axios.get(`${ApiName}/auth/public/full_info/${id}`).then((response)=>{
            setStudent(response.data);
            console.log(response);
            axios.get(`${ApiName}/groups/public/full_info/${response.data.groupId}`).then((response)=>{
                setGroupNumber(response.data.number);
                axios.get(`${ApiName}/adm/public/teacher/full_info/${response.data.teacher_id}`).then((response)=>{
                    setTicher(response.data);
                }).catch((error)=>{
                    console.log(error.response);})
            }).catch((error)=>{

            })
        }).catch((error) => {
            console.log(error.response);
        })
    }
    return (
        <div className="fullInfo">
            <div className="header">
               <div className="title">
                   ISLOM KARIMOV NOMIDAGI <br/>
                   TOSHKENT DAVLAT TEXNIKA UNIVERSITETI
               </div>
                <img className='logo' src="/img/LOGOWIGHT.svg" alt=""/>
            </div>

            <div className="UserNameBox">
                {
                  student.image != '' && student.image != null  ?
                      <img className='user' src={student.image} alt=""/>
                      :
                      <img className='user' src="/img/user.png" alt=""/>
                }

                <div className="NameInfo">
                    <span> {student.surname} {student.name} {student.patronymic}</span>
                    <p>{student.bookNumber}</p>
                </div>

            </div>

            <div className="ButtonBox">
                <button className="btn">Shaxsiy ma’lumotlar</button>
                <button className="btn">Natijalar</button>
            </div>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-12 FISHbox">
                        <div className="FISH">

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/fullname.png" alt=""/>
                                    F.I.Sh
                                </div>
                                <div className="righte"> {student.surname} {student.name} {student.patronymic}</div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/idcard.png" alt=""/>
                                    Pasport seriya
                                </div>
                                <div className="righte">{student.login}</div>
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
                                <div className="righte">{student.birthdate}</div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/fakulty.png" alt=""/>
                                    Fakultet
                                </div>
                                <div className="righte">{student.faculty}</div>
                            </div>
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/direction.png" alt=""/>
                                    Yo'nalish
                                </div>
                                <div className="righte">{student.direction}</div>
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-12 FISHbox">
                        <div className="FISH">
                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/group.png" alt=""/>
                                    Guruh
                                </div>
                                <div className="righte">{groupNumber}</div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/father.png" alt=""/>
                                    Otasi
                                </div>
                                <div className="righte">{student.fathersurname} {student.fathername} {student.fatherpatronymic}</div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/number.png" alt=""/>
                                    Tel raqam
                                </div>
                                <div className="righte">{student.fatherphone}</div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/mother.png" alt=""/>
                                   Onasi
                                </div>
                                <div className="righte">
                                    {student.mothersurname} {student.mothername} {student.motherpatronymic}
                                </div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/number.png" alt=""/>
                                    Tel raqam
                                </div>
                                <div className="righte">{student.motherphone}</div>
                            </div>

                            <div className="infoBox">
                                <div className="left">
                                    <img src="/img/location.png" alt=""/>
                                    Manzil
                                </div>
                                <div className="righte">{student.address_region} {student.address_district} {student.address}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tyuterBox">
                <div className="infoBox">
                    <div className="left">
                        <img src="/img/iconFish.png" alt=""/>
                        Tyutor
                    </div>
                    <div className="righte">{Ticher.surname} {Ticher.name} {Ticher.patronymic}</div>
                </div>

                <div className="infoBox">
                    <div className="left">
                        <img src="/img/number.png" alt=""/>
                        Tel raqam
                    </div>
                    <div className="righte">{Ticher.phone}</div>
                </div>
            </div>
        </div>
    );
}

export default FulInfo;