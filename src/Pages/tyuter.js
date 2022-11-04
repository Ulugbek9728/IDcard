import React, {useState, useEffect} from 'react';
import {TeamOutlined,} from '@ant-design/icons';
import {Breadcrumb, Button, Form, Input, Layout, Menu, Modal, Select, Upload,} from 'antd';
import "antd/dist/antd.css"
import "../Assets/Admin.scss"
import {useNavigate} from "react-router";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import image from "../img/image.png";
import * as XLSX from "xlsx";
import {ApiName} from "../APIname";
import {Link} from "react-router-dom";


const { Header, Content, Sider } = Layout;
const { Option } = Select;


function Tyuter(props) {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [edit, setedit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sucsessText, setSucsessText] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [message, setMessage] = useState([]);
    const [NewPassword, setNewPassword] = useState({});
    const [message2, setMessage2] = useState('');
    const [groupID, setGroupID] = useState('');

    const [guruh, setGuruh] = useState([]);
    const [allstudent, setAllStudent] = useState([]);

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

    const [icon, setIcon] = useState(false);
    function GuruhSelect(value,key) {
        setStudent({...student,
            groupId: key.key,
        })
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
    const showModal = () => {
        setIsModalVisible(true);
        setStudent({...student, faculty:localStorage.getItem('faculty')})
    };
    const handleOk = () => {
        edit ?
            axios.post(`${ApiName}/auth/update/student/${student.id}`, student,{
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
                    setSucsessText("Ma'lumotlar taxrirlandi");
                    setIsModalVisible(false);
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
            axios.post(`${ApiName}/auth/registration/student`, student,{
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                if (response.status === 201){
                    setIsModalVisible(false);
                    setIcon(false);
                    setedit(false);
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
                if (error.response.status === 502){
                    setMessage2('Server bilan ulanishda xatolik')
                }
            });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setedit(false);
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
        setIcon(false)
    };

    const showModal2 = () => {
        setIsModalVisible2(true);
    };
    const handleOk2 = () => {
        axios.post(`${ApiName}/adm/change/password/${localStorage.getItem('id')}`,NewPassword,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response)=>{
            setIsModalVisible2(false);
            setSucsessText("Parol yangilandi");
            setNewPassword('');
        }).catch((error) => {
            if (error.response.status === 400){
                setMessage(error.response.data.errors)
            }
            if (error.response.status === 406){
                setMessage2(error.response.data)
            }
            if (error.response.status === 408){
                setMessage2(error.response.data)
            }

            if (error.response.status === 502){
                setMessage2('Server bilan ulanishda xatolik')
            }
        });

    };
    const handleCancel2 = () => {
        setIsModalVisible2(false);
        setNewPassword('')
    };

    useEffect(()=>{
        Group();
    },[]);

    function Group() {
        axios.post(`${ApiName}/groups/teacher/show/groups/${localStorage.getItem("id")}`,'', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setGuruh(response.data);
        }).catch((error) => {
            if (error.response.status === 502) {
                setMessage("Serverda ulanishda xatolik")
            }
        })
    }

    useEffect(()=>{
        if (groupID!=''){
            GetGroup();
        }
    },[groupID, sucsessText]);

    function GetGroup() {
        setLoading(true);
        axios.post(`${ApiName}/auth/teacher/show/group/list/${groupID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setLoading(false);
            setAllStudent(response.data);
        }).catch((error) => {
            setLoading(false);
            if (error.response.status === 502) {
                setMessage("Serverda ulanishda xatolik")
            }
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
    function signOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("user_Info");
        navigate("/")
    }

    return (
        <div className='dekan'>
            <ToastContainer/>
            {
                loading ?
                    <div className="loding">
                        <div className="ring">
                            <img src="/LOGOTDTU.png" alt=""/>
                            <span/>
                        </div>
                    </div>
                    :
                   ''
            }
            <Layout className='layout'
                    style={{minHeight: '100vh',}}>
                <Sider className='sider' collapsible collapsed={collapsed}
                       onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo">
                        <img src="/LOGOTDTU.png" alt=""/>
                    </div>
                    <Menu defaultSelectedKeys={groupID} theme="dark" mode="inline">
                        {guruh.map((item, index)=>{
                            return <Menu.Item key={item.id} icon={<TeamOutlined />} onClick={()=>{
                                setGroupID(item.id)}}>
                                        <span>
                                            {item.number}
                                        </span>
                            </Menu.Item>
                        })}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background HeaderTitle">
                                <span>
                                    "{localStorage.getItem("faculty")}" fakultet talabalari haqida ma'lumot.
                                </span>

                    </Header>
                    <div className="dropdown">
                        <button type="button" className="btn" data-bs-toggle="dropdown">
                            {localStorage.getItem("user_Info").slice(0,2)}
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item" href="#">
                                    {localStorage.getItem("user_Info")}
                                </a>
                            </li>
                            <li onClick={showModal2}>
                                <a className="dropdown-item" href="#">
                                    Parolni yangilash
                                </a>
                            </li>
                            <li onClick={signOut}>
                                <a className="dropdown-item" href="#">Chiqish<img src="./img/logout.png" alt=""/>
                                </a>
                            </li>
                        </ul>
                        <Modal className='ticherModal' title="Parolni o'zgartirish"  visible={isModalVisible2}
                               onOk={handleOk2} onCancel={handleCancel2}>
                            <div className="w-100">
                                <label htmlFor="editLogin">Login kiriting</label>
                                <Input id='editLogin' placeholder="AA1234567" allowClear value={NewPassword.login}
                                       onChange={(e)=>{setNewPassword({...NewPassword, login: e.target.value.toUpperCase()})}}
                                       maxLength="9"/>
                                <label htmlFor="editPassword">Yangi parol kiriting</label>
                                <Input id='editPassword' allowClear value={NewPassword.password}
                                       onChange={(e)=>{setNewPassword({...NewPassword, password: e.target.value,})}}/>
                            </div>
                        </Modal>
                    </div>
                    <Content>
                        <div className="content site-layout-background"
                             style={{padding: 24, minHeight: 360,}}>
                            <Breadcrumb style={{ margin: '16px 0' }}>

                            </Breadcrumb>
                            <button onClick={showModal} className='btn btn-success yuklash'>
                                Talaba qo'shish
                            </button>
                            <Modal title={edit ? "Tahrirlash" : "Talaba qo'shish"}
                                   className='d-flex modalUser' visible={isModalVisible}
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
                                    <label htmlFor='Familya' style={{marginTop:"20px"}}>Familya</label>
                                    <Input id='Familya' allowClear value={student.surname}
                                           onChange={(e)=>{setStudent({...student, surname: e.target.value,})}}/>
                                    <label htmlFor='Passport'>Passport seriya raqami</label>
                                    <Input id='Passport' allowClear value={student.login}
                                           onChange={(e)=>{setStudent({...student, login: e.target.value.toUpperCase()})}}
                                           maxLength="9"/>
                                    <label htmlFor='yonalish'>Yo'nalish</label>
                                    <Input id='yonalish' allowClear value={student.direction}
                                           onChange={(e)=>{setStudent(
                                               {...student, direction: e.target.value,})}}/>
                                    <label htmlFor="OtasiningF">Otasining Familyasi</label>
                                    <Input id='OtasiningF' allowClear value={student.fathersurname}
                                           onChange={(e)=>{setStudent({...student, fathersurname: e.target.value,})}}/>
                                    <label htmlFor="OnasiningFamilyasi">Onasining Familyasi</label>
                                    <Input id='OnasiningFamilyasi' allowClear value={student.mothersurname}
                                           onChange={(e)=>{setStudent({...student, mothersurname: e.target.value,})}}/>
                                    <label htmlFor="Viloyati">Viloyati / Shaxar</label>
                                    <Input id='Viloyati' allowClear value={student.address_region}
                                           onChange={(e)=>{setStudent({...student, address_region: e.target.value,})}}/>
                                    <label htmlFor="OtasiningTelefoni">Otasining Telefoni</label>
                                    <Input id='OtasiningTelefoni' maxLength="13" allowClear value={student.fatherphone}
                                           onChange={(e)=>{setStudent({...student, fatherphone: e.target.value,})}}/>

                                </div>
                                <div className="box px-2" style={{marginTop:"140px"}}>
                                    <label htmlFor='Ism'>Ism</label>
                                    <Input id='Ism' allowClear value={student.name}
                                           onChange={(e)=>{setStudent({...student, name: e.target.value,})}}/>
                                    <label htmlFor='date'>Tug'ilgan sana</label>
                                    <input type="date" id='date' className='form-control' value={student.birthdate}
                                           onChange={(e)=>{setStudent(
                                               {...student,
                                                   birthdate: e.target.value})}}/>

                                    <label htmlFor="Guruh">Guruh</label>
                                    <Select id='Guruh' onChange={GuruhSelect}>
                                        {guruh && guruh.map((item) => (
                                            <Option value={item.number} key={item.id}>
                                                {item.number}
                                            </Option>))}
                                    </Select>

                                    <label htmlFor="OtasiningIsmi">Otasining Ismi</label>
                                    <Input id='OtasiningIsmi' allowClear value={student.fathername}
                                           onChange={(e)=>{setStudent({...student, fathername: e.target.value,})}}/>
                                    <label htmlFor="OnasiningIsmi">Onasining Ismi</label>
                                    <Input id='OnasiningIsmi' allowClear value={student.mothername}
                                           onChange={(e)=>{setStudent({...student, mothername: e.target.value,})}}/>
                                    <label htmlFor="Tuman">Tuman</label>
                                    <Input id='Tuman' allowClear value={student.address_district}
                                           onChange={(e)=>{setStudent({...student, address_district: e.target.value,})}}/>
                                    <label htmlFor="OnasiningTelefoni">Onasining Telefoni</label>
                                    <Input id='OnasiningTelefoni' maxLength="13" allowClear value={student.motherphone}
                                           onChange={(e)=>{setStudent({...student, motherphone: e.target.value,})}}/>
                                </div>
                                <div className="box px-2" style={{marginTop:"140px"}}>
                                    <label htmlFor='Sharif'>Sharif</label>
                                    <Input id='Sharif' allowClear value={student.patronymic}
                                           onChange={(e)=>{setStudent({...student, patronymic: e.target.value,})}}/>
                                    <label htmlFor='Telefon'>Telefon raqam</label>
                                    <Input id='Telefon' allowClear value={student.phone} maxLength="13"
                                           onChange={(e)=>{setStudent({...student, phone: e.target.value,})}}/>
                                    <label htmlFor="Card-ID">Card-ID</label>
                                    <Input id='Card-ID' allowClear value={student.bookNumber}
                                           onChange={(e)=>{
                                               setStudent(
                                                   {...student,
                                                       bookNumber: e.target.value,
                                                   })}}/>
                                    <label htmlFor="OtasiningSharifi">Otasining Sharifi</label>
                                    <Input id='OtasiningSharifi' allowClear value={student.fatherpatronymic}
                                           onChange={(e)=>{setStudent({...student, fatherpatronymic: e.target.value,})}}/>
                                    <label htmlFor="OnasiningSharifi">Onasining Sharifi</label>
                                    <Input id='OnasiningSharifi' allowClear value={student.motherpatronymic}
                                           onChange={(e)=>{setStudent({...student, motherpatronymic: e.target.value,})}}/>
                                    <label htmlFor="Manzil">Manzil</label>
                                    <Input id='Manzil' allowClear value={student.address}
                                           onChange={(e)=>{setStudent({...student, address: e.target.value,})}}/>
                                </div>
                            </Modal>
                            <div className="box mt-5">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>N</th>
                                        <th>Familya</th>
                                        <th>Ism</th>
                                        <th>Sharif</th>
                                        <th>Tug'ilgan yil</th>
                                        <th>Yashash manzil</th>
                                        <th>Telefon raqam</th>
                                        <th>ID</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {allstudent.map((item,index)=>{
                                        return <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{item.surname}</td>
                                            <td>{item.name}</td>
                                            <td>{item.patronymic}</td>
                                            <td>{item.birthdate}</td>
                                            <td>{item.address_region} {item.address_district} {item.address}</td>
                                            <td>{item.phone}</td>
                                            <td>
                                                <button className="btn btn-warning mx-1" onClick={()=>{
                                                    showModal();
                                                    setStudent(item);
                                                    setedit(true);
                                                    setIcon(true)}}>
                                                    <img className='iconEdit' src="/img/editing.png" alt=""/>
                                                </button>
                                                <button className="btn btn-success">
                                                    <a href={`/Info/${item.login}`} target='_blank'>
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
                    </Content>
                </Layout>
            </Layout>

        </div>
    );
}

export default Tyuter;