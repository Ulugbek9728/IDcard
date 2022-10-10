import React, {useState, useEffect} from 'react';
import {Modal, Input, Select,} from 'antd';
import axios from "axios";
import * as XLSX from 'xlsx';
import image from "../img/image.png"
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router";

import '../Assets/Admin.scss'
import {ApiName} from "../APIname";


const {Option} = Select;

function User(props) {
    const navigate = useNavigate();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edit, setedit] = useState(false);
    const [icon, setIcon] = useState(false);
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
    const [groups, setGroups] = useState({
        number: '',
        teacherId: '',
        students: []
    });
    const [student, setStudent] = useState({
        birthdate:'',
        bookNumber:'',
        image:'',
        surname:'',
        name:'',
        patronymic:'',
        phone:'',
        direction:'',
        groupId:'',
        address_region:'',
        address_district:'',
        address:'',
        fathersurname:'',
        fathername:'',
        fatherpatronymic:'',
        fatherphone:'',
        mothersurname:'',
        mothername:'',
        motherpatronymic:'',
        motherphone:'',

    });
    function FacultySelect(value,key) {
        setStudent({...student,
            faculty: value,
        });
        setDekanID(key.key)
    }
    function TyuterSelect(value, key) {
       setTyuterID(key.key)
    }
    function GuruhSelect(value,key) {
        setStudent({...student,
            groupId: key.key,
        })
    }

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        edit ?
            axios.post(`${ApiName}/auth/adm/update/student/${student.id}`, student,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                if (response.status === 200){
                    setStudent({
                        birthdate:'',
                        bookNumber:'',
                        image:'',
                        surname:'',
                        name:'',
                        patronymic:'',
                        phone:'',
                        direction:'',
                        groupId:'',
                        address_region:'',
                        address_district:'',
                        address:'',
                        fathersurname:'',
                        fathername:'',
                        fatherpatronymic:'',
                        fatherphone:'',
                        mothersurname:'',
                        mothername:'',
                        motherpatronymic:'',
                        motherphone:'',
                    });
                    setedit(false);
                    setIsModalVisible(false);
                    setIcon(false);
                    setGuruh('');
                    setSucsessText("Ma'lumotlar taxrirlandi")
                }

            }).catch((error) => {
                if (error.response.status === 400){
                    setMessage(error.response.data.errors)
                }
                if (error.response.status === 406){
                    setMessage2(error.response.data)
                }
                if (error.response.status >= 500){
                    setMessage2('Server bilan ulanishda xatolik')
                }
            })
            :
            axios.post(`${ApiName}/auth/adm/create/student`, student,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            },).then((response) => {
                if (response.status === 201){
                    setIsModalVisible(false);
                    setIcon(false);
                    setedit(false);
                    setGuruh('');
                    setStudent({
                        birthdate:'',
                        bookNumber:'',
                        image:'',
                        surname:'',
                        name:'',
                        patronymic:'',
                        phone:'',
                        direction:'',
                        groupId:'',
                        address_region:'',
                        address_district:'',
                        address:'',
                        fathersurname:'',
                        fathername:'',
                        fatherpatronymic:'',
                        fatherphone:'',
                        mothersurname:'',
                        mothername:'',
                        motherpatronymic:'',
                        motherphone:'',
                    });
                    setSucsessText("Ma'lumotlar saqlandi")
                }
            }).catch((error) => {
                if (error.response.status === 400){
                    setMessage(error.response.data.errors)
                }
                if (error.response.status === 406){
                    setMessage2(error.response.data)
                }
                if (error.response.status >= 500){
                    setMessage2('Server bilan ulanishda xatolik')
                }
            });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setStudent({
            birthdate:'',
            bookNumber:'',
            image:'',
            surname:'',
            name:'',
            patronymic:'',
            phone:'',
            direction:'',
            groupId:'',
            address_region:'',
            address_district:'',
            address:'',
            fathersurname:'',
            fathername:'',
            fatherpatronymic:'',
            fatherphone:'',
            mothersurname:'',
            mothername:'',
            motherpatronymic:'',
            motherphone:'',
        });
        setedit(false);
        setIcon(false)
    };

    const handleFile = async (e)=>{
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        const workBook = XLSX.readFile(data,{});
        const worksheet = workBook.Sheets[workBook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setGroups({...groups, students: jsonData,});
    };

    useEffect(()=>{
        fakulty();
        if (DekanID!=''){
            Tyuter();
        }
    },[DekanID, sucsessText]);
    useEffect(()=>{
        if (tyuterID!=''){
            Group();
        }
    },[tyuterID, sucsessText]);
    useEffect(()=>{
        if (groupID!=''){
            GetGroup();
        }
    },[groupID, sucsessText]);

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
    function GetGroup() {
        setLoading(true);
        axios.post(`${ApiName}/auth/show/group/list/${groupID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setGetGuruh(response.data);
            setLoading(false);

        }).catch((error) => {
            setLoading(false);
        })
    }
    function deletGroup() {
        axios.delete(`${ApiName}/groups/adm/delete/${groupID}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response)=> {
            console.log(response)
            setSucsessText("Guruh ma'lumotlari o'chirildi")
        }).catch((error)=>{

        })
    }
    function ADDGroup(){
        axios.post(`${ApiName}/auth/placeOrder`,{groups}).
        then((response) => {
            if (response.status === 200){
                setGroups('');
                setSucsessText("Guruh qo'shildi")
            }
        }).catch((error) => {
            console.log(error.response)
        })
    }
    function Delet(id) {
        axios.delete(`${ApiName}/auth/adm/delete/student/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setSucsessText("Ma'lumotlar o'chirildi")
        }).catch((error) => {});
    }
    function baseImage (event) {
        let files = event.target.files;

        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
            setStudent({
                    ...student,
                    image: e.target.result,
                }
            );
        };
        setIcon(true)
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
                        <div className="ring">Loading
                            <span></span>
                        </div>
                    </div>
                    :
                    <div className="content site-layout-background" style={{padding: 24, minHeight: 360,}}>
                        <ToastContainer/>

                        <div style={{margin: '50px 0',}}>

                            <button onClick={showModal} className='btn btn-success yuklash'>
                                Talaba qo'shish
                            </button>
                            <Modal title={edit ? "Tahrirlash" : "Talaba qo'shish"} visible={isModalVisible}
                                   onOk={handleOk} onCancel={handleCancel}>

                                <div className="box px-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div onChange={baseImage} className="upload-image">
                                            {
                                                icon ? <><img className="img-in-upload" src={student.image} alt=""/></>
                                                    : <><img className="img-in-upload1" src={image} alt=""/></>
                                            }
                                            <input  className="img-file-up" type="file"/>
                                        </div>
                                        <h4>Talaba 3x4 rasimi</h4>
                                    </div>
                                    <Input placeholder="Book-ID" allowClear value={student.bookNumber}
                                           onChange={(e)=>{
                                               setStudent(
                                                   {...student,
                                                       bookNumber: e.target.value,
                                                   })}}/>

                                    <input type="date" className='form-control' value={student.birthdate}
                                           onChange={(e)=>{setStudent(
                                               {...student,
                                                   birthdate: e.target.value})}}/>

                                    <Input placeholder="Familya" allowClear value={student.surname}
                                           onChange={(e)=>{setStudent({...student, surname: e.target.value,})}}/>
                                    <Input placeholder="Ism" allowClear value={student.name}
                                           onChange={(e)=>{setStudent({...student, name: e.target.value,})}}/>
                                    <Input placeholder="Sharif" allowClear value={student.patronymic}
                                           onChange={(e)=>{setStudent({...student, patronymic: e.target.value,})}}/>
                                    <Input placeholder="Passport seriya raqami" allowClear value={student.login}
                                           onChange={(e)=>{setStudent({...student, login: e.target.value.toUpperCase()})}}
                                           maxLength="9"/>
                                    <Input placeholder="Telefon" allowClear value={student.phone} maxLength="13"
                                           onChange={(e)=>{setStudent({...student, phone: e.target.value,})}}/>
                                    <Select placeholder="Fakultet" value={student.faculty}
                                            onChange={FacultySelect}>
                                        {items.map((item,index) => (
                                            <Option value={item.faculty} key={item.id}>{item.faculty}</Option>))}
                                    </Select>
                                    <Input placeholder="Yo'nalish" allowClear value={student.direction}
                                           onChange={(e)=>{setStudent({...student, direction: e.target.value,})}}/>

                                    <Select placeholder={'Tyutor'} onChange={TyuterSelect} value={tyuterID}>
                                        {tyuter&&tyuter.map((item,index) => (
                                            <Option key={item.id}>{item.surname} {item.name} {item.patronymic}</Option>
                                        ))}
                                    </Select>

                                </div>
                                <div className="box px-2" style={{marginTop:"11px"}}>
                                    <Select onChange={GuruhSelect}>
                                        <Option>guruh</Option>
                                        {guruh && guruh.map((item) => (
                                            <Option value={item.number} key={item.id}>{item.number}</Option>))}
                                    </Select>
                                    <Input placeholder=" Viloyati / Shaxar" allowClear value={student.address_region}
                                           onChange={(e)=>{setStudent({...student, address_region: e.target.value,})}}/>
                                    <Input placeholder="Tuman" allowClear value={student.address_district}
                                           onChange={(e)=>{setStudent({...student, address_district: e.target.value,})}}/>
                                    <Input placeholder="Manzil" allowClear value={student.address}
                                           onChange={(e)=>{setStudent({...student, address: e.target.value,})}}/>
                                    <Input placeholder="Otasining Familyasi" allowClear value={student.fathersurname}
                                           onChange={(e)=>{setStudent({...student, fathersurname: e.target.value,})}}/>
                                    <Input placeholder="Otasining Ismi" allowClear value={student.fathername}
                                           onChange={(e)=>{setStudent({...student, fathername: e.target.value,})}}/>
                                    <Input placeholder="Otasining Sharifi" allowClear value={student.fatherpatronymic}
                                           onChange={(e)=>{setStudent({...student, fatherpatronymic: e.target.value,})}}/>
                                    <Input placeholder="Otasining Telefoni" maxLength="13" allowClear value={student.fatherphone}
                                           onChange={(e)=>{setStudent({...student, fatherphone: e.target.value,})}}/>
                                    <Input placeholder="Onasining Familyasi" allowClear value={student.mothersurname}
                                           onChange={(e)=>{setStudent({...student, mothersurname: e.target.value,})}}/>
                                    <Input placeholder="Onasining Ismi" allowClear value={student.mothername}
                                           onChange={(e)=>{setStudent({...student, mothername: e.target.value,})}}/>
                                    <Input placeholder="Onasining Sharifi" allowClear value={student.motherpatronymic}
                                           onChange={(e)=>{setStudent({...student, motherpatronymic: e.target.value,})}}/>
                                    <Input placeholder="Onasining Telefoni" maxLength="13" allowClear value={student.motherphone}
                                           onChange={(e)=>{setStudent({...student, motherphone: e.target.value,})}}/>
                                </div>
                            </Modal>
                        </div>
                        <div className="box mt-5">
                            <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                            <select id='fakultet' className='form-control my-2' style={{width:"30%"}}
                                    onChange={(e)=>{
                                        setDekanID(e.target.value);
                                        setTyuterID('');
                                        setTyuter('');
                                        setGuruh('');
                                        setGroupID('')}} >
                                <option>Fakultet</option>
                                {items.map((item,index) => (
                                    <option value={item.id} key={index}>{item.faculty}</option>
                                ))}
                            </select>
                            <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                            <select id='tyuter' className='form-control my-2' style={{width:"30%"}}
                                    onChange={(e)=>{
                                        setGroups({...groups, teacherId: e.target.value,});
                                        setTyuterID(e.target.value);
                                        setGuruh('');
                                        setGroupID('');
                                    }} >
                                <option>Tyutor</option>
                                {tyuter && tyuter.map((item,index) => (
                                    <option value={item.id} key={index}>{item.surname} {item.name} {item.patronymic}</option>
                                ))}
                            </select>
                            <input type="text" className='form-control my-2' style={{width: "30%"}}
                                   placeholder='Guruh raqami'
                                   onChange={(e)=>{setGroups({...groups, number: e.target.value,})}}/>

                            <input type="file" className='my-2 form-control'style={{width: "30%"}}
                                   onChange={(e)=> handleFile(e)}/><br/>

                            <button onClick={ADDGroup} className='btn btn-success'>Guruh Qo'shish</button><hr/><br/>

                            <label htmlFor="Guruh"><h5>Guruh</h5></label>
                            <select id='Guruh' className='form-control my-2' style={{width: "30%"}}
                                    onChange={(e) => {
                                        setGroupID(e.target.value)
                                    }}>
                                <option>Guruh</option>
                                {guruh && guruh.map((item, index) => (
                                    <option value={item.id} key={index}>{item.number}</option>
                                ))}
                            </select>

                            <button onClick={deletGroup} className='btn btn-danger deletGroup'>Guruh o'chirish</button>



                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>N</th>
                                    <th>ID</th>
                                    <th>Familya</th>
                                    <th>Ism</th>
                                    <th>Sharif</th>
                                    <th>Telefon</th>
                                    <th>Fakultet</th>
                                    <th>img</th>
                                    <th>img3x4</th>
                                </tr>
                                </thead>
                                <tbody>
                                {GetGuruh.map((item,index)=>{
                                    return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.bookNumber}</td>
                                        <td>{item.surname}</td>
                                        <td>{item.name}</td>
                                        <td>{item.patronymic}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.faculty}</td>
                                        <td><img src={"data:image/jpeg;base64,"+item.qrImage} width={80} height={80} alt=""/></td>
                                        <td><img src={item.image} width={100} height={100} alt=""/></td>
                                        <td>
                                            <button className="btn btn-warning mx-1" onClick={()=>{
                                                showModal();
                                                setStudent(item);
                                                setedit(true);
                                                setIcon(true)
                                            }}>Tahrirlash</button>
                                            <button className="btn btn-danger mx-1" onClick={()=>{Delet(item.id)}}>O'chirish</button>
                                            <button className="btn btn-success mx-1">
                                                <a href={`/FulInfo/${item.login}`} target="_blank">Ba'tafsil</a></button>
                                        </td>
                                    </tr>
                                })}


                                </tbody>
                            </table>
                        </div>
                    </div>
            }



        </>

    );
}

export default User;