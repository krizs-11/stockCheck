import { faBasketShopping, faTrash, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";

interface DialogProps {
    name: string,
    iconkey: 'PR' | 'SF' | 'DL',
    onClickDialog: (val: string) => void,
    setClose: Dispatch<SetStateAction<boolean>>
}
const CommonDialogBox = ({ name, iconkey, onClickDialog, setClose }: DialogProps) => {

    const iconName =
    {
        'PR': faBasketShopping,
        'SF': faUserCheck,
        'DL': faTrash
    }

    return (
        <div>
            <div className='bg-white h-[160px] w-[350px] border-2 rounded-xl  flex-col py-3 shadow-2xl'>
                <div className='justify-center py-2  flex flex-col items-center '>
                    <FontAwesomeIcon icon={iconName[iconkey]} className='text-3xl text-primary rounded-2xl' />
                </div>
                <div className='px-5 py-2'>
                    <p className='text-black  font-medium text-[13px] px-2'>{`Are you sure make this Staff ${name}`}</p>
                </div>
                <div className='flex mt-5 justify-end px-2'>
                    <button className='bg-primary hover:bg-amber-500 text-[12px] h-[30px] mx-2 rounded-xl  w-[70px] flex justify-center items-center' onClick={() => {
                        onClickDialog('1')
                        setClose(false)
                    }}>
                        <p className='font-bold text-[13px] text-white'>Yes</p>
                    </button>
                    <button className='bg-transparent p-0 border-gray-500 rounded-xl h-[30px] grid place-items-center border-1 w-[70px] hover:bg-gray-50'
                        onClick={() => {
                            onClickDialog('2')
                            setClose(false)
                        }}>
                        <p className='font-medium text-[13px] text-black'>No</p>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default React.memo(CommonDialogBox)
