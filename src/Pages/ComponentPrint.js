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
        if (tyuterID!=''){
            Group();
        }
    },[tyuterID]);
    useEffect(()=>{
        if (groupID!=''){
            GetGroup();
        }
    },[groupID]);

    function fakulty() {
        axios.post(`${ApiName}/dekan/adm/dekan_list`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setItems(response.data);
        }).catch((error) => {

        })
    }
    function Tyuter() {
        axios.post(`${ApiName}/adm/show/teacher/${DekanID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setTyuter(response.data);
        }).catch((error) => {

        })
    }
    function Group() {
        axios.post(`${ApiName}/groups/adm/show/teacher/${tyuterID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setGuruh(response.data);
        }).catch((error) => {

        })
    }
    function GetGroup() {
        setLoading(true);
        axios.post(`${ApiName}/auth/show/group/list/${groupID}`, '',{
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((response) => {
            setLoading(false);
            setGetGuruh(response.data)
        }).catch((error) => {
            setLoading(false)
        })
    }
    function GuruhSelect(value,key) {
        setGroupID(value);
        setGroupName(key.key)
    }
    return (
        <>
            {
                loading ?
                    <div className="loding">
                        <div className="ring">
                            <img src="/LOGOTDTU.png" alt=""/>
                            <span></span>
                        </div>
                    </div>
                    :
                    <div>
                        <label htmlFor="fakultet"><h5>Fakultet</h5></label>
                        <select id='fakultet' className='form-control my-2' style={{width: "30%"}}
                                onChange={(e) => {
                                    setDekanID(e.target.value);
                                    setTyuterID('');
                                    setTyuter('');
                                    setGuruh('');
                                    setGroupID('')
                                }}>
                            <option>Fakultet</option>
                            {items.map((item, index) => (
                                <option value={item.id} key={index}>{item.faculty}</option>
                            ))}
                        </select>
                        <label htmlFor="tyuter"><h5>Tyutor</h5></label>
                        <select id='tyuter' className='form-control my-2' style={{width: "30%"}}
                                onChange={(e) => {
                                    setTyuterID(e.target.value);
                                    setGuruh('');
                                    setGroupID('');
                                }}>
                            <option>Tyutor</option>
                            {tyuter && tyuter.map((item, index) => (
                                <option value={item.id}
                                        key={index}>{item.surname} {item.name} {item.patronymic}</option>
                            ))}
                        </select>
                        <label htmlFor="Guruh"><h5>Guruh</h5></label><br/>
                        <Select id='Guruh' placeholder='Guruh' className='form-control my-2' style={{width: "30%"}}
                                onChange={GuruhSelect}>
                            {guruh && guruh.map((item, index) => (
                                <Option value={item.id} key={item.number}>{item.number}</Option>
                            ))}
                        </Select>
                        <div ref={ref}>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>№</th>
                                    <th>ID</th>
                                    <th>Familya</th>
                                    <th>Ism</th>
                                    <th>Sharif</th>
                                    <th>Passport seriya</th>
                                    <th>Fakultet</th>
                                    <th>Guruh</th>
                                    <th>Link</th>
                                    <th>QR img</th>
                                </tr>
                                </thead>
                                <tbody>
                                {GetGuruh.map((item, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.bookNumber}</td>
                                        <td>{item.surname}</td>
                                        <td>{item.name}</td>
                                        <td>{item.patronymic}</td>
                                        <td>{item.login}</td>
                                        <td>{item.faculty}</td>
                                        <td>{groupName}</td>
                                        <td>test.tdtu.uz/Full-info/{item.login}</td>
                                        <td><img src={"data:image/jpeg;base64," + item.qrImage} width={80} height={80}
                                                 alt=""/></td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </>
    );
});