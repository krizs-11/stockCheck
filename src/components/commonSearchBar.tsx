import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, SetStateAction } from 'react'

interface searchBarProps {
    setValue: Dispatch<SetStateAction<string>>
    value: string
    onChangeText: (args: React.ChangeEvent<HTMLInputElement>) => void,
    placeHolder: string
}
export default function SearchBar({ onChangeText, placeHolder, value, setValue }: searchBarProps) {

    return (
        <div className='w-full flex'>
            <input
                type='text'
                value={value}
                className='w-full focus:ring-0 outline-none bg-gray-200 rounded-2xl h-10  border-none text-black ps-5 capitalize '
                placeholder={placeHolder}
                onChange={(value) => {
                    onChangeText(value)
                }
                }
            />
            <div className='absolute right-0'>
                <div className='h-10 w-10 bg-gray-700 flex items-center justify-center rounded-full'
                    onClick={() => {
                        if (value) {
                            setValue('')
                        }
                    }
                    }>
                    <FontAwesomeIcon icon={value ? faXmark : faMagnifyingGlass} className='text-white transition-all ease-in-out duration-100' />
                </div>
            </div>
        </div>
    )
}
