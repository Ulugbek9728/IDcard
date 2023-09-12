import React, {useState, useEffect} from 'react';
import {Select, Pagination, Segmented, Space, Input, Modal} from 'antd';
import "antd/dist/antd.css"
import {AudioOutlined} from '@ant-design/icons';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import '../Assets/Admin.scss'
import {ApiName} from "../APIname";

const {Option} = Select;
const {Search} = Input;
const {TextArea} = Input;


export const User = React.forwardRef((props, ref) => {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState([]);
    const [message2, setMessage2] = useState('');
    const [sucsessText, setSucsessText] = useState('');
    const [FakultyID, setfakultyID] = useState('');
    const [tyuterID, setTyuterID] = useState('');
    const [groupID, setGroupID] = useState('');
    const [groupList, setGroupList] = useState('');
    const [src, setSrc] = useState('');
    const [tyuter, setTyuter] = useState([]);
    const [GetGuruh, setGetGuruh] = useState([]);
    const [bakalavr, setBakalavr] = useState('11');
    const [eduForm, seteduForm] = useState('11');
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [pageSizes, setPageSize] = useState(30);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [confirmLoading1, setConfirmLoading1] = useState(false);
    const [sabab, setSabab] = useState('');
    const [studentID, setStudentID] = useState('');
    const [StatusMessega, setStatusMessega] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setConfirmLoading(true);
        axios.post(`${ApiName}/id/history`, {reason: sabab, studentId: studentID}, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            console.log(res)

            setTimeout(() => {
                setSabab('')
                setStudentID('')
                setIsModalOpen(false);
                setConfirmLoading(false);
                setSucsessText("Talaba ma'lumoti yangilandi")
            }, 2000);
        }).catch((error) => {
            console.log(error)

        })

    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setSabab('')
        setStudentID('')
    };

    const showModal1 = (e) => {
        setIsModalOpen1(true);
        axios.get(`${ApiName}/id/history`, {
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")},
            params: {
                student_id: e
            }
        }).then((res) => {
            console.log(res.data.content)
            setStatusMessega(res.data.content)

        }).catch((error) => {
            console.log(error)
        })
    };
    const handleOk1 = () => {

        setConfirmLoading1(true);
        // axios.post(`${ApiName}/id/history`, {reason:sabab, studentId:studentID},{
        //     headers: {
        //         "Authorization": "Bearer " + localStorage.getItem("token")
        //     }
        // }).then((res)=>{
        //     console.log(res)
        //     setTimeout(() => {
        //         setSabab('')
        //         setStudentID('')
        //         setIsModalOpen(false);
        //         setConfirmLoading(false);
        //     }, 2000);
        // }).catch((error)=>{
        //     console.log(error)
        //
        // })
        setTimeout(() => {
            setSabab('')
            setStudentID('')
            setIsModalOpen1(false);
            setConfirmLoading1(false);
        }, 2000);
    };
    const handleCancel1 = () => {
        setIsModalOpen1(false);
        setStudentID('')
    };

    useEffect(() => {
        fakulty();
        GetGroup()
        window.scroll(0, 0)
        if (FakultyID !== '') {
            Tyuter();
            if (eduForm !== '11') {
                groupAll()
            }
        }
    }, [FakultyID, page, pageSizes, bakalavr, eduForm, groupID, src, sucsessText]);

    useEffect(() => {
        if (tyuterID !== '') {
            groupTyutor();
        }
    }, [tyuterID]);

    function fakulty() {
        axios.get(`${ApiName}/api/department`, '', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems(response.data);
        }).catch((error) => {
        });
        setTyuterID('')
    }

    function Tyuter() {
        axios.get(`${ApiName}/api/employee`, {

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params: {
                department: FakultyID
            }
        }).then((response) => {
            setTyuter(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    function groupTyutor() {
        setGroupList(tyuter.filter((item) => item.id === tyuterID)[0]?.tutorGroups)

    }

    function groupAll() {
        setLoading(true);
        axios.get(`${ApiName}/api/group`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params: {
                department: FakultyID,
                education_type: bakalavr,
                education_form: eduForm,
            }
        }).then((res) => {
            setGroupList(res.data.content)
        }).catch((error) => {
            console.log(error)
            setLoading(false);
        })
    }

    function GetGroup() {
        setLoading(true);
        axios.get(`${ApiName}/auth`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params: {
                department: FakultyID,
                group: groupID,
                education_type: bakalavr,
                education_form: eduForm,
                page: page,
                size: pageSizes,
                search: src,

            }
        }).then((response) => {
            setGetGuruh(response.data.content);
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
    }, [message, sucsessText, message2]);

    function notify() {
        if (message != '') {
            message && message.map((item) => (toast.error(item)))
        }
        if (sucsessText != '') {
            toast.success(sucsessText)
        }
        if (message2 != '') {
            toast.error(message2)
        }
    }

    const pageShow = (curent, pageSize) => {
        setPageSize(pageSize)
    }

    function test(key) {
        setBakalavr(key)
        setPage(1)
    }

    function test2(key) {
        seteduForm(key)
        setPage(1)
    }

    const onSearch = (value) => {
        setSrc(value)
        setPage(1)
    };

    return (
        <>
            {loading ? <div className="loding">
                <ToastContainer/>
                <div className="ring">
                    <img src="/LOGOTDTU.png" alt=""/>
                    <span></span>
                </div>
            </div> : ''}
            <div className="content site-layout-background" style={{padding: 24, minHeight: 360,}}>
                <ToastContainer/>
                <Modal title="Pechat qilish sababini yozing" visible={isModalOpen} onOk={handleOk}
                       confirmLoading={confirmLoading}
                       onCancel={handleCancel}>
                    <TextArea placeholder="Sabab" autoSize value={sabab}
                              onChange={(e) => setSabab(e.target.value)}/>
                </Modal>
                <Modal title="Malumot" visible={isModalOpen1} onOk={handleOk1} confirmLoading={confirmLoading1}
                       onCancel={handleCancel1}>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>Pechat qilingan sana</th>
                            <th>Sabab</th>
                        </tr>
                        </thead>
                        <tbody>
                        {StatusMessega && StatusMessega.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item.createdDate}</td>
                                <td>{item.reason}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>

                </Modal>
                <div className="box mt-5">
                    <div className="d-flex">
                        <div className="w-25">
                            <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                            <select id='fakultet' className='form-control my-2'
                                    onChange={(e) => {
                                        setfakultyID(e.target.value);
                                        setTyuter(null);
                                        setGroupID('')
                                        setPage(1)
                                    }}>
                                <option>Fakultet</option>
                                {items.map((item, index) => (
                                    <option value={item.id} key={index}>{item.name}</option>
                                ))}
                            </select>
                            {
                                eduForm === "11" && bakalavr === '11' ? <div>
                                    <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                                    <select id='tyuter' className='form-control my-2'
                                            onChange={(e) => {
                                                setGroupID('');
                                                setGroupList('')
                                                setPage(1)
                                                setTotalPage(0)
                                                setTyuterID(e.target.value)
                                            }}>
                                        <option value={''}>Tyutor</option>
                                        {tyuter && tyuter.map((item, index) => (
                                            <option value={item.id} key={index}>{item.fullName}</option>
                                        ))}
                                    </select>
                                </div> : ''
                            }

                            <label htmlFor="Guruh"><h5>Guruh</h5></label>
                            <select id='Guruh' className='form-control my-2'
                                    onChange={(e) => {
                                        setGroupID(e.target.value);
                                        setPage(1)
                                    }}>
                                <option>Guruh</option>
                                {groupList && groupList.map((item, index) => {
                                    return <option value={item.id} key={index}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="w-25 mx-5">
                            <label className='mb-2' htmlFor="fakultet"><h5>Ta'lim turi</h5></label><br/>
                            <Space direction="vertical">
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
                            <br/>
                            <label className='my-2' htmlFor="fakultet"><h5>Ta'lim shakli</h5></label><br/>
                            <Space direction="vertical">
                                <Segmented
                                    size={'large'}
                                    onChange={test2}
                                    options={
                                        bakalavr === '11' ?
                                            [
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

                                            ] : [{
                                                label: 'Kunduzgi',
                                                value: '11',
                                            }]
                                    }
                                />
                            </Space>
                        </div>

                    </div>
                    <Space direction="vertical" className='w-50 mt-4'>
                        <Search placeholder="Qidiruv" size="large" onSearch={onSearch} enterButton/>
                    </Space>


                    <div ref={ref}>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Rasm</th>
                                <th>F.I.SH</th>
                                <th>kurs</th>
                                <th>guruh</th>
                                <th>Fakultet</th>
                                <th>Yo'nalish</th>
                                <th>Ta'lim shakli</th>
                                <th>Ta'lim turi</th>
                                <th>Ta'lim holati</th>
                                <th>ID card holati</th>
                                <th>Link</th>
                            </tr>
                            </thead>
                            <tbody>
                            {GetGuruh && GetGuruh.map((item, index) => {
                                return <tr key={index} className={item?.status}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {item.image !== '' && item.image != null ?
                                            <img style={{width: '150px'}} src={item.image} alt=""/>
                                            :
                                            <img style={{width: '150px'}} src="/img/user.png" alt=""/>
                                        }
                                    </td>
                                    <td>{item.fullName}</td>
                                    <td>{item?.level?.name}</td>
                                    <td>{item?.group?.name}</td>
                                    <td>{item?.department?.name}</td>
                                    <td>{item?.specialty?.name}</td>
                                    <td>{item?.educationForm?.name}</td>
                                    <td>{item?.educationType?.name}</td>
                                    <td>{item?.studentStatus?.name}</td>
                                    <td>{item?.status}</td>
                                    <td>
                                        <a href={`Info/${item.studentIdNumber}`}
                                           target={"_blank"}
                                           className={"text-primary"}
                                        >http://id.tdtu.uz/Info/{item.studentIdNumber}</a>
                                    </td>

                                    <td>
                                        <button className="btn btn-success mx-1"
                                                onClick={() => {
                                                    showModal1(item?.studentIdNumber)
                                                }}>

                                            <img className='iconEdit' src="/img/view.png" alt=""/>
                                        </button>
                                        <button className="btn btn-warning" type="primary"
                                                onClick={() => {
                                                    showModal()
                                                    setStudentID(item?.studentIdNumber)
                                                }}>
                                            <img className='iconEdit' src="/img/editing.png" alt=""/>
                                        </button>

                                    </td>
                                </tr>
                            })}


                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        current={page} total={totalPage} pageSize={pageSizes}
                        onChange={(e) => {
                            setPage(e)
                        }}
                        showQuickJumper showSizeChanger
                        onShowSizeChange={pageShow}
                    />
                </div>
            </div>


        </>

    );
})
