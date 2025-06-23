import React, { Dispatch, SetStateAction } from 'react'

interface ModalProps {
    setOpen: Dispatch<SetStateAction<boolean>>
    open: boolean,
    RenderItem: (i: any) => React.JSX.Element,
}

interface SubModalProps extends ModalProps {
    isSubScreen: true
}


interface SubDisableModalProps extends ModalProps {
    isSubScreen?: false
}

type ModalWithSubModalProps = SubModalProps | SubDisableModalProps

const Modal = ({ open, RenderItem, isSubScreen, setOpen }: ModalWithSubModalProps) => {

    function Propagtaion(e: React.MouseEvent) {
        e.stopPropagation()
    }

    function closeModal() {
        setOpen(false)
    }

    return (
        // <div className={`fixed inset-0 flex items-center ${isSubScreen ? 'justify-end' : 'justify-center'}  h-screen  bg-[rgba(255,255,255,0.4)] pointer-events-auto ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} `}>
        //     <div className={`transform transition-transform duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} max-sm:w-[85%]`}>
        //         <RenderItem />
        //     </div>
        // </div>

        <div
            onClick={closeModal}
            className={`fixed inset-0 z-[9999] flex items-center ${isSubScreen ? 'justify-end' : 'justify-center'
                } h-screen bg-[rgba(255,255,255,0.4)] pointer-events-auto ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div
                onClick={Propagtaion}
                className={`transform transition-transform duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    } ${isSubScreen ? 'max-sm:w-full' : 'max-sm:w-[85%]'}`}
            >
                <RenderItem />
            </div>
        </div>
    );


}

export default Modal
