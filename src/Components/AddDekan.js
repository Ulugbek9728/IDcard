import React, {useState, useEffect} from 'react';
import {Modal, Input, Select,Form} from 'antd';
import axios from "axios";

import {toast, ToastContainer} from "react-toastify";
import * as XLSX from "xlsx";
import {ApiName} from "../APIname";

const {Option} = Select;

function AddDekan() {
    const [form] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edit, setedit] = useState(false);
    const [sucsessText, setSucsessText] = useState('');
    const [creatDecan, setCreatDecan] = useState({});
    const [Dekan, setDekan] = useState([]);
    const [Fakulty, setFakulty] = useState([]);

    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [dekanId, setDekanId] = useState('');

    function faculty() {
        axios.get(`${ApiName}/api/department`, {
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
        }).then((res)=>{
            setFakulty(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        edit ?
            axios.post(`${ApiName}/dekan/adm/update_dekan/${creatDecan.id}`, creatDecan, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                if (response.status === 200) {
                    setIsModalVisible(false);
                    setedit(false);
                    setCreatDecan('');
                    setDekan('');
                    setSucsessText("Dekan ma'lumotlari tahrirlandi")
                    form.resetFields();
                }
            }).catch((error) => {
                console.log(error.response);
                if (error.response.status === 400) {
                    setMessage(error.response.data.errors)
                }
                if (error.response.status === 406) {
                    setMessage2(error.response.data)
                }
                if (error.response.status === 502) {
                    setMessage2('Server bilan ulanishda xatolik')
                }
            })
            :
            axios.post(`${ApiName}/dekan/adm/create_dekan`, creatDecan, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                if (response.status === 201) {
                    setIsModalVisible(false);
                    setCreatDecan('');
                    setDekan('');
                    setSucsessText("Dekan ma'lumotlari qo'shildi")
                    form.resetFields();
                }
            }).catch((error) => {
                if (error.response.status === 400) {
                    setMessage(error.response.data.errors)
                }
                if (error.response.status === 406) {
                    setMessage2(error.response.data)
                }
                if (error.response.status === 502) {
                    setMessage2('Server bilan ulanishda xatolik')
                }
            });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setCreatDecan('');
        setedit(false);
    };

    const testExcel = () => {
        let sortDekan = [];
        Dekan && Dekan.forEach((item) => {
            let sortDekan1 = {
                Ism: item.name,
                Familya: item.surname,
                Sharif: item.patronymic,
                Fakultet: item.faculty,
                Login: item.login,
                Parol: item.password
            };
           sortDekan.push(sortDekan1)
        });
        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(sortDekan);
        XLSX.utils.book_append_sheet(wb, ws, "My File");
        XLSX.writeFile(wb, "Dekanlar.xlsx");

    };

    useEffect(() => {
        DekanInfo()
    }, [sucsessText]);

    function DekanInfo() {
        axios.post(`${ApiName}/dekan/adm/dekan_list`, '', {
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
        }).then((response) => {
            setDekan(response.data);
        }).catch((error) => {
            if (error.response.status === 502) {
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
            if (response.status === 200) {
                setSucsessText("Ma'lumotlar o'chirildi");
                setDekan('')
            }
        }).catch((error) => {
            if (error.response.status === 502) {
                setMessage2('Server bilan ulanishda xatolik')
            }
        });
    }

    useEffect(() => {
        notify();
        faculty();
        setMessage('');
        setMessage2('');
        setSucsessText('')
    }, [message, sucsessText, message2]);

    function notify() {
        if (message !== '') {
            message && message.map((item) => (toast.error(item)))
        }
        if (sucsessText !== '') {
            toast.success(sucsessText)
        }
        if (message2 !== '') {
            toast.error(message2)
        }
    }
    function FacultySelect(value,key) {
        setCreatDecan({...creatDecan,
            departmentId: key.key,

        })
    }

    return (
        <div className="content site-layout-background" style={{padding: 24, minHeight: 360,}}>
            <ToastContainer/>
            <div>
                <button onClick={showModal} className='btn btn-success yuklash'>
                    Dekan qo'shish
                </button>
                <Modal className='ticherModal' title={edit ? "Tahrirlash" : "Dekan qo'shish"}
                       visible={isModalVisible}
                       onOk={handleOk} onCancel={handleCancel}>
                    <div>
                        <Form form={form} layout="vertical"
                        style={{width:"100%",}}>
                            <label htmlFor='Familya'>Familya</label>
                            <Input id='Familya' value={creatDecan.surname} allowClear onChange={(e) => {
                                setCreatDecan({...creatDecan, surname: e.target.value,})
                            }}/>

                            <label htmlFor='Ism'>Ism</label>
                            <Input id='Ism' value={creatDecan.name} allowClear onChange={(e) => {
                                setCreatDecan({...creatDecan, name: e.target.value,})
                            }}/>

                            <label htmlFor='Sharif'>Sharif</label>
                            <Input id='Sharif' value={creatDecan.patronymic} allowClear onChange={(e) => {
                                setCreatDecan({
                                    ...creatDecan,
                                    patronymic: e.target.value,
                                })
                            }}/>

                            <Form.Item name="Fakultet" label="Fakultet">
                                <Select optionFilterProp="children"
                                        onChange={FacultySelect} >
                                    {Fakulty.map((item) => {
                                        return <Option value={item.name} key={item.id}>{item.name}</Option>})}
                                </Select>
                            </Form.Item>

                            <label htmlFor="Login">Login</label>
                            <Input id='Login' value={creatDecan.login} allowClear maxLength="9"
                                   onChange={(e) => {
                                       setCreatDecan({
                                           ...creatDecan,
                                           login: e.target.value.toUpperCase(),
                                       })
                                   }}/>

                            <label htmlFor="Parol">Parol</label>
                            <Input id='Parol' value={creatDecan.password} allowClear onChange={(e) => {
                                setCreatDecan({
                                    ...creatDecan,
                                    password: e.target.value,
                                })
                            }}/>
                        </Form>

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
                    {Dekan && Dekan?.map((item, index) => {
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.surname}</td>
                            <td>{item.name}</td>
                            <td>{item.patronymic}</td>
                            <td>{item?.department?.name}</td>
                            <td>{item.login}</td>
                            <td>{item.password}</td>
                            <td>
                                <button onClick={() => {
                                    showModal();
                                    setCreatDecan(item);
                                    console.log(item)
                                    setedit(true)
                                }} className="btn btn-warning mx-1">
                                    <img className='iconEdit' src="/img/editing.png" alt=""/>
                                </button>
                                <button onClick={() => {
                                    setDekanId(item.id)
                                }} className="btn btn-danger mx-1"
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