import { useContext, useEffect, useState, lazy } from 'react'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faMoneyBillWave, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import SaleService from '../services/components/saleService'
import CommonDialogBox from '../components/commonDialogBox'
import { CommonToast } from '../services/toastService'


const DatePicker = lazy(() => import('../components/commonDatePicker'))
const AddEditSale = lazy(() => import('./addEditSale'))
const Modal = lazy(() => import('../components/commonModal'))
const CommonHeader = lazy(() => import('../components/commonHeader'))
const ListItem = lazy(() => import('../components/commonList'))

type SaleLog = {
    todaySaleAmount: number;
    id: string;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
};

type SaleLogsResponse = {
    message: string;
    count: number;
    saleLogs: SaleLog[];
};

let limit = 10
export default function Sale() {

    const isFocus = useLocation()
    const { storeId } = useContext(AppContext)
    const [saleList, setSaleList] = useState<SaleLogsResponse | null>(null)
    const [offsetValues, setOffsetValues] = useState(0)
    const [selectedDate, setSelectedDate] = useState<any>(null)
    const [openDatePicker, setOpenDatePicker] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const [addEditSaleOpen, setAddEditSaleOpen] = useState(false)

    const [selectedSaleId, setSelectedSaleId] = useState<any>('')

    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        if (!addEditSaleOpen) {
            setIsLoading(true)
            getAllSales()
        }
    }, [isFocus, offsetValues, selectedDate, addEditSaleOpen])

    const getAllSales = async () => {
        let data =
        {
            from: selectedDate?.startDate ? selectedDate?.startDate : '',
            to: selectedDate?.endDate ? selectedDate?.endDate : '',
            // filter: selectedFilter,
            limit: limit,
            offset: offsetValues,
            // sort: selectedSort
        }
        await SaleService.getAllSales(storeId, data)
            .then((res: SaleLogsResponse) => {
                if (res) {
                    setSaleList(res)
                }
            })
            .catch((error: any) => {
                console.log("error in getAllSales-->", error);
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const deleteSale = async () => {
        try {
            SaleService.getOneDeleteSaleLogs(storeId, selectedSaleId).then((res) => {
                if (res) {
                    CommonToast.show({ type: 'success', message: 'Salelog Deleted Successfully' })
                    setOffsetValues(0)
                    getAllSales()
                }
            }).catch((error) => {
                console.log("error in deleteSale", error);
            })

        }
        catch (error) {
            console.log("error in deleteSale", error);


        }

    }

    const RenderItem = (data: { item: SaleLog }) => {
        return (
            <div
                className="bg-white sm:w-[90%] max-sm:w-[90%] my-2 mx-3 grow transition ease-in duration-200 flex-col justify-between px-2 rounded-2xl py-2">

                <div className='flex justify-between py-1 px-2 items-center bg-gray-100'>
                    <FontAwesomeIcon icon={faMoneyBillWave} className='text-green-500' />
                    <p className='text-black'>{new Date(data?.item?.createdAt).toLocaleString()}</p>
                </div>
                <div className='flex justify-between'>
                    <div >
                        <p className='text-gray-500 capitalize font-meduim text-[14px]'>price</p>
                        <p className='text-black font-bold sm:text-sm  xl:text-[14px]  capitalize'>{data?.item?.todaySaleAmount}</p>
                    </div>


                    <div className='flex sm:w-[10%] max-sm:w-[15%] items-center justify-between'>
                        <button type='button' onClick={() => {
                            setSelectedSaleId(String(data.item.id))
                            setAddEditSaleOpen(true)
                        }}>
                            <FontAwesomeIcon icon={faPencil} className='text-black' />
                        </button>
                        <button onClick={() => {
                            setOpenDialog(true)
                            setSelectedSaleId(data?.item?.id)
                        }
                        }>
                            <FontAwesomeIcon icon={faTrash} className='text-red-500' />

                        </button>
                    </div>
                </div>

            </div>
        )
    }

    const DateProps = () => {
        return (
            <DatePicker
                selectedDate={selectedDate}
                setDateOpen={setOpenDatePicker}
                setSelectedaDate={setSelectedDate}
                isRange={true}
                isShowHeader
            />
        )

    }

    const formatDate = (inpDate: string) => {
        const date = new Date(inpDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate


    }

    const CustomFilterComponent = () => {
        return (
            <div className='px-4 py-1 bg-white border-1 border-gray-500 flex rounded-xl' onClick={() => {
                setOpenDatePicker(true)
            }
            }>
                <FontAwesomeIcon icon={faCalendar} className='text-gray-600 text[13px]' />
                {selectedDate ?
                    <p className='text-black text-[12px] font-bold px-2 '>{`${formatDate(selectedDate?.startDate)}-${formatDate(selectedDate?.endDate)}`}</p> :
                    <p className='text-black text-[12px] font-medium px-2 '>Select a Date</p>}
            </div>
        )
    }




    return (

        <div className='w-full flex-1 relative'>

            <CommonHeader
                name='Sale'
                isSearch={false}
                isCustom={true}
                CustomComponent={CustomFilterComponent}
                onClickButton={() => {
                    setAddEditSaleOpen(true)
                    setSelectedSaleId('0')
                    // setOpenDatePicker(true)
                }
                }
            />



            <div className=''>
                < ListItem
                    title='sale'
                    limit={limit}
                    data={saleList ? saleList?.saleLogs : []}
                    RenderItem={RenderItem}
                    totalCount={saleList?.count ? saleList?.count : 0}
                    setOffset={setOffsetValues}
                    isLoading={isLoading}
                    isSearch={saleList?.count ? '' : selectedDate ? String(formatDate(selectedDate?.startDate) + " - " + formatDate(selectedDate?.endDate)) : ''}
                />
            </div>

            <Modal
                setOpen={setOpenDatePicker}
                RenderItem={DateProps}
                open={openDatePicker}
            />

            <>{console.log("from = '', to = ''", selectedDate ? new Date(selectedDate?.endDate) : '')
            }</>

            {addEditSaleOpen &&
                <Modal
                    setOpen={setAddEditSaleOpen}
                    isSubScreen
                    RenderItem={() =>
                        < AddEditSale
                            open={addEditSaleOpen}
                            saleId={selectedSaleId}
                            setOpen={setAddEditSaleOpen}
                            setSelectedSaleId={setSelectedSaleId} />
                    }
                    open={addEditSaleOpen} />}


            {openDialog && <Modal
                RenderItem={() =>
                    <CommonDialogBox
                        iconkey='DL'
                        name='Sale'
                        setClose={setOpenDialog}
                        onClickDialog={(val) => {
                            if (val == '1') {
                                deleteSale()
                            }
                            else {
                                setSelectedSaleId('0')
                            }
                        }
                        }
                    />
                }
                open={openDialog}
                setOpen={setOpenDialog}
            />}




        </div >
    )
}
