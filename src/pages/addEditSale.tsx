import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { AppContext } from '../context'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CommonLoader from '../components/commonLoading'
import SaleService from '../services/components/saleService'
import DatePicker from '../components/commonDatePicker'

// interface DropDownItem {
//     id?: number;
//     label?: string;
//     value: string;
//     selected: boolean;
// }

interface ProductProps {
    setOpen: Dispatch<SetStateAction<boolean>>
    saleId?: string
    open: boolean
    setSelectedSaleId: Dispatch<SetStateAction<string>>
}

const AddEditSale = ({ setOpen, saleId, setSelectedSaleId }: ProductProps) => {

    // let saleId = Route.id
    let isEdit = saleId?.trim() != '0' ? true : false
    const { storeId } = useContext(AppContext)
    const [saleDetails, setSaleDetails] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState({ fetch: false, update: false })

    const [selectedDate, setSelectedDate] = useState<any>(null)

    useEffect(() => {
        if (isEdit) {
            console.log("inside plus-->");
            setIsLoading({ fetch: true, update: false })
            getOneSale()
        }
        else {
        }
    }, [])

    console.log("---->", saleId);

    const getOneSale = useCallback(() => {
        if (saleId) {
            SaleService.getOneSaleLogs(storeId, saleId).then((res: any) => {
                if (res?.saleDetails) {
                    setSaleDetails(res?.saleDetails)
                    setSelectedDate(new Date(res?.saleDetails?.createdAt))
                    setIsLoading((prev) => {
                        return { ...prev, fetch: false, update: false }
                    })
                }
                console.log("------>", res);

            }).catch((err: any) => {
                console.log("error in getOneSale", err);
            }).finally(() => {

            })
        }
    }, [])

    const AddSale = async (isUpdate: boolean) => {

        let data =
            formik.values.saleDate ?
                {
                    missedDate: formik.values.saleDate,
                    amount: formik.values.salary,
                }
                :
                {
                    amount: formik.values.salary,
                }

        if (!isUpdate) {
            let SaleServiceType = formik.values.saleDate ? SaleService.getPostMissedSaleLogs(storeId, data) : SaleService.getPostSalesLogs(storeId, data)
            SaleServiceType.then((res: any) => {
                if (res.success) {
                    console.log("successfully-->", res);
                }
                else {
                    setSelectedSaleId('0')
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                }
            }).catch((error: any) => {
                console.log("error in getOnePostProductData -->", error)
            }).finally(() => {
                setOpen(false)
            })
        }
        else if (isUpdate) {
            SaleService.getOneUpdateSaleLogs(storeId, saleId || '', data).then((res: any) => {
                if (res.success) {
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                    setSelectedSaleId('0')
                    console.log("successfully-->", res);
                }
                else {
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                    setSelectedSaleId('0')
                }
            }).catch((error: any) => {
                console.log("error in getOnePostProductData -->", error)
            }).finally(() => {
                setOpen(false)
            })
        }
    }

    const validationSchema = Yup.object().shape({
        salary: Yup.number()
            .typeError('Salary must be a number')
            .required('Salary is required')
            .min(1, 'Salary must be at least 1'),
        saleDate: Yup.string()
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues:
        {
            salary: saleDetails ? saleDetails?.todaySaleAmount : 0,
            saleDate: saleDetails ? saleDetails?.createdAt : '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setIsLoading((prev) => { return { ...prev, update: true } })
            AddSale(isEdit)
        }

    })

    useEffect(() => {
        if (selectedDate && selectedDate?.startDate) {
            formik.setFieldValue('saleDate', selectedDate?.startDate)
        }
    }, [selectedDate])


    return (

        <div className='pb-4 border-2  h-screen w-full xl:w-[350px] bg-white  rounded-tl-2xl overflow-y-auto flex-col justify-center items-center scrollbar-hidden'>

            <div className='bg-gray-200 flex py-2 px-2 items-center justify-between  '>
                <p className='text-[14px] text-black font-bold'>{isEdit ? 'Edit Sale' : 'Add Sale'}</p>
                <button
                    type='button'
                    onClick={() => {
                        setOpen(false)
                    }}>
                    <FontAwesomeIcon icon={faClose} className='text-black' />
                </button>

            </div>
            <>
                {isLoading.fetch ?
                    <div className='flex justify-center items-center h-screen'>
                        <CommonLoader size='large' />
                    </div> :
                    <form onSubmit={formik.handleSubmit} className='flex w-[100%] ' >

                        <div className='w-[100%] px-3'>

                            <div className='px-2 py-4'>

                                <div className=' justify-between'>

                                    <div className=''>
                                        <input
                                            aria-autocomplete='inline'
                                            disabled={isLoading?.update}
                                            id='saleDate'
                                            value={formik.values.salary > 0 ? formik.values.salary : ''}
                                            type='text'
                                            placeholder='Store Sale Amount*'
                                            className='custom-input mt-5'
                                            onBlur={() => { formik.setFieldTouched('salary', true) }}
                                            onChange={formik.handleChange('salary')}

                                        />
                                        {formik.touched.salary && formik.errors.salary &&
                                            <p className='text[3px] text-red-500 font-light'>{typeof formik.errors.salary == 'string' ? formik.errors.salary : ''}</p>
                                        }


                                    </div>


                                </div>

                                <div >
                                    <DatePicker
                                        selectedDate={selectedDate}
                                        setSelectedaDate={setSelectedDate}
                                    />
                                </div>

                                {formik.touched.saleDate && formik.errors.saleDate &&
                                    <p className='text[3px] text-red-500 font-light'>{typeof formik.errors.saleDate == 'string' ? formik.errors.saleDate : ''}</p>
                                }

                            </div>

                            <div className='flex items-center w-full justify-center'>
                                <button type='submit' className='group  bg-white border border-black  rounded-xl  h-8 hover:bg-primary transform duration-100 hover:border-primary px-2 w-[100px]' >
                                    {
                                        isLoading?.update ?
                                            <CommonLoader size='small' /> :
                                            <p className='text-black capitalize font-medium group-hover:text-white group-hover:font-medium  text-[13px]'>{isEdit ? 'Update' : 'Add Staff'}</p>
                                    }
                                </button>
                            </div>
                            <>{console.log("inside of the sale-->>",)
                            }</>

                        </div>

                    </form>
                }
            </>
        </div>
    )
}

export default AddEditSale
