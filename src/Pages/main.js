import React, {useEffect, useState} from 'react';
import {
    UserOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {Breadcrumb, Input, Layout, Menu, Modal, Select} from 'antd';
import "antd/dist/antd.css"
import "../Assets/main.scss"
import SubMenu from "antd/es/menu/SubMenu";
import {useNavigate} from "react-router";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {ApiName} from "../APIname";
import {Link} from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;


function Main(props) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sucsessText, setSucsessText] = useState('');
    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [ticherLastName, setTicherLastName] = useState("");
    const [ticherPhone, setTicherPhone] = useState("");
    const [ticherID, setTicherID] = useState("");
    const [ticherName, setTicherName] = useState("");
    const [groupID, setGroupID] = useState('');
    const [groupName, setGroupName] = useState("");
    const [allTicher, setAllTicher] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [allstudent, setAllStudent] = useState([]);
    const [NewPassword, setNewPassword] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    function signOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("user_Info");
        localStorage.removeItem("id");
        navigate("/")
    }

    useEffect(()=>{
            Tyuter();
    },[]);

    function Tyuter() {
        axios.post(`${ApiName}/adm/show/dekan/teacher/${localStorage.getItem("id")}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setAllTicher(response.data);
        }).catch((error) => {
            console.log(error.response);
            if (error.response.status === 502) {
                setMessage("Serverda ulanishda xatolik")
            }
            else {setMessage(error.response.statusText);}
        })
    }

    useEffect(()=>{
        if (ticherID != ""){
            Group();
        }
    },[ticherID]);

    function Group() {
        axios.post(`${ApiName}/groups/dekan/show/teacher/${ticherID}`,'', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setAllGroups(response.data)
        }).catch((error) => {
            if (error.response.status === 502) {
                setMessage("Serverda ulanishda xatolik")
            }
            else {setMessage(error.response.statusText);}
        })
    }

    useEffect(()=>{
        if (groupID!=''){
            GetGroup();
        }
    },[groupID, sucsessText]);

    function GetGroup() {
        setLoading(true);
        axios.post(`${ApiName}/auth/show/dekan/group/list/${groupID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setLoading(false);
            setAllStudent(response.data)
        }).catch((error) => {
            setLoading(false);
            if (error.response.status === 502) {
                setMessage("Serverda ulanishda xatolik")
            }
            else {setMessage(error.response.statusText);}
        })
    }
    function Delet(id) {
        axios.delete(`${ApiName}/auth/dekan/delete/student/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setSucsessText("Ma'lumotlar o'chirildi")
        }).catch((error) => {});
    }

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        axios.post(`${ApiName}/dekan/change/password/${localStorage.getItem('id')}`,NewPassword,{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response)=>{
            setIsModalVisible(false);
            setSucsessText("Parol yangilandi");
            setNewPassword('')
        }).catch((error) => {
            console.log(error.response);
            if (error.response.status === 400){
                setMessage(error.response.data.errors)
            }
            if (error.response.status === 408){
                setMessage2(error.response.data)
            }
            if (error.response.status === 502){
                setMessage2('Server bilan ulanishda xatolik')
            }
        });
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        notify();
        setMessage('');
        setSucsessText('');
        setMessage2('')
    },[message, sucsessText, message2]);

    function notify() {
        if (message != ''){message && message.map((item) => (toast.error(item)))}
        if (sucsessText != ''){toast.success(sucsessText); }
        if (message2 != ''){toast.error(message2)}
    }
    return (
        <div className='dekan'>
            <ToastContainer/>
            <Layout className='layout' style={{minHeight: '100vh',}}>
                <Sider className='sider' collapsible collapsed={collapsed}
                       onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo"><img src="./LOGOTDTU.png" alt=""/></div>
                    <Menu defaultSelectedKeys={'1'} theme="dark" mode="inline">
                        <SubMenu key={'2'} icon={<TeamOutlined/>} title="Tyutorlar">
                            {allTicher.map((item, index) => {
                                return <Menu.Item value={item.id} key={item.id} onClick={() => {
                                    setTicherID(item.id);
                                    setTicherName(item.name);
                                    setTicherLastName(item.surname);
                                    setTicherPhone(item.phone);
                                }}>
                                    {item.surname} {item.name}
                                </Menu.Item>
                            })}
                        </SubMenu>
                        <SubMenu key={'3'} icon={<TeamOutlined/>} title="Guruhlar">
                            {allGroups.map((item) => {
                                return <Menu.Item key={item.id} onClick={() => {
                                    setGroupName(item.number);
                                    setGroupID(item.id)
                                }}>
                                    {item.number}
                                </Menu.Item>
                            })}
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background HeaderTitle">
                        <span>"{localStorage.getItem("faculty")}" fakultet talabalari haqida ma'lumot.</span>

                    </Header>
                    <div className="dropdown">
                        <button type="button" className="btn" data-bs-toggle="dropdown">
                            {localStorage.getItem("user_Info").slice(0, 2)}
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item" href="#">
                                    {localStorage.getItem("user_Info")}
                                </a>
                            </li>
                            <li onClick={showModal}>
                                <a className="dropdown-item" href="#">Parolni yangilash</a></li>
                            <li onClick={signOut}><a className="dropdown-item" href="#">Chiqish<img
                                src="./img/logout.png" alt=""/></a></li>
                        </ul>
                        <Modal className='ticherModal' title="Parolni o'zgartirish" visible={isModalVisible}
                               onOk={handleOk} onCancel={handleCancel}>
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
                            <Breadcrumb style={{margin: '16px 0'}}>
                                <Breadcrumb.Item>{ticherName}</Breadcrumb.Item>
                                <Breadcrumb.Item>{groupName} -guruh</Breadcrumb.Item>

                            </Breadcrumb>
                            <div className="tyuter">
                                Guruh rahbari:
                                <span> {ticherLastName} {ticherName} {ticherPhone}</span>
                            </div>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>N</th>
                                    <th>Familya</th>
                                    <th>Ism</th>
                                    <th>Sharif</th>
                                    <th>Tug'ilgan yil</th>
                                    <th>Yashash manzil</th>
                                    <th>tel:</th>
                                    <th>ID</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allstudent.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.surname}</td>
                                        <td>{item.name}</td>
                                        <td>{item.patronymic}</td>
                                        <td>{item.birthdate}</td>
                                        <td>{item.address_region} {item.address_district} {item.address}</td>
                                        <td>{item.phone}</td>
                                        <td>
                                            <button className="btn btn-success">
                                                <a href={`/Full-info/${item.login}`} target='_blank'>Batafsil</a>
                                            </button>
                                            <button className="btn btn-danger mx-1" onClick={() => {
                                                Delet(item.id)
                                            }}>O'chirish
                                            </button>

                                        </td>

                                    </tr>
                                })}

                                </tbody>
                            </table>
                        </div>
                    </Content>
                    <Footer>

                    </Footer>
                </Layout>
            </Layout>


        </div>
    );
}

export default Main;