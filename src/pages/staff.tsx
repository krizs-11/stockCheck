import { useContext, useEffect, useRef, useState, lazy } from 'react'
import { AppContext } from '../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faChevronRight, faFilter, faPencil, faTrash, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '../customHooks/useDebounce'
import StaffService from '../services/components/staffService'
import { CommonToast } from "../services/toastService";
import CommonDialogBox from '../components/commonDialogBox'

type Employee = {
    id: string;
    name: string;
    role: string;
    salary: number;
    present: boolean;
};

type ApiResponse = {
    success: boolean;
    count: number;
    data: Employee[];
};


const CommonHeader = lazy(() => import('../components/commonHeader'))
const ListItem = lazy(() => import('../components/commonList'))
const AddEditStaff = lazy(() => import('./addEditStaff'))
const Modal = lazy(() => import('../components/commonModal'))


let limit = 10
export default function Product() {

    const [searchValue, setSearchValue] = useState('')
    const { storeId, userDetails, extendTab } = useContext(AppContext)
    const [staffList, setStaffList] = useState<any | null>(null)
    const [offsetValues, setOffsetValues] = useState(0)
    const [staffCategory, setStaffCategory] = useState<{
        id: number;
        label: string;
        selected: boolean;
    }[]>([])

    const [sortList, setSortList] = useState([
        {
            id: '1',
            name: 'A-Z',
            selected: false,
            key: 'ASC'
        },
        {
            id: '2',
            name: 'Z-A',
            selected: false,
            key: 'DESC'
        },
        {
            id: '3',
            name: 'New',
            selected: false,
            key: 'NEW'
        },
        {
            id: '4',
            name: 'old',
            selected: false,
            key: 'OLD'
        },

    ])

    const categoryRef = useRef<(HTMLDivElement | null)[]>([]);

    const [isLoading, setIsLoading] = useState(true)

    const [selectedIndex, setSelctedIndex] = useState(0)

    const [sortVisible, setSortVisible] = useState(false)

    const [selectedSort, setSelectedSort] = useState('')

    const [selectedFilter, setSelectedFilter] = useState('')

    const [addStaffOpen, setAddStaffOpen] = useState(false)

    let value = useDebounce({ value: searchValue, delay: 100 })

    const [selectedStaffId, setSelectedStaffId] = useState<string>('0')

    const [selectedStaff, setSelectedStaff] = useState<Employee | null>(null)

    const [dialogOpen, setDialogOpen] = useState(false)

    const [delDialogOpen, setDelDialogOpen] = useState(false)

    useEffect(() => {
        console.log("inside of the isloading-->", isLoading);
        if (!addStaffOpen) {
            setIsLoading(true)
            getAllStaff()
        }
    }, [offsetValues, value, selectedFilter, selectedSort, addStaffOpen])


    useEffect(() => {
        if (userDetails) {
            let formatData = userDetails.staffCategory?.map((val, index: number) => {
                return {
                    id: index + 1,
                    label: val,
                    selected: false
                }
            })
            setStaffCategory(formatData)
        }
    }, [userDetails])

    const getAllStaff = async () => {
        console.log("inside of the isloading-->", isLoading);

        let data =
        {
            search: searchValue,
            filter: selectedFilter,
            limit: limit,
            offset: offsetValues,
            sort: selectedSort
        }
        await StaffService.getAllStaffData(storeId, data)
            .then((res: ApiResponse) => {
                if (res) {
                    console.log("inside of the isloading--> intial", isLoading);
                    setStaffList(res);
                }
            })
            .catch((error: any) => {
                console.log("error in getAllStaff-->", error);
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const handleStaffAttendance = async () => {
        if (selectedStaff?.present) {
            let Id = selectedStaff?.id ? selectedStaff?.id : ''
            await StaffService.getOneStaffAbsent(storeId, Id).then((res: any) => {
                console.log("res", res);
                getAllStaff()
            }).catch((error: any) => {
                console.log("error in the getOneStaffPresent-->", error);
            })
        }
        else if (!selectedStaff?.present) {
            await StaffService.getOneStaffPresent(storeId, selectedStaff?.id ?? '').then((res: any) => {
                console.log("res", res);
                getAllStaff()
            }).catch((error: any) => {
                console.log("error in the getOneStaffPresent-->", error);
            })
        }

    }

    const deleteStaff = async () => {
        try {
            StaffService.getOneDeleteStaffData(storeId, selectedStaffId).then((res: any) => {
                if (res?.success) {
                    CommonToast.show({ type: 'success', message: 'Staff Deleted Successfully' })
                    setOffsetValues(0)
                    getAllStaff()

                }
            }).catch((error: any) => {
                console.log("error in deleteStaff", error);
            })
        }
        catch (error) {
            console.log("error in deleteStafffun-->", error);
        }
    }

    const RenderItem = (data: { item: Employee }) => {
        return (
            <div
                className="bg-white sm:w-[90%] max-sm:w-[90%]  cursor-pointer my-3 mx-3 grow transition ease-in duration-200 flex flex-col justify-between  rounded-xl">
                <div className='flex justify-between items-center px-2 py-2 '>

                    <div className='sm:w-[20%] max-sm:w-[30%]'>
                        <div className='flex items-center'>
                            <p className='text-gray-500  font-medium sm:text-sm  xl:text-[14px]  capitalize'>name</p>
                            <div className=' bg-amber-300 mx-2 rounded-xl max-sm:opacity-0 w-[90%] '>
                                <p className='text-black font-mono text-[12px] px-2  line-clamp-1'>{data?.item?.role}</p>
                            </div>
                        </div>
                        <p className='text-black font-bold sm:text-sm  xl:text-[14px]capitalize'>{data?.item?.name}</p>
                    </div>

                    <div className='p-0 m-0'>
                        <p className='text-gray-500  font-medium sm:text-sm  xl:text-[14px]  capitalize'>Salary</p>
                        <p className='text-gray-800 font-bold text-[14px] lowercase'>{`₹${data?.item?.salary}/M`}</p>
                    </div>

                    <div className={'cursor-pointer flex-col'} onClick={() => {
                        setDialogOpen(true)
                        setSelectedStaff(data.item)
                    }
                    }>
                        <p className='text-gray-500  font-medium sm:text-sm  xl:text-[14px]  capitalize'>Attendance</p>
                        <p className={`${data.item.present ? 'text-green-800' : 'text-red-800'} font-bold text-[14px]`}>{data.item.present ? 'Present' : 'Absent'}</p>
                    </div>

                    <div className='flex-col sm:w-[10%] max-sm:w-[15%] items-center justify-between'>
                        <p className='text-gray-500  font-medium sm:text-sm  xl:text-[14px]  capitalize'>Action</p>
                        <div className='flex justify-between items-center'>
                            <button type='button' onClick={() => {
                                setAddStaffOpen(true)
                                setSelectedStaffId(data.item.id)
                            }}>
                                <FontAwesomeIcon icon={faPencil} className='text-gray-500 font-medium' />
                            </button>
                            <button onClick={() => {
                                setDelDialogOpen(true)
                                setSelectedStaffId(data?.item?.id)
                            }
                            }>
                                <FontAwesomeIcon icon={faTrash} className='text-red-500' />
                            </button>
                        </div>
                    </div>

                </div>
                {window.innerWidth <= 450 && <div className='  mx-2 rounded-xl sm:opacity-1  capitalize justify-self-center my-1'>
                    <p className='text-primary font-mono text-[12px] px-2  capitalize'>{data?.item?.role}</p>
                </div>
                }


            </div>
        )
    }

    const scrollToCategory = (index: number) => {
        setTimeout(() => {
            const targetElement = categoryRef.current[index];
            targetElement?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
        }, 10)
    };

    const DialogBox = () => {
        return (
            <div className='bg-white h-[160px] w-[350px] border-2 rounded-xl  flex-col py-3 shadow-2xl'>
                <div className='justify-center py-2  flex flex-col items-center '>
                    <FontAwesomeIcon icon={faUserCheck} className='text-3xl text-primary rounded-2xl' />
                </div>
                <div className='px-5 py-2'>
                    <p className='text-black  font-medium text-[13px] px-2'>{`Are you sure make this Staff ${selectedStaff?.present ? 'Absent' : 'Present'} ?`}</p>
                </div>
                <div className='flex mt-5 justify-end px-2'>
                    <button className='bg-primary hover:bg-amber-500 text-[12px] h-[30px] mx-2 rounded-xl  w-[70px] flex justify-center items-center' onClick={() => {
                        console.log("inside yes");

                        setDialogOpen(false)
                        handleStaffAttendance()
                    }}>
                        <p className='font-bold text-[13px] text-white'>Yes</p>
                    </button>
                    <button className='bg-transparent p-0 border-gray-500 rounded-xl h-[30px] grid place-items-center border-1 w-[70px] hover:bg-gray-50'
                        onClick={() => {
                            setDialogOpen(false)
                        }}>
                        <p className='font-medium text-[13px] text-black'>No</p>
                    </button>
                </div>
            </div>
        )
    }

    // const [showToast, setShowToast] = useState(false)


    console.log("jsonstringfy==-->", JSON.stringify(userDetails, null, 6));

    return (

        <div
            onClick={() => {
                if (sortVisible) {
                    setSortVisible(false)
                }
            }
            }
            className='w-full flex-1 relative'>

            <CommonHeader
                name='Staff'
                isSearch={true}
                onChangeText={(val) => {
                    setSearchValue(val)
                    if (offsetValues) {
                        setOffsetValues(0)
                    }
                }
                }
                searchvalue={searchValue}
                setSearchValue={setSearchValue}
                onClickButton={() => {
                    CommonToast.show({ type: 'warn', message: "Staff added successfully!" });

                    // setShowToast(true)
                    setSelectedStaffId('0')
                    setAddStaffOpen(true)
                }
                }
            />

            <div className={`flex fixed items-center self-center ${extendTab ? 'sm:w-[85%]' : 'sm:w-[95%]'} max-sm:w-[86%] ml-1 bg-white rounded-xl mt-2 border border-gray-100 transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between px-3 py-1 max-sm:w-[70%] sm:w-[95%] rounded-4xl self-center my-1 mx-0.5">

                    <div
                        className={`transition-all ease-in-out duration-200`}
                        onClick={() => {
                            scrollToCategory(selectedIndex - 1)
                            setSelctedIndex(selectedIndex - 1)
                        }
                        }>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-gray-700' />
                    </div>


                    <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth  scrollbar-hidden sm:w-[90%] max-sm:w-[90%] z-30 ">
                        {staffCategory?.map((i, index: number) => (
                            <div
                                key={index}
                                ref={(el) => { categoryRef.current[index] = el; }}
                                onClick={() => {
                                    setSelctedIndex(index)
                                    scrollToCategory(index)
                                    setStaffCategory((prev) => {
                                        return prev.map((values) => {
                                            return {
                                                ...values,
                                                selected: values.label == i.label ? !values.selected : false
                                            }

                                        })

                                    })
                                    if (i.selected) {
                                        setSelectedFilter('')
                                    }
                                    else {
                                        setSelectedFilter(i.label)
                                    }
                                }
                                }
                                className={`flex items-center  cursor-pointer px-3 ${i.selected ? ' bg-white border-black' : 'border-gray-300'} border-[1px] mx-2 rounded-xl h-7`}
                            >
                                <p className="text-black font-bold text-[12px] capitalize">{i.label}</p>
                            </div>
                        ))}
                    </div>

                    <div
                        onClick={() => {
                            scrollToCategory(selectedIndex + 1)
                            setSelctedIndex(selectedIndex + 1)
                        }
                        }
                    >
                        <FontAwesomeIcon icon={faChevronRight} className='text-gray-700' />
                    </div>


                </div >

                <div className="px-5">
                    <div
                        onMouseEnter={() => setSortVisible(true)}
                        onMouseLeave={() => setSortVisible(false)}
                        className="px-2 bg-gray-100  cursor-pointer h-6 hover:"
                        onClick={() => setSortVisible((prev) => !prev)}
                    >
                        <FontAwesomeIcon icon={faFilter} className="text-black " />
                    </div>

                    <div
                        className={`absolute right-4  mt-3 w-[90px] bg-white transition-all duration-500 ease-in-out overflow-hidden rounded-b-md shadow-lg 
                   ${sortVisible ? "max-h-40 opacity-100 scale-100" : "max-h-0 opacity-0"}`}>
                        {sortList.map((values, index) => (
                            <div
                                key={index}
                                className="flex px-2 py-1 cursor-pointer hover:bg-gray-200 transition-colors"
                                onClick={() => {
                                    setSortList((prev) =>
                                        prev.map((item) => ({
                                            ...item,
                                            selected: item.name === values.name ? !item.selected : false,
                                        }))
                                    );
                                    setSelectedSort(values?.selected ? '' : values.key)
                                }}
                            >
                                <p
                                    className={` text-[11px] font-medium ${values.selected ? "text-black font-bold" : "text-gray-500"
                                        }`}
                                >
                                    {values.name}
                                </p>
                                {values.selected && (
                                    <FontAwesomeIcon icon={faCheck} className="text-black text-[11px] ml-1" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className=''>
                < ListItem
                    title='Staff'
                    limit={limit}
                    data={staffList?.data ? staffList?.data : []}
                    RenderItem={RenderItem}
                    totalCount={staffList?.count ? staffList?.count : 0}
                    setOffset={setOffsetValues}
                    isLoading={isLoading}
                    isChange={selectedFilter}
                    isSearch={staffList?.count ? '' : searchValue ? searchValue : selectedFilter}
                />
            </div>

            {addStaffOpen &&
                <Modal
                    setOpen={setAddStaffOpen}
                    isSubScreen
                    RenderItem={() =>
                        < AddEditStaff
                            open={addStaffOpen}
                            staffId={selectedStaffId}
                            setOpen={setAddStaffOpen}
                            setSelectedStaffId={setSelectedStaffId} />
                    }
                    open={addStaffOpen} />}


            {dialogOpen && <Modal
                open={dialogOpen}
                setOpen={setDialogOpen}
                RenderItem={() => <DialogBox />}
            />}


            {delDialogOpen && <Modal
                RenderItem={() =>
                    <CommonDialogBox
                        iconkey='PR'
                        name='Product'
                        setClose={setDelDialogOpen}
                        onClickDialog={(val) => {
                            if (val == '1') {
                                deleteStaff()
                            }
                            else {
                                setSelectedStaffId('0')
                            }
                        }
                        }
                    />
                }
                open={delDialogOpen}
                setOpen={setDelDialogOpen}
            />}



        </div >
    )
}
