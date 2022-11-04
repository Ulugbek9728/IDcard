import React, {useEffect, useState} from 'react';
import {toast, ToastContainer} from "react-toastify";
import axios from "axios";
import {Modal, Input, Select, Form,} from 'antd';

import {ApiName} from "../APIname";
import image from "../img/image.png";

const { Option } = Select;

function Groups(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);


    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [sucsessText, setSucsessText] = useState('');
    const [Fakultet, setFakultet] = useState('');

    const [DekanID, setDekanID] = useState('');
    const [DekanID2, setDekanID2] = useState('');
    const [tyuterID, setTyuterID] = useState('');
    const [tyuterID2, setTyuterID2] = useState('');

    const [tyuter, setTyuter] = useState([]);
    const [tyuter2, setTyuter2] = useState([]);
    const [guruh, setGuruh] = useState([]);
    const [guruhName, setGuruhName] = useState('');
    const [tyuterName, setTyuterName] = useState('');
    const [guruhID, setGuruhID] = useState('');
    const [items, setItems] = useState([]);
    const [items2, setItems2] = useState([]);

    useEffect(()=>{
        fakulty();
        if (DekanID!==''){
            Tyuter();
        }
    },[DekanID, sucsessText]);
    useEffect(()=>{
        if (tyuterID!=''){
            Group();
        }
    },[tyuterID, sucsessText]);

    useEffect(()=>{
        fakulty2();
        if ( DekanID2 !== '' ){
            Tyuter2();
        }
    },[DekanID2, sucsessText]);


    function fakulty2() {
        axios.post(`${ApiName}/dekan/adm/dekan_list`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems2(response.data);
        }).catch((error) => {});
        setTyuterID2('')
    }
    function Tyuter2() {
        axios.post(`${ApiName}/adm/show/teacher/${DekanID2}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setTyuter2(response.data);
        }).catch((error) => {})
    }

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        axios.post(`${ApiName}/groups/adm/update_groups/${guruhID}`,{
            id:guruhID,
            number:guruhName,
            teacher_id:tyuterID2
        }, {headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }}).then((response)=>{

            if (response.status === 200){
                setIsModalVisible(false);
                setSucsessText("Ma'lumotlar tahrirlandi")
            }
        }).catch((error) => {
            if (error.response.status === 400){
                setMessage(error.response.data.errors)
            }
            if (error.response.status === 406){
                setMessage2(error.response.data)
            }
            if (error.response.status === 502){
                setMessage2('Server bilan ulanishda xatolik')
            }
        })
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setFakultet('');
        setTyuterID2('')
    };

    function FacultySelect(value,key) {
        setTyuterID2('');
        setTyuter2('');
        setDekanID2(key.key);
        setFakultet(value)
    }
    function TyuterSelect(value,key) {
        setTyuterID2(value);
        setTyuterName(key.children)
    }

    function fakulty() {
        axios.post(`${ApiName}/dekan/adm/dekan_list`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems(response.data);
        }).catch((error) => {});
        setTyuterID('')
    }
    function Tyuter() {
        axios.post(`${ApiName}/adm/show/teacher/${DekanID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setTyuter(response.data);
        }).catch((error) => {})
    }
    function Group() {
        axios.post(`${ApiName}/groups/adm/show/teacher/${tyuterID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setGuruh(response.data);
        }).catch((error) => {})
    }
    function deletGroup() {
        axios.delete(`${ApiName}/groups/adm/delete/${guruhID}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response)=> {
            setSucsessText("Guruh ma'lumotlari o'chirildi")
        }).catch((error)=>{

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
        <div className="content site-layout-background" style={{padding: 24, minHeight: 360,}}>
            <ToastContainer/>
            <div style={{margin: '50px 0',}}/>
            <div className="box mt-5">
                <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                <select id='fakultet' className='form-control my-2' style={{width:"30%"}}
                        onChange={(e)=>{
                            setDekanID(e.target.value);
                            setTyuterID('');
                            setTyuter('');
                            setGuruh('');}} >
                    <option>Fakultet</option>
                    {items.map((item,index) => (
                        <option value={item.id} key={index}>{item.faculty}</option>
                    ))}
                </select>
                <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                <select id='tyuter' className='form-control my-2' style={{width:"30%"}}
                        onChange={(e)=>{
                            setTyuterID(e.target.value);
                            setGuruh('');
                        }} >
                    <option>Tyutor</option>
                    {tyuter && tyuter.map((item,index) => (
                        <option value={item.id} key={index}>{item.surname} {item.name} {item.patronymic}</option>
                    ))}
                </select>

                <Modal className='ticherModal'  title="Tahrirlash"  visible={isModalVisible}
                       onOk={handleOk} onCancel={handleCancel}>
                    <div className="w-100">
                        <label htmlFor="Guruh"><h5>Guruh raqami</h5></label><br/>
                        <Input id='Guruh' type="text" className='form-control' value={guruhName}
                               onChange={(e)=>{setGuruhName(e.target.value)}}/>
                        <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                        <Select id='fakultet' value={Fakultet} className='form-control'
                                onChange={FacultySelect}>
                            {items2.map((item,index) => (
                                <Option value={item.faculty} key={item.id}>{item.faculty}</Option>
                            ))}
                        </Select>
                        <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                        <Select id='tyuter' className='form-control my-2' value={tyuterName}
                                onChange={TyuterSelect}>
                            {tyuter2 && tyuter2.map((item,index) => (
                                <Option value={item.id} key={index}>{item.surname} {item.name} {item.patronymic}</Option>
                            ))}
                        </Select>
                    </div>
                </Modal>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Guruhlar</th>
                    </tr>
                    </thead>
                    <tbody>{
                        guruh && guruh.map((item,index)=>{
                        return <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.number}</td>
                            <td>
                                <button className="btn btn-warning mx-1"
                                        onClick={()=>{
                                            showModal();
                                            setGuruhName(item.number);
                                            setGuruhID(item.id)}}>
                                    <img className='iconEdit' src="/img/editing.png" alt=""/>
                                </button>
                                <button type="button" className="btn btn-danger mx-1"
                                        data-bs-toggle="modal" data-bs-target="#myModal"
                                        onClick={()=>{setGuruhName(item.number);setGuruhID(item.id)}}>
                                    <img className='iconEdit' src="/img/delete.png" alt=""/>
                                </button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>

                <div className="modal" id="myModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Tasdiqlash oynasi </h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                <b>{guruhName}</b> - guruh ma'lumotlarini o'chirmoqchimisiz
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                onClick={deletGroup}>
                                    <img className='iconEdit' src="/img/delete.png" alt=""/>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Groups;