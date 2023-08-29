import React, {useEffect, useState} from 'react';
import axios from "axios";
import {ApiName} from "../APIname";
import {Select} from "antd";

const {Option} = Select;

export const ComponentPrint = React.forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);

    const [DekanID, setDekanID] = useState('');
    const [tyuterID, setTyuterID] = useState('');
    const [groupID, setGroupID] = useState('');
    const [groupName, setGroupName] = useState('');
    const [items, setItems] = useState([]);
    const [tyuter, setTyuter] = useState([]);
    const [guruh, setGuruh] = useState([]);
    const [GetGuruh, setGetGuruh] = useState([]);

    useEffect(()=>{
        fakulty();
        if (DekanID!=''){
            Tyuter();
        }
    },[DekanID]);

    useEffect(()=>{
        if (groupID!=''){
            GetGroup();
        }
    },[groupID]);

    function fakulty() {
        axios.get(`${ApiName}/api/department`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems(response.data);
        }).catch((error) => {});
        setTyuterID('')
    }
    function Tyuter() {
        axios.get(`${ApiName}/api/employee`, {

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params:{
                department:DekanID
            }
        }).then((response) => {
            setTyuter(response.data);
        }).catch((error) => {
            console.log(error)
        })
    }

    function GetGroup() {
        setLoading(true);
        axios.get(`${ApiName}/auth`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            params:{
                department:DekanID,
                group:groupID
            }
        }).then((response) => {
            setGetGuruh(response.data.content);
            console.log(response.data.content);
            setLoading(false);

        }).catch((error) => {
            setLoading(false);
        })
    }
    return (
        <>

                    <div>
                        {loading ?
                            <div className="loding">
                            <div className="ring">
                                <img src="/LOGOTDTU.png" alt=""/>
                                <span></span>
                            </div>
                            </div>
                        :""}
                        <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                        <select id='fakultet' className='form-control my-2' style={{width:"30%"}}
                                onChange={(e)=>{
                                    setDekanID(e.target.value);
                                    setTyuter('');
                                    setGuruh('');
                                    setGroupID('')}} >
                            <option>Fakultet</option>
                            {items.map((item,index) => (
                                <option value={item.id} key={index}>{item.name}</option>
                            ))}
                        </select>
                        <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                        <select id='tyuter' className='form-control my-2' style={{width:"30%"}}
                                onChange={(e)=>{
                                    setGroupID('');
                                    setTyuterID(e.target.value)
                                }}>
                            <option value={''}>Tyutor</option>
                            {tyuter && tyuter.map((item,index) => (
                                <option value={item.id} key={index}>{item.fullName}</option>
                            ))}
                        </select>

                        <label htmlFor="Guruh"><h5>Guruh</h5></label>
                        <select id='Guruh' className='form-control my-2' style={{width: "30%"}}
                                onChange={(e)=>{
                                    setGroupID(e.target.value);
                                }}>
                            <option>Guruh</option>
                            {tyuterID && tyuter?.filter(item=>{return item.id===tyuterID})[0].tutorGroups?.map((item,index)=>{
                                return <option value={item.id} key={index}>{item.name}</option>
                            })}
                        </select>
                        <div ref={ref}>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>ID</th>
                                    <th>F.I.SH</th>
                                    <th>kurs</th>
                                    <th>Yo'nalish</th>
                                    <th>Link</th>
                                    <th>Rasm </th>
                                </tr>
                                </thead>
                                <tbody>
                                {GetGuruh.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.studentIdNumber}</td>
                                        <td>{item.fullName}</td>
                                        <td>{item?.level?.name}</td>
                                        <td>{item?.specialty?.name}</td>
                                        <td>
                                            <a href={`http://id.tdtu.uz/Info/${item.studentIdNumber}`}
                                            target={"_blank"}
                                               className={"text-primary"}
                                            >http://id.tdtu.uz/Info/{item.studentIdNumber}</a>
                                        </td>
                                        <td>
                                            <img src={item.image} width={100} height={100} alt=""/>
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
        </>
    );
});