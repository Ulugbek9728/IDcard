import React, {useRef} from 'react';
import { useReactToPrint } from 'react-to-print';

import { ComponentPrint } from './ComponentPrint';

function PechatIdCarta(props) {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({content: () => componentRef.current,});

    return (
        <div className="p-3">
            <ComponentPrint ref={componentRef} />
            <button onClick={handlePrint}>Print this out!</button>
        </div>
    );
}

export default PechatIdCarta;