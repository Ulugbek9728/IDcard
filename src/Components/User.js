import React, {useState, useEffect} from 'react';
import {Select} from 'antd';
import axios from "axios";
import * as XLSX from 'xlsx';
import {toast, ToastContainer} from "react-toastify";

import '../Assets/Admin.scss'
import {ApiName} from "../APIname";


const {Option} = Select;

function User(props) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [sucsessText, setSucsessText] = useState('');

    const [DekanID, setDekanID] = useState('');
    const [tyuterID, setTyuterID] = useState('');
    const [groupID, setGroupID] = useState('');

    const [tyuter, setTyuter] = useState([]);
    const [guruh, setGuruh] = useState([]);
    const [GetGuruh, setGetGuruh] = useState([]);

    useEffect(()=>{
        fakulty();
        if (DekanID!==''){
            Tyuter();
        }
    },[DekanID]);

    useEffect(()=>{
        if (groupID!==''){
            GetGroup();
        }
    },[groupID]);

    function fakulty() {
        axios.get(`${ApiName}/api/department`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems(response.data);
        }).catch((error) => {});
        setTyuterID('')
    }
    function Tyuter() {
        axios.get(`${ApiName}/api/employee`, {

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params:{
                department:DekanID
            }
        }).then((response) => {
            setTyuter(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    function GetGroup() {
        setLoading(true);
        axios.get(`${ApiName}/auth`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params:{
                department:DekanID,
                group:groupID
            }
        }).then((response) => {
            setGetGuruh(response.data.content);
            console.log(response.data.content);
            setLoading(false);

        }).catch((error) => {
            setLoading(false);
        })
    }

   
    useEffect(() => {
        notify();
        setMessage('');
        setSucsessText('');
        setMessage2('')
    },[message, sucsessText, message2]);
    function notify() {
        if (message != ''){message && message.map((item) => (toast.error(item)))}
        if (sucsessText != ''){toast.success(sucsessText)}
        if (message2 != ''){toast.error(message2)}
    }

    return (
        <>
            {
                loading ?
                    <div className="loding">
                        <ToastContainer/>
                        <div className="ring">
                            <img src="/LOGOTDTU.png" alt=""/>
                            <span></span>
                        </div>
                    </div>
                    :
                    ''
            }
            <div className="content site-layout-background" style={{padding: 24, minHeight: 360,}}>
                <ToastContainer/>
                <div className="box mt-5">
                    <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                    <select id='fakultet' className='form-control my-2' style={{width:"30%"}}
                            onChange={(e)=>{
                                setDekanID(e.target.value);
                                setTyuter('');
                                setGuruh('');
                                setGroupID('')}} >
                        <option>Fakultet</option>
                        {items.map((item,index) => (
                            <option value={item.id} key={index}>{item.name}</option>
                        ))}
                    </select>
                    <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                    <select id='tyuter' className='form-control my-2' style={{width:"30%"}}
                            onChange={(e)=>{
                                setGroupID('');
                                setTyuterID(e.target.value)
                            }}>
                        <option value={''}>Tyutor</option>
                        {tyuter && tyuter.map((item,index) => (
                            <option value={item.id} key={index}>{item.fullName}</option>
                        ))}
                    </select>

                    <label htmlFor="Guruh"><h5>Guruh</h5></label>
                    <select id='Guruh' className='form-control my-2' style={{width: "30%"}}
                            onChange={(e)=>{
                                setGroupID(e.target.value);
                            }}>
                        <option>Guruh</option>
                        {tyuterID && tyuter?.filter(item=>{return item.id===tyuterID})[0].tutorGroups?.map((item,index)=>{
                            return <option value={item.id} key={index}>{item.name}</option>
                        })}
                    </select>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>ID</th>
                            <th>F.I.SH</th>
                            <th>Telefon</th>
                            <th>kurs</th>
                            <th>Yo'nalish</th>
                            <th>Rasm </th>
                        </tr>
                        </thead>
                        <tbody>
                        {GetGuruh.map((item,index)=>{
                            return <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.studentIdNumber}</td>
                                <td>{item.fullName}</td>
                                <td>{item.phone}</td>
                                <td>{item.level.name}</td>
                                <td>{item.specialty.name}</td>
                                <td>
                                    <img src={item.image} width={100} height={100} alt=""/>
                                </td>
                                <td>
                                    <button className="btn btn-success mx-1">
                                        <a href={`/Info/${item.studentIdNumber}`} target='_blank'>
                                            <img className='iconEdit' src="/img/view.png" alt=""/>
                                        </a>
                                    </button>
                                </td>
                            </tr>
                        })}


                        </tbody>
                    </table>
                </div>
            </div>



        </>

    );
}

export default User;