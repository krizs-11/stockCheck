import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar, DateRange } from 'react-date-range'
import { faClose, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DateProps {
    setSelectedaDate: (args: any) => void
    setDateOpen?: Dispatch<SetStateAction<boolean>>
    selectedDate: any,
    isRange?: boolean,
    isShowHeader?: boolean
}

export default function DatePicker({ selectedDate, setSelectedaDate, setDateOpen, isRange, isShowHeader }: DateProps) {

    const [selectDate, setSelectDate] = useState(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        })

    const handleChange = (selectDate: any) => {
        setSelectDate(selectDate.selection)
    }
    useEffect(() => {
        if (selectedDate != null) {
            setSelectDate(selectedDate)
        }
    }, [selectedDate])

    return (
        <div className='bg-white rounded-xl overflow-hidden' >
            {isShowHeader && <div className='flex p-0 m-0 justify-between items-center py-2 px-3'>
                <p className='text-gray-600 text-[13px] font-bold'>Select a Date</p>
                <FontAwesomeIcon icon={faClose} className='text-black' onClick={() => {
                    setDateOpen?.(false)
                }
                } />
            </div>}
            {isRange ?
                <DateRange
                    ranges={[selectDate]}
                    onChange={handleChange}
                    className={'text-black font-medium  left-0  '}
                    months={1}
                    rangeColors={['#F69E0A', '#3ecf8e', '#fed14c']}
                    maxDate={new Date}
                    displayMode='dateRange'
                /> :
                <Calendar
                    date={selectedDate}
                    onChange={handleChange}
                    className="text-green-200"
                    months={1}
                    color="#F69E0A"
                    maxDate={new Date()}
                    displayMode="date"
                />
            }

            {isShowHeader &&
                <div className='flex p-0 justify-between items-center px-5  py-2 bg-gray-50'>
                    {selectDate && <div>
                        <button
                            type='button'
                            className='text-primary font-bold text-[13px] border-0 bg-gray-50  px-5 py-2 '
                            onClick={() => {
                                setDateOpen?.(false)
                                setSelectedaDate(null)
                            }
                            }
                        >
                            Reset
                        </button>

                    </div>}
                    <div>
                        <button
                            className='text-black font-bold text-[13px] bg-gray-50 px-5 py-1 border-1 border-gray-500 rounded-xl'
                            onClick={() => {
                                setDateOpen?.(false)
                                setSelectedaDate(selectDate)
                            }
                            }
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => {
                                setDateOpen?.(false)
                            }
                            }
                            className='text-black font-bold text-[13px] bg-gray-50 px-5 py-1 border-1 border-gray-500 rounded-xl mx-3'>
                            Cancel
                        </button>
                    </div>

                </div>}
            <>{console.log("onchange-->", selectDate)
            }</>
        </div>
    )
}
