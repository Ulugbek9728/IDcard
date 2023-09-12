import React, {useState} from 'react';
import {
    UserAddOutlined,
} from '@ant-design/icons';
import {Layout, Menu,} from 'antd';
import {Route, Routes, useNavigate} from "react-router";
import "antd/dist/antd.css"
import "../Assets/Admin.scss"
import "../Assets/main.scss"
import {Link} from "react-router-dom";
import PechatIdCarta from "./pechat_ID_Carta";


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
        <>
            <Layout className='layout admin' style={{minHeight: '100vh',}}>

                <Sider className='sider' collapsible collapsed={collapsed}
                       onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo"><img src="/LOGOTDTU.png" alt=""/></div>
                    <Menu defaultSelectedKeys={['1']} theme="dark" mode="inline">

                        <Menu.Item key="1" icon={<UserAddOutlined />}>
                            <Link to='/AdminPage/'>
                                Talabalar
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

                            <Route path={"/"} element={<PechatIdCarta/>}/>
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

export default AdMin;