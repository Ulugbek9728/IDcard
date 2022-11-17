import React, {useState, useEffect} from 'react';

import {Modal,Input, Select,} from 'antd';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {ApiName} from "../APIname";
import * as XLSX from "xlsx";


const { Option } = Select;

function AddTicher(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edit, setedit] = useState(false);
    const [sucsessText, setSucsessText] = useState('');

    const [tyuter, setTyuter] = useState([]);
    const [items, setItems] = useState([]);
    const [DekanID, setDekanID] = useState('');
    const [creatTyuter, setCreaTyuter] = useState({});
    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [tyuterId, setTyuterId] = useState('');

    useEffect(()=>{
        fakulty();
        if (DekanID!=''){
            Tyuter()
        }
    },[DekanID, sucsessText]);

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        edit ?
            axios.post(`${ApiName}/adm/update/teacher/${creatTyuter.id}`, creatTyuter,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                if (response.status === 200){
                    setIsModalVisible(false);
                    setedit(false);
                    setCreaTyuter('');
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
            :
            axios.post(`${ApiName}/adm/create/teacher`, creatTyuter,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                if (response.status === 201){
                    setIsModalVisible(false);
                    setCreaTyuter('');
                    setSucsessText("Ma'lumotlar qo'shildi")
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
        setCreaTyuter('');
        setedit(false)
    };
    function fakulty() {
        axios.post(`${ApiName}/dekan/adm/dekan_list`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems(response.data);
        }).catch((error) => {
            if (error.response.status === 502){
                setMessage2('Server bilan ulanishda xatolik')
            }
        })
    }
    function FacultySelect(value,key) {
        setCreaTyuter({...creatTyuter,
            faculty: value,
            dekanId: key.key
        })
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
    function Delet() {
        axios.delete(`${ApiName}/adm/delete/teacher/${tyuterId}`,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            if (response.status === 200){
                setSucsessText("Ma'lumotlar o'chirildi");
                setTyuterId('')
            }
        }).catch((error) => {});
    }
    useEffect(() => {
        notify();
        setMessage('');
        setSucsessText('');
        setMessage2('')
    },[message, sucsessText, message2]);
    const testExcel = () =>{
        let sortTyuter=[];
        let facultet = '';
        tyuter && tyuter.map((item)=>{
            let sortTyuter1 = {
                Ism:item.name,
                Familya:item.surname,
                Sharif:item.patronymic,
                Telefon:item.phone,
                Fakultet:item.faculty,
                Login:item.login,
                Parol:item.password
            };
            facultet = item.faculty;
            let test = sortTyuter.push(sortTyuter1)

        });
        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(sortTyuter);
        XLSX.utils.book_append_sheet(wb,ws, "My File");
        XLSX.writeFile(wb, `${facultet}.xlsx`);

    };
    function notify() {
        if (message != ''){message && message.map((item) => (toast.error(item)))}
        if (sucsessText != ''){toast.success(sucsessText)}
        if (message2 != ''){toast.error(message2)}
    }

    return (
        <div className="content site-layout-background AddTicher" style={{padding: 24, minHeight: 360,}}>
            <ToastContainer/>
            <div style={{ margin: '16px 0' }}>
                <button onClick={showModal} className='btn btn-success yuklash'>
                   O'qituvchi qo'shish
                </button>

                <Modal className='ticherModal' title={edit ? "Tahrirlash" : "O'qituvchi qo'shish"} visible={isModalVisible}
                       onOk={handleOk} onCancel={handleCancel}>
                    <div>
                        <label htmlFor='Familya'>Familya</label>
                        <Input id='Familya' value={creatTyuter.surname} allowClear onChange={
                            (e)=> {setCreaTyuter({...creatTyuter, surname: e.target.value,})}}/>
                        <label htmlFor='Ism'>Ism</label>
                        <Input id='Ism' value={creatTyuter.name} allowClear onChange={
                            (e)=>{setCreaTyuter({...creatTyuter, name: e.target.value,})}}/>
                        <label htmlFor='Sharif'>Sharif</label>
                        <Input id='Sharif' value={creatTyuter.patronymic} allowClear onChange={
                            (e)=>{setCreaTyuter({...creatTyuter, patronymic: e.target.value,})}}/>
                        <label htmlFor="Telefon">Telefon</label>
                        <Input id='Telefon' value={creatTyuter.phone} allowClear maxLength="13"
                               onChange={(e)=>{setCreaTyuter({...creatTyuter, phone: e.target.value,})}}/>
                        <label htmlFor='#'>Fakultet</label>
                        <Select showSearch value={creatTyuter.faculty} optionFilterProp="children"
                                onChange={FacultySelect}>
                            {items.map((item) => {
                                return <Option value={item.faculty} key={item.id}/>})}
                        </Select>
                        <label htmlFor="Login">Login</label>
                        <Input id='Login' value={creatTyuter.login} allowClear maxLength="9"
                               onChange={(e)=>{setCreaTyuter(
                                   {...creatTyuter, login: e.target.value.toUpperCase(),})}}/>
                        <label htmlFor="Parol">Parol</label>
                        <Input id='Parol' value={creatTyuter.password} allowClear
                               onChange={(e)=>{setCreaTyuter({...creatTyuter, password: e.target.value,})}}/>
                    </div>
                </Modal>
            </div>
            <div  className="box mt-5">
                <label htmlFor="fakultet"><h3>Fakultet bo'yicha qidiruv</h3></label><br/>
                <select id='fakultet' onChange={(e)=>setDekanID(e.target.value)} style={{width:'400px'}}>
                    <option>Fakultet</option>
                    {items.map((item,index) => (
                        <option value={item.id} key={index}>{item.faculty}</option>
                    ))}
                </select>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Familya</th>
                        <th>Ism</th>
                        <th>Sharif</th>
                        <th>Telefon</th>
                        <th>Fakultet</th>
                        <th>Login</th>
                        <th>Parol</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tyuter && tyuter.map((item,index)=>{
                        return  <tr key={index}>
                            <td>{index+1}</td>
                            <td>{item.surname}</td>
                            <td>{item.name}</td>
                            <td>{item.patronymic}</td>
                            <td>{item.phone}</td>
                            <td>{item.faculty}</td>
                            <td>{item.login}</td>
                            <td>{item.password}</td>
                            <td>
                                <button onClick={()=>{
                                    showModal();
                                    setCreaTyuter(item);
                                    setedit(true)
                                }} className="btn btn-warning mx-1">
                                    <img className='iconEdit' src="/img/editing.png" alt=""/>
                                </button>
                                <button className="btn btn-danger mx-1" onClick={()=>{setTyuterId(item.id)}}
                                        data-bs-toggle="modal" data-bs-target="#myModal">
                                    <img className='iconEdit' src="/img/delete.png" alt=""/>
                                </button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>

                <button className="btn btn-success" onClick={testExcel}>Ma'lumotlarni yuklash</button>

                <div className="modal" id="myModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Tasdiqlash oynasi </h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                <b>O'qituvchi</b> ma'lumotlarini o'chirmoqchimisiz
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
export default AddTicher;