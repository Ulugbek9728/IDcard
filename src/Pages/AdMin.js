import React, {useState, useRef} from 'react';
import {
    UserAddOutlined,
    CreditCardOutlined,
    ApartmentOutlined
} from '@ant-design/icons';
import {Layout, Menu,  Select,} from 'antd';
import {Route, Routes, useNavigate} from "react-router";
import "antd/dist/antd.css"
import AddDekan from "../Components/AddDekan";
import "../Assets/Admin.scss"
import AddTicher from "../Components/AddTicher";
import {Link} from "react-router-dom";
import User from "../Components/User";
import PechatIdCarta from "./pechat_ID_Carta";
import Groups from "../Components/Groups";


const { Header, Content, Sider } = Layout;


function AdMin(props) {
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);

    function signOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("user_Info");
        localStorage.removeItem("id");
        navigate("/")
    }

    return (
        <><Layout className='layout admin'
                    style={{minHeight: '100vh',}}>
                <Sider className='sider' collapsible collapsed={collapsed}
                       onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo"><img src="/LOGOTDTU.png" alt=""/></div>
                    <Menu defaultSelectedKeys={['1']} theme="dark" mode="inline">
                        <Menu.Item key="2" icon={<UserAddOutlined/>}>
                                <Link to='/AdminPage/'>
                                    Dekanlar
                                </Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<UserAddOutlined />}>
                                <Link to='/AdminPage/AddTeacher'>
                                    O'qituvchilar
                                </Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<UserAddOutlined />}>
                            <Link to='/AdminPage/AddStudent'>
                                Talabalar
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6" icon={<ApartmentOutlined />}>
                            <Link to='/AdminPage/Guruhlar'>
                                Guruhlar
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<CreditCardOutlined />}>
                            <Link to='/AdminPage/IDcard'>
                                ID Card Info
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background HeaderTitle">

                    </Header>
                    <div className="dropdown">
                        <button type="button" className="btn" data-bs-toggle="dropdown">
                            {localStorage.getItem("user_Info").slice(0,2)}
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">{localStorage.getItem("user_Info")}</a></li>
                            <li onClick={signOut}><a className="dropdown-item" href="#">Chiqish<img src="/img/logout.png" alt=""/></a></li>
                        </ul>
                    </div>
                    <Content>
                        <Routes>
                            <Route path={"/AddTeacher"} element={<AddTicher/>}/>
                            <Route path={"/Addstudent"} element={<User/>}/>
                            <Route path={"/IDcard"} element={<PechatIdCarta/>}/>
                            <Route path={"/Guruhlar"} element={<Groups/>}/>
                            <Route path={"/"} element={<AddDekan/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default AdMin;