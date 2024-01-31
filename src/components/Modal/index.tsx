import './index.scss';
import { useState } from 'react';


export default function Modal({
    modalOpen = false,
    modalFunction,
    children
}) {
    const [open, setOpen] = useState(modalOpen);

    return (
        <div className={`modal ${open && 'showing'}`} onClick={() => {modalFunction ? modalFunction(false) : setOpen(false)}}>
            <div className="modal-content" onClick={(event) => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}