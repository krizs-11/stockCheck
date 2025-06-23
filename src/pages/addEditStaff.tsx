import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import DropDownPicker from '../components/dropDownPicker'
import { AppContext } from '../context'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CommonLoader from '../components/commonLoading'
import StaffService from '../services/components/staffService'

interface DropDownItem {
    id?: number;
    label?: string;
    value: string;
    selected: boolean;
}

interface ProductProps {
    setOpen: Dispatch<SetStateAction<boolean>>
    staffId?: string
    open: boolean
    setSelectedStaffId: Dispatch<SetStateAction<string>>
}

const AddEditStaff = ({ setOpen, staffId, setSelectedStaffId }: ProductProps) => {

    // let staffId = Route.id
    let isEdit = staffId?.trim() != '0' ? true : false
    const { userDetails, storeId } = useContext(AppContext)
    const [staffCategory, setProductCategory] = useState<DropDownItem[]>([])
    const [openCategory, setOpenCategory] = useState(false)
    const [staffDetails, setStaffDetails] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState({ fetch: false, update: false })

    useEffect(() => {
        if (isEdit) {
            console.log("inside plus-->");
            setIsLoading({ fetch: true, update: false })
            getOneStaff()
        }
        else {
            setProductCategory((prev) => {
                let addData = [...prev]
                addData = userDetails?.staffCategory?.map((values, index: number) => {
                    return {
                        id: index + 1,
                        label: values,
                        value: values,
                        selected: false
                    }
                }) || []
                return addData
            })
        }
    }, [])

    const getOneStaff = useCallback(() => {
        if (staffId) {
            StaffService.getOneStaffData(storeId, staffId).then((res: any) => {
                if (res?.staffData) {
                    setStaffDetails(res?.staffData)
                    setProductCategory((prev) => {
                        let addData = [...prev]
                        addData = userDetails?.staffCategory?.map((values, index: number) => {
                            return {
                                id: index + 1,
                                label: values,
                                value: values,
                                selected: String(staffDetails?.staffCategory).trim().toLowerCase() == String(res.staffData.role).trim().toLowerCase()
                            }
                        }) || []
                        return addData
                    })
                    setIsLoading((prev) => {
                        return { ...prev, fetch: false, update: false }
                    })
                }
                console.log("------>", res);

            }).catch((err: any) => {
                console.log("error in getOneStaff", err);
            }).finally(() => {

            })
        }
    }, [])

    const AddStaff = async (isUpdate: boolean) => {

        let data =
        {
            name: formik.values.staffName,
            email: formik.values.staffEmail,
            salary: formik.values.salary,
            role: formik.values.staffCategory.trim()
        }

        if (!isUpdate) {
            StaffService.getPostStaffData(storeId, data).then((res: any) => {
                if (res.success) {
                    console.log("successfully-->", res);
                }
                else {
                    setSelectedStaffId('0')
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
            StaffService.getOneUpdateStaff(storeId, staffId || '', data).then((res: any) => {
                if (res.success) {
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                    setSelectedStaffId('0')
                    console.log("successfully-->", res);
                }
                else {
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                    setSelectedStaffId('0')
                }
            }).catch((error: any) => {
                console.log("error in getOnePostProductData -->", error)
            }).finally(() => {
                setOpen(false)
            })
        }


    }

    const validationSchema = Yup.object().shape({
        staffName: Yup.string().required('StaffName is required'),
        salary: Yup.number()
            .typeError('Salary must be a number')
            .required('Salary is required')
            .min(1, 'Salary must be at least 1'),
        staffEmail: Yup.string()
            .required('Email is required')
            .email('Email id is invalid'),
        staffCategory: Yup.string().required('Category is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues:
        {
            staffName: staffDetails ? staffDetails?.name : '',
            salary: staffDetails ? staffDetails?.salary : 0,
            staffEmail: staffDetails ? staffDetails?.email : '',
            staffCategory: staffDetails ? staffDetails?.role : '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setIsLoading((prev) => { return { ...prev, update: true } })
            AddStaff(isEdit)
        }

    })


    return (

        <div className='pb-4 border-2  h-screen w-full xl:w-[350px] bg-white  rounded-tl-2xl overflow-y-auto flex-col justify-center items-center scrollbar-hidden'>

            <div className='bg-gray-200 flex py-2 px-2 items-center justify-between  '>
                <p className='text-[14px] text-black font-bold'>{isEdit ? 'Edit Staff' : 'Add Staff'}</p>
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

                                <div className=''>
                                    <input
                                        disabled={isLoading?.update}
                                        id='staffName'
                                        value={formik.values.staffName}
                                        type='text'
                                        placeholder='StaffName *'
                                        className='custom-input mt-5'
                                        onBlur={() => { formik.setFieldTouched('staffName', true) }}
                                        onChange={formik.handleChange('staffName')}
                                    />
                                </div>

                                {formik.touched.staffName && formik.errors.staffName &&
                                    <p className='text[3px] text-red-500 font-light'>{typeof formik.errors.staffName == 'string' ? formik.errors.staffName : ''}</p>
                                }

                                <div className=' justify-between'>

                                    <div className=''>
                                        <input
                                            disabled={isLoading?.update}
                                            id='staffEmail'
                                            value={formik.values.staffEmail}
                                            type='text'
                                            placeholder='StaffEmail*'
                                            className='custom-input mt-5'
                                            onBlur={() => { formik.setFieldTouched('staffEmail', true) }}
                                            onChange={formik.handleChange('staffEmail')}
                                        />
                                        {formik.touched.staffEmail && formik.errors.staffEmail &&
                                            <p className='text[3px] text-red-500 font-light'>{typeof formik.errors.staffEmail == 'string' ? formik.errors.staffEmail : ''}</p>
                                        }

                                    </div>


                                </div>

                                <div className=''>
                                    <input
                                        disabled={isLoading?.update}
                                        id='salary'
                                        value={formik.values.salary}
                                        type='number'
                                        placeholder='Salary'
                                        className='custom-input mt-5'
                                        onBlur={() => { formik.setFieldTouched('salary', true) }}
                                        onChange={formik.handleChange('salary')}
                                    />
                                </div>
                                {formik.touched.salary && formik.errors.salary &&
                                    <p className='text[3px] text-red-500 font-light'>{typeof formik.errors.salary == 'string' ? formik.errors.salary : ''}</p>
                                }

                                <div className='relative'>
                                    <DropDownPicker
                                        labelname="Staff category"
                                        onClick={() => { formik.setFieldTouched('staffCategory', true) }}
                                        onSelectItem={(val) => {
                                            formik.setFieldValue('staffCategory', val)
                                            console.log("selected", val)
                                        }
                                        }
                                        open={openCategory}
                                        setOpen={setOpenCategory}
                                        setValue={setProductCategory}
                                        value={staffCategory}
                                        multiple={false}
                                    />
                                    {formik.touched.staffCategory && formik.errors.staffCategory &&
                                        <p className='text[3px] text-red-500 font-light'>{typeof formik.errors.staffCategory == 'string' ? formik.errors.staffCategory : ''}</p>
                                    }

                                </div>

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


                            <>{console.log("d--->", staffCategory)
                            }</>
                        </div>

                    </form>
                }
            </>
        </div>
    )
}

export default AddEditStaff
