import React, {useState, useEffect} from 'react';
import {Select, Pagination, Segmented, Space, Input, Modal} from 'antd';
import "antd/dist/antd.css"
import {ArrowUpOutlined} from '@ant-design/icons';
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
        const [kurs, setKurs] = useState('');
        const [Allkurses, setAllKurses] = useState([]);
        const [page, setPage] = useState(1);
        const [totalPage, setTotalPage] = useState(0);
        const [pageSizes, setPageSize] = useState(40);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [confirmLoading, setConfirmLoading] = useState(false);
        const [allStudent, setallStudent] = useState(false);

        const [isModalOpen1, setIsModalOpen1] = useState(false);
        const [confirmLoading1, setConfirmLoading1] = useState(false);
        const [sabab, setSabab] = useState('');
        const [studentID, setStudentID] = useState('');
        const [StatusMessega, setStatusMessega] = useState([]);
        const [Selected, setSelected] = useState([]);
        const [BookN, setBookN] = useState(null);
        const showModal = () => {
            setIsModalOpen(true);
        };
        const handleOk = () => {
            if (sabab.trim().length >0){
                setConfirmLoading(true);

                if (allStudent === false) {
                    axios.post(`${ApiName}/id/history`, {reason: sabab, studentId: studentID}, {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    }).then((res) => {
                        setTimeout(() => {
                            setSabab('')
                            setStudentID('')
                            setIsModalOpen(false);
                            setConfirmLoading(false);
                            setSucsessText("Talaba ma'lumoti yangilandi")
                        }, 2000)
                    }).catch((error) => {
                        console.log(error)
                        setTimeout(() => {
                            setConfirmLoading(false);
                            setMessage(error.response.data.errors)
                        })
                    })

                }
                else {
                    axios.post(`${ApiName}/id/history/list`, {reason: sabab, studentIds: Selected}, {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    }).then((res) => {
                        setTimeout(() => {
                            setSabab('')
                            setIsModalOpen(false);
                            setConfirmLoading(false);
                            setSucsessText("Talaba ma'lumoti yangilandi");
                            for (let i = 0; i < GetGuruh?.length; i++) {
                                let elementById = document.getElementById(i);
                                if (elementById.checked) {
                                    elementById.checked = false;
                                }
                            }
                        }, 2000)
                    }).catch((error) => {
                        console.log(error)
                        setTimeout(() => {
                            setConfirmLoading(false);
                            setMessage(error.response.data.errors)
                        })
                    })

                }
            }

        }

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
                setStatusMessega(res.data.content)

            }).catch((error) => {
                console.log(error)
            })
        };
        const handleOk1 = () => {
            setConfirmLoading1(true);
            axios.put(`${ApiName}/id/history/${BookN.id}`,{studentId:BookN.studentId, reason:BookN.reason},
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                }).then((res)=>{
                console.log(res)
                setTimeout(() => {
                    setSabab('')
                    setStudentID('')
                    setIsModalOpen1(false);
                    setConfirmLoading1(false);
                    setSucsessText("Ma'lumot yangilandi")
                    setBookN(null)
                }, 2000);
            }).catch((error)=>{
                console.log(error)
                setConfirmLoading1(false);
            })
        };

        const handleCancel1 = () => {
            setIsModalOpen1(false);
            setStudentID('')
        };

        useEffect(() => {
            fakulty();
            GetGroup();
            Allkurs()
            window.scroll(0, 0)
            if (FakultyID !== '') {
                Tyuter();
                if (eduForm !== '11') {
                    groupAll()
                }
            }
        }, [FakultyID, page, pageSizes, bakalavr, eduForm, groupID, src, sucsessText, kurs]);

        useEffect(() => {
            if (tyuterID !== '') {
                groupTyutor();
            }
        }, [tyuterID]);

        function fakulty() {
            axios.get(`${ApiName}/api/department`,{
                headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
            }).then((response) => {
                setItems(response.data);
            }).catch((error) => {
            });
            setTyuterID('')
        }

        function Allkurs() {
            axios.get(`${ApiName}/api/course`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then((response) => {
                setAllKurses(response.data);
            }).catch((error) => {
                console.log(error)
            });
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
                    level: kurs,
                    page: page,
                    size: pageSizes,
                    search: src,

                }
            }).then((response) => {
                setGetGuruh(response.data.content);
                console.log(response.data.content);
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

        const
            onSearch = (value) => {
            setSrc(value)
            setPage(1)
        };

        function handelChange(e, index) {
            const activUser = document.getElementById(index).checked
            if (activUser === true) {
                setSelected(oldData => [...oldData, e.target.value])
            } else {
                setSelected(Selected.filter(value => value !== e.target.value))
            }

        }



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
                           confirmLoading={confirmLoading} onCancel={handleCancel}>
                        <TextArea placeholder="Sabab yoki buyruq raqami" autoSize value={sabab}
                                  onChange={(e) => setSabab(e.target.value)}/>
                    </Modal>
                    <Modal title="Malumot" visible={isModalOpen1} onOk={handleOk1} confirmLoading={confirmLoading1}
                           onCancel={handleCancel1}>
                        <Input type="text" value={BookN?.reason} className='mb-3'
                               onChange={(e)=>{
                                   setBookN({
                                       ...BookN,
                                       reason:e.target.value})
                               }}/>
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
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.reason}</td>
                                    <td>
                                        <button className="btn btn-warning" type="primary"
                                                onClick={() => {
                                                   setBookN(item)
                                                }}>
                                            <img className='iconEdit' src="/img/editing.png" alt=""/>
                                        </button>

                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </table>

                    </Modal>
                    <div className="box mt-5">
                        <div className="d-flex">
                            <div className="w-25">
                                <label className='mt-3' htmlFor="fakultet"><h5>Fakultet</h5></label>
                                <Select
                                    showSearch className="form-control"
                                    onChange={(e) => {
                                        setfakultyID(e);
                                        setTyuter(null);
                                        setGroupID('')
                                        setPage(1)
                                    }}
                                    placeholder="Fakultet"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={items && items.map((item, index) =>({value:item.id, label:item.name}))}
                                />
                                {
                                    eduForm === "11" && bakalavr === '11' ? <div>
                                        <label className='mt-3' htmlFor="tyuter"><h5>Tyutor</h5></label>
                                        <Select
                                            showSearch className="form-control"
                                            onChange={(e) => {
                                                setGroupID('');
                                                setGroupList('')
                                                setPage(1)
                                                setTotalPage(0)
                                                setTyuterID(e)
                                            }}
                                            placeholder="Tyutor"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={tyuter && tyuter.map((item, index) =>(
                                                {value:item.id, label:item?.fullName}))}
                                        />
                                    </div> : ''
                                }

                                <label className='mt-3' htmlFor="Guruh"><h5>Guruh</h5></label>
                                <Select
                                    showSearch className="form-control"
                                    onChange={(e) => {
                                        setGroupID(e);
                                        setPage(1)
                                    }}
                                    placeholder="Guruh"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={groupList && groupList.map((item, index) =>(
                                        {value:item.id, label:item?.name}))}
                                />
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
                                </Space> <br/>
                                <label className='mt-2' htmlFor="kurs"><h5>Kurs</h5></label>
                                <Select
                                    showSearch className="form-control"
                                    onChange={(e) => {
                                        setKurs(e);
                                        setPage(1)
                                    }}
                                    placeholder="Kurs"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label?.toLowerCase() ?? '').startsWith(input.toLowerCase())}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={
                                        bakalavr === '11' ?
                                    Allkurses && Allkurses.slice(0, 4).map((item, index) =>(
                                        {value:item.code, label:item?.name}))
                                            :
                                            Allkurses && Allkurses.slice(0,2).map((item, index) =>(
                                                {value:item.code, label:`${index+1}-kurs`}))
                                }
                                />
                            </div>
                        </div>
                        <Space direction="vertical" className='w-50 mt-4'>
                            <Search placeholder="Qidiruv" size="large" onSearch={onSearch} enterButton/>
                        </Space> <br/>
                        <button className='btn btn-success mt-5' onClick={(e) => {
                            showModal()
                            setallStudent(true)
                        }
                        }>Pechat qilinganga o'zgartirish
                        </button>

                        <div ref={ref}>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th></th>
                                    <th>Buyruq raqami</th>
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
                                            <input id={index} value={item.studentIdNumber} type="checkbox"
                                                   name="vehicle1"
                                                   onChange={(e) => {
                                                       handelChange(e, index)
                                                   }}/>
                                        </td>
                                        <td>{item.reason}</td>
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
                                                        setallStudent(false)
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

                    <button className='btn btn-danger top' onClick={()=>{window.scroll(0, 0)}}><ArrowUpOutlined /></button>
                </div>


            </>

        );
    }
)
