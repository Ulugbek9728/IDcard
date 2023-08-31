import React, {useState, useEffect} from 'react';
import {Select,Pagination,  Segmented, Space } from 'antd';
import axios from "axios";
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

    const [FakultyID, setfakultyID] = useState('');
    const [tyuterID, setTyuterID] = useState('');
    const [groupID, setGroupID] = useState('');

    const [tyuter, setTyuter] = useState([]);
    const [GetGuruh, setGetGuruh] = useState([]);

    const [bakalavr, setBakalavr] = useState( '');
    const [eduForm, seteduForm] = useState( '');


    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSizes, setPageSize] = useState(50);

    useEffect(()=>{
        fakulty();
        GetGroup()
        if (FakultyID!==''){
            Tyuter();
        }
    },[FakultyID,page,pageSizes,bakalavr,eduForm]);

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
                department:FakultyID
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
                department:FakultyID,
                group:groupID,
                education_type:bakalavr,
                education_form:eduForm,
                page: (page - 1), size: pageSizes
            }
        }).then((response) => {
            setGetGuruh(response.data.content);
            console.log(response.data);
            setTotalPage(response.data.totalElements);
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

    const pageShow =(curent, pageSize)=>{
        setPageSize(pageSize)
    }

function test(key) {
    setBakalavr(key)
}
    function test2(key) {
        seteduForm(key)
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
                    <div className="d-flex">
                        <div className="w-25">
                            <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                            <select id='fakultet' className='form-control my-2'
                                    onChange={(e)=>{
                                        setfakultyID(e.target.value);
                                        setTyuter(null);
                                        setGroupID('')}} >
                                <option>Fakultet</option>
                                {items.map((item,index) => (
                                    <option value={item.id} key={index}>{item.name}</option>
                                ))}
                            </select>
                            <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                            <select id='tyuter' className='form-control my-2'
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
                            <select id='Guruh' className='form-control my-2'
                                    onChange={(e)=>{
                                        setGroupID(e.target.value);
                                    }}>
                                <option>Guruh</option>
                                {tyuterID && tyuter?.filter(item=>{return item.id===tyuterID})[0].tutorGroups?.map((item,index)=>{
                                    return <option value={item.id} key={index}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="w-25 mx-5">
                            <label className='mb-2' htmlFor="fakultet"><h5>Ta'lim turi</h5></label><br />
                                <Space direction="vertical" >
                                <Segmented
                                    size={'large'}
                                    onChange={test}
                                    options={[
                                        {
                                            label: 'Bakalavr',
                                            value: '11',
                                        },
                                        {
                                            label: 'Magistr',
                                            value: '12',
                                        },

                                    ]}
                                />
                            </Space>
                            <label className='my-2' htmlFor="fakultet"><h5>Ta'lim shakli</h5></label><br/>
                            <Space direction="vertical" >
                                <Segmented
                                    size={'large'}
                                    onChange={test2}
                                    options={[
                                        {
                                            label: 'Kunduzgi',
                                            value: '11',
                                        },
                                        {
                                            label: 'Kechki',
                                            value: '12',
                                        },
                                        {
                                            label: 'Sirtqi',
                                            value: '13',
                                        },

                                    ]}
                                />
                            </Space>
                        </div>
                    </div>


                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>ID</th>
                            <th>F.I.SH</th>
                            <th>kurs</th>
                            <th>Fakultet</th>
                            <th>Yo'nalish</th>
                            <th>Ta'lim shakli</th>
                            <th>Ta'lim turi</th>
                            <th>Ta'lim holati</th>
                            <th>Rasm </th>
                        </tr>
                        </thead>
                        <tbody>
                        {GetGuruh.map((item,index)=>{
                            return <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.studentIdNumber}</td>
                                <td>{item.fullName}</td>
                                <td>{item?.level?.name}</td>
                                <td>{item?.department?.name}</td>
                                <td>{item?.specialty?.name}</td>
                                <td>{item?.educationForm?.name}</td>
                                <td>{item?.educationType?.name}</td>
                                <td>{item?.studentStatus?.name}</td>
                                <td>
                                    {item.image !== '' && item.image != null  ?
                                        <img style={{width:'150px'}}  src={item.image} alt=""/>
                                        :
                                        <img style={{width:'150px'}} src="/img/user.png" alt=""/>
                                    }
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
                    <Pagination
                        current={page} total={totalPage} pageSize={pageSizes}
                        onChange={(e) => {
                            setPage(e)
                        }}
                        showQuickJumper
                        showSizeChanger
                        onShowSizeChange={pageShow}
                    />
                </div>
            </div>



        </>

    );
}

export default User;