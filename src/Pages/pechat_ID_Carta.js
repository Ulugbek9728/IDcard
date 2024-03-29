import React, {useRef} from 'react';
import { useReactToPrint } from 'react-to-print';

import {User} from '../Components/User'

function PechatIdCarta(props) {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

    return (
        <div className="p-3">
            <User ref={componentRef} />
            <button className='btn btn-success' onClick={handlePrint}>Ma'lumotlarni yuklash</button>
        </div>
    );
}

export default PechatIdCarta;