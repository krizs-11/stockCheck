import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import DropDownPicker from '../components/dropDownPicker'
import { AppContext } from '../context'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ProductService, { ProductDetail } from '../services/components/productService'
import CommonLoader from '../components/commonLoading'

interface DropDownItem {
    id?: number;
    label?: string;
    value: string;
    selected: boolean;
}

interface ProductProps {
    setOpen: Dispatch<SetStateAction<boolean>>
    productId?: string
    open: boolean
    setSelectedProductId: Dispatch<SetStateAction<string>>
}

const AddEditProduct = ({ setOpen, productId, setSelectedProductId }: ProductProps) => {

    // let productId = Route.id
    let isEdit = productId?.trim() != '0' ? true : false
    const { userDetails, storeId } = useContext(AppContext)
    const [productCategory, setProductCategory] = useState<DropDownItem[]>([])
    const [openCategory, setOpenCategory] = useState(false)
    const [productDetails, setproductDetails] = useState<ProductDetail | null>(null)
    const [isLoading, setIsLoading] = useState({ fetch: false, update: false })

    useEffect(() => {
        if (isEdit) {
            console.log("inside plus-->");
            setIsLoading({ fetch: true, update: false })
            getOneProduct()
        }
        else {
            setProductCategory((prev) => {
                let addData = [...prev]
                addData = userDetails?.productCategory?.map((values, index: number) => {
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

    const getOneProduct = useCallback(() => {
        if (productId) {
            ProductService.getOneProductData(storeId, productId).then((res) => {
                if (res?.inventoryData) {
                    setproductDetails(res?.inventoryData)
                    setProductCategory((prev) => {
                        let addData = [...prev]
                        addData = userDetails?.productCategory?.map((values, index: number) => {
                            return {
                                id: index + 1,
                                label: values,
                                value: values,
                                selected: productDetails?.productCategory == res.inventoryData.productCategory
                            }
                        }) || []
                        return addData
                    })
                    setIsLoading((prev) => {
                        return { ...prev, fetch: false, update: false }
                    })
                }
            }).catch((err: any) => {
                console.log("error in getOneProduct", err);
            }).finally(() => {

            })
        }
    }, [])

    const AddProduct = async (isUpdate: boolean) => {

        let data =
        {
            productName: formik.values.productName,
            quantityType: formik.values.quantityType,
            quantity: formik.values.quantity,
            price: formik.values.price,
            productCategory: formik.values.productCategory
        }

        if (!isUpdate) {
            ProductService.getOnePostProductData(storeId, data).then((res) => {
                if (res) {
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                    setSelectedProductId('0')
                    console.log("successfully-->", res);
                }
            }).catch((error) => {
                console.log("error in getOnePostProductData -->", error)
            }).finally(() => {
                setOpen(false)
            })
        }
        else if (isUpdate) {
            ProductService.getOneUpdateProductData(storeId, productId || '', data).then((res: any) => {
                if (res) {
                    setIsLoading((prev) => { return { ...prev, update: false } })
                    setOpen(false)
                    setSelectedProductId('0')
                    console.log("successfully-->", res);
                }
            }).catch((error: any) => {
                console.log("error in getOnePostProductData -->", error)
            }).finally(() => {
                setOpen(false)
            })
        }


    }

    const validationSchema = Yup.object().shape({
        productName: Yup.string().required('ProductName is equired'),
        price: Yup.number().required('ProductPrice is Required').min(1, 'Product Price Must Be Atleast 1'),
        quantityType: Yup.string().required('Quantity Type is required'),
        productCategory: Yup.string().required('Category is required'),
        quantity: Yup.number().max(1000, 'Quantity exceeds limits').required('Quantity is required').min(1, 'Quantity must be altleast 1')
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues:
        {
            productName: productDetails ? productDetails?.productName : '',
            price: productDetails ? productDetails?.price : 0,
            quantityType: productDetails ? productDetails?.quantityType : '',
            productCategory: productDetails ? productDetails?.productCategory : '',
            quantity: productDetails ? productDetails?.quantity : 0
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            setIsLoading((prev) => { return { ...prev, update: true } })
            AddProduct(isEdit)
        }

    })


    return (

        <div className='pb-4  border-2  h-screen w-full xl:w-[350px] bg-white  rounded-tl-2xl overflow-y-auto flex-col justify-center items-center scrollbar-hidden'>

            <div className='bg-gray-200 flex py-2 px-2 items-center justify-between  '>
                <p className='text-[14px] text-black font-bold'>{isEdit ? 'Edit product' : 'Add Product'}</p>
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
                                        id='productName'
                                        value={formik.values.productName}
                                        type='text'
                                        placeholder='ProductName'
                                        className='custom-input mt-5'
                                        onBlur={() => { formik.setFieldTouched('productName', true) }}
                                        onChange={formik.handleChange('productName')}
                                    />
                                </div>

                                {formik.touched.productName && formik.errors.productName &&
                                    <p className='text[3px] text-red-500 font-light'>{formik.errors.productName}</p>
                                }
                                <div className=' justify-between'>
                                    <div className=''>
                                        <input
                                            disabled={isLoading?.update}
                                            id='quantity'
                                            value={formik.values.quantity}
                                            type='number'
                                            placeholder='quantity'
                                            className='custom-input mt-5'
                                            onBlur={() => { formik.setFieldTouched('quantity', true) }}
                                            onChange={formik.handleChange('quantity')}
                                        />
                                        {formik.touched.quantity && formik.errors.quantity &&
                                            <p className='text[3px] text-red-500 font-light'>{formik.errors.quantity}</p>
                                        }

                                    </div>

                                    <div className=''>
                                        <input
                                            disabled={isLoading?.update}
                                            id='quantityType'
                                            value={formik.values.quantityType}
                                            type='text'
                                            placeholder='Qunatity type'
                                            className='custom-input mt-5'
                                            onBlur={() => { formik.setFieldTouched('quantityType', true) }}
                                            onChange={formik.handleChange('quantityType')}
                                        />
                                        {formik.touched.quantityType && formik.errors.quantityType &&
                                            <p className='text[3px] text-red-500 font-light'>{formik.errors.quantityType}</p>
                                        }

                                    </div>


                                </div>
                                <div className=''>
                                    <input
                                        disabled={isLoading?.update}
                                        id='price'
                                        value={formik.values.price}
                                        type='number'
                                        placeholder='Price'
                                        className='custom-input mt-5'
                                        onBlur={() => { formik.setFieldTouched('price', true) }}
                                        onChange={formik.handleChange('price')}
                                    />
                                </div>
                                {formik.touched.price && formik.errors.price &&
                                    <p className='text[3px] text-red-500 font-light'>{formik.errors.price}</p>
                                }

                                <div className='relative'>
                                    <DropDownPicker
                                        labelname="product category"
                                        onClick={() => { formik.setFieldTouched('productCategory', true) }}
                                        onSelectItem={(val) => {
                                            formik.setFieldValue('productCategory', val)
                                            console.log("selected", val)
                                        }
                                        }
                                        open={openCategory}
                                        setOpen={setOpenCategory}
                                        setValue={setProductCategory}
                                        value={productCategory}
                                        multiple={false}
                                    />
                                    {formik.touched.productCategory && formik.errors.productCategory &&
                                        <p className='text[3px] text-red-500 font-light'>{formik.errors.productCategory}</p>
                                    }

                                </div>

                            </div>

                            <div className='flex items-center w-full justify-center'>
                                <button type='submit' className='group  bg-white border border-black  rounded-xl  h-8 hover:bg-primary transform duration-100 hover:border-primary px-2 w-[100px]' >
                                    {
                                        isLoading?.update ?
                                            <CommonLoader size='small' /> :
                                            <p className='text-black capitalize font-medium group-hover:text-white group-hover:font-medium  text-[13px]'>{isEdit ? 'Update' : 'Add product'}</p>
                                    }
                                </button>
                            </div>


                            <>{console.log("d--->", productCategory)
                            }</>
                        </div>

                    </form>
                }
            </>
        </div>
    )
}

export default AddEditProduct
