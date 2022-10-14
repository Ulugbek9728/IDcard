import React, {useState} from 'react';
import "../Assets/enter.scss"
import {ToastContainer} from "react-toastify";

function Enter(props) {

    const [login, setLogin] = useState('');


    return (
        <div className='Enter'>
            <h3 className='mt-5'>ISLOM KARIMOV NOMIDAGI TOSHKENT DAVLAT TEXNIKA UNIVERSITETI</h3>
            <div className="Signbox">
                <img className="Logo" src="/img/LOGOWIGHT.svg " alt=""/>
                <h3>Universitet talabalari haqida ma'lumot</h3>

                <input type="text" value={login} onChange={(e) => setLogin(e.target.value.toUpperCase())}
                       className="form-control" placeholder="Pasport seriya va raqam" maxLength="9"/>

                <button className="form-control loginbtn">
                    <a href={`/FulInfo/${login}`}>Batafsil</a>
                </button>

            </div>
            <div className="footer">
                <button className='form-control'>
                    <a href="http://tdtu.uz" target='_blank'>Universitet rasmiy web sayti</a>
                </button>
                <button className='form-control'>
                    <a href="/SignIn/">Kirish</a>
                </button>
            </div>
            <img className="GroupImg" src="./img/Group5.svg" alt=""/>

        </div>
    );
}

export default Enter;