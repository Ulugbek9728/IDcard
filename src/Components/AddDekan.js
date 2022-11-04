import React, {useState, useEffect} from 'react';
import {Modal,Input, Select,} from 'antd';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {ApiName} from "../APIname";

const { Option } = Select;

function AddDekan(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edit, setedit] = useState(false);
    const [sucsessText, setSucsessText] = useState('');
    const [creatDecan, setCreatDecan] = useState({});
    const [Dekan, setDekan] = useState([]);
    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [dekanId, setDekanId] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        edit ?
            axios.post(`${ApiName}/dekan/adm/update_dekan/${creatDecan.id}`, creatDecan,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.status === 200){
                setIsModalVisible(false);
                setedit(false);
                setCreatDecan('');
                setDekan('');
                setSucsessText("Dekan ma'lumotlari tahrirlandi")
            }
        }).catch((error) => {
            console.log(error.response);
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
        :
        axios.post(`${ApiName}/dekan/adm/create_dekan`, creatDecan,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.status === 201){
                setIsModalVisible(false);
                setCreatDecan('');
                setDekan('');
                setSucsessText("Dekan ma'lumotlari qo'shildi")
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
        });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setCreatDecan('');
        setedit(false);
    };

    useEffect(() => {
        DekanInfo()
    },[sucsessText]);

    function DekanInfo() {
        axios.post(`${ApiName}/dekan/adm/dekan_list`, '',{
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
        }).then((response) => {
            setDekan(response.data);
        }).catch((error) => {
            if (error.response.status === 502){
                setMessage2('Server bilan ulanishda xatolik')
            }
        })
    }
    
    function Delet() {
        axios.delete(`${ApiName}/dekan/adm/delete/${dekanId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.status === 200){
                setSucsessText("Ma'lumotlar o'chirildi");
                setDekan('')
            }
        }).catch((error) => {
            if (error.response.status === 502){
                setMessage2('Server bilan ulanishda xatolik')
            }
        });
    }

    useEffect(() => {
        notify();
        setMessage('');
        setMessage2('');
        setSucsessText('')
    },[message, sucsessText, message2]);

    function notify() {
        if (message != ''){message && message.map((item) => (toast.error(item)))}
        if (sucsessText != ''){toast.success(sucsessText)}
        if (message2 != ''){toast.error(message2)}
    }

    return (
        <div className="content site-layout-background" style={{padding: 24, minHeight: 360,}}>
            <ToastContainer/>
            <div>
                <button onClick={showModal} className='btn btn-success yuklash'>
                    Dekan qo'shish
                </button>
                <Modal className='ticherModal' title={edit ? "Tahrirlash" : "Dekan qo'shish"} visible={isModalVisible}
                       onOk={handleOk} onCancel={handleCancel}>
                    <div>
                        <label htmlFor='Familya'>Familya</label>
                        <Input id='Familya' value={creatDecan.surname} allowClear onChange={(e)=>{
                            setCreatDecan({...creatDecan, surname: e.target.value,})}}/>
                        <label htmlFor='Ism'>Ism</label>
                        <Input id='Ism' value={creatDecan.name} allowClear
                               onChange={(e)=>{setCreatDecan({...creatDecan, name: e.target.value,})}}/>

                        <label htmlFor='Sharif'>Sharif</label>
                        <Input id='Sharif' value={creatDecan.patronymic} allowClear
                               onChange={(e)=>{setCreatDecan({...creatDecan,
                                   patronymic: e.target.value,})}}/>
                        <label htmlFor='Fakultet'>Fakultet</label>
                        <Input id='Fakultet' value={creatDecan.faculty} allowClear
                               onChange={(e)=>{setCreatDecan({...creatDecan,
                                   faculty: e.target.value,})}}/>
                        <label htmlFor="Login">Login</label>
                        <Input id='Login' value={creatDecan.login} allowClear maxLength="9"
                               onChange={(e)=>{setCreatDecan({...creatDecan,
                                       login: e.target.value.toUpperCase(),})}}/>
                        <label htmlFor="Parol">Parol</label>
                        <Input id='Parol' value={creatDecan.password} allowClear  onChange={(e)=>{
                            setCreatDecan({
                                ...creatDecan,
                                password: e.target.value,
                            })
                        }}/>
                    </div>
                </Modal>
            </div>
            <div className="box mt-5 pt-1">
                <table className="table table-bordered ">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Familya</th>
                        <th>Ism</th>
                        <th>Sharif</th>
                        <th>Fakultet</th>
                        <th>Login</th>
                        <th>Parol</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Dekan && Dekan.map((item, index)=>{
                        return <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.surname}</td>
                            <td>{item.name}</td>
                            <td>{item.patronymic}</td>
                            <td>{item.faculty}</td>
                            <td>{item.login}</td>
                            <td>{item.password}</td>
                            <td>
                                <button onClick={()=>{
                                    showModal();
                                    setCreatDecan(item);
                                    setedit(true)
                                }} className="btn btn-warning mx-1">
                                    <img className='iconEdit' src="/img/editing.png" alt=""/>
                                </button>
                                <button onClick={()=>{setDekanId(item.id)}} className="btn btn-danger mx-1"
                                        data-bs-toggle="modal" data-bs-target="#myModal">
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
                                <b>Dekan</b> ma'lumotlarini o'chirmoqchimisiz
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal"
                                        onClick={Delet}>
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

export default AddDekan;