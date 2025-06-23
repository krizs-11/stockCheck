import { lazy, useContext, useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronLeft, faEye, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useParams } from 'react-router-dom'
import AuthService from '../services/components/authService'
import { AppContext } from '../context'
import back1 from '../assets/log2.png'

const CommonLoader = lazy(() => import('../components/commonLoading'))
const DropDownPicker = lazy(() => import('../components/dropDownPicker'))

export default function SignUp() {

    const { id } = useParams()

    const [opens, setOpens] = useState(false)
    const [productOpen, setProductOpen] = useState(false)

    const [eyeOpen, setEyeOpen] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const { userDetails, setUserDetails } = useContext(AppContext)

    const navigation = useNavigate()

    const [productCategory, setProductCategory] = useState(
        [
            {
                value: 'Electronics',
                selected: false
            },
            {
                value: 'Clothing',
                selected: false
            },
            {
                value: 'Beauty',
                selected: false
            },
            {
                value: 'Health',
                selected: false
            },
            {
                value: 'oil',
                selected: false
            },
            {
                value: 'masala',
                selected: false
            },
            {
                value: 'vegetables',
                selected: false
            },
            {
                value: 'fruits',
                selected: false
            },
            {
                value: 'Snacks',
                selected: false
            },
            {
                value: 'Beverages',
                selected: false
            },
            {
                value: 'diary',
                selected: false
            },
        ])

    const [staffCategory, setStaffCategory] = useState(
        [
            {
                value: 'chef',
                selected: false
            },
            {
                value: 'cashier',
                selected: false
            },
            {
                value: 'kitchen assistant',
                selected: false
            },
            {
                value: 'cleaner',
                selected: false
            },
            {
                value: 'manager',
                selected: false
            },
            {
                value: 'receptionist',
                selected: false
            },
            {
                value: 'waiter',
                selected: false
            },

        ])

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('name is required')
            .matches(/^[a-zA-Z\s]+$/, 'Name can only contain Latin letters and spaces.'),
        email: Yup.string()
            .required('email Name is required')
            .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email id is invalid")
        ,
        passWord: Yup.string().when([],
            {
                is: () => !id,
                then: (schema) => schema.min(8, 'Password is too short - should be 8 chars minimum.')
                    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
                    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
                    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
                    .matches(/[0-9]/, 'Password must contain at least one number.')
                    .matches(/[@$!%*?&]/, 'Password must contain at least one special character.')
                    .required('Password is required'),
                otherwise: (schema) => schema.notRequired(),
            }
        ),
        storeName:
            Yup.string()
                .required('storeName is required')
                .matches(/^[a-zA-Z\s]+$/, 'storeName can only contain Latin letters and spaces.'),
        staffCategory: Yup.array()
            .of(Yup.string().required("Category cannot be empty")) // Ensures each string is not empty
            .min(1, "At least one category is required"), // Ensures the array has at least one item 
        productCategory: Yup.array()
            .of(Yup.string().required("Category cannot be empty")) // Ensures each string is not empty
            .min(1, "At least one category is required"), // Ensures the array has at least one item ,
        phoneNumber: Yup.string()
            .matches(/^\d{10}$/, 'Only 10 digits are required') // Ensures exactly 10 digits
            .required('Phone number is required')

    })

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);

    const formik: any = useFormik({
        initialValues:
            id ?
                {
                    email: userDetails?.email,
                    passWord: userDetails?.email,
                    phoneNumber: userDetails?.phoneNumber,
                    staffCategory: userDetails?.staffCategory,
                    productCategory: userDetails?.productCategory || [],
                    storeName: userDetails?.storeName,
                    name: userDetails?.name,
                } :
                {
                    email: '',
                    passWord: '',
                    phoneNumber: '',
                    staffCategory: [],
                    productCategory: [],
                    storeName: '',
                    name: ''
                },
        validationSchema: validationSchema,
        onSubmit: () => {
            console.log("inside of onsumbit");
            setIsLoading(true)
            addNewUser()
        }
    })

    const addNewUser = async () => {
        try {
            let data =
            {
                email: formik.values.email,
                name: formik.values.name,
                password: formik.values.passWord,
                phoneNumber: formik.values.phoneNumber,
                storeName: formik.values.storeName,
                productCategory: formik.values.productCategory,
                staffCategory: formik.values.staffCategory
            }
            if (id) {
                await AuthService.updateUserData(data, id).then((isUpdated: any) => {
                    if (isUpdated.success) {
                        if (isUpdated?.userId) {
                            let updated = isUpdated?.userId[0]
                            console.log("---->", isUpdated?.userId[0]);

                            setUserDetails((prev) => {
                                if (!prev) return null; // fallback for safety
                                return {
                                    ...prev,
                                    email: updated.email,
                                    name: updated.name,
                                    phoneNumber: updated.phoneNumber,
                                    productCategory: updated.productCategory,
                                    staffCategory: updated.staffCategory,
                                    storeName: updated.storeName,
                                };
                            });
                        }

                        console.log("isnewuseradded", isUpdated);
                        setIsLoading(false)
                        navigation('/settings')

                    }
                }).catch((error) => {
                    console.log("error in postNewUserData-->", error);
                })
            }
            else {
                await AuthService.postNewUserData(data).then((isNewUserAdded) => {
                    console.log("isnewuseradded", isNewUserAdded);
                    setIsLoading(false)
                    navigation('/signIn')
                }).catch((error) => {
                    console.log("error in postNewUserData-->", error);
                })
            }
        }
        catch (error) {
            console.log("error in addNewUser", error);
        }

    }

    useEffect(() => {
        if (id) {
            setProductCategory((prev) => {
                return prev.map((item) => {
                    return { ...item, selected: formik.values.productCategory.includes(item.value) }
                })
            })
            setStaffCategory((prev) => {
                return prev.map((item) => {
                    return { ...item, selected: formik.values.staffCategory.includes(item.value) }
                })
            })

            console.log("fomrik products", formik.values.productCategory);
        }
    }, [id])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 430);
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call it once to catch device orientation changes, etc.
        handleResize();

        // Clean up on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            style={{ flexDirection: isMobile ? 'column' : 'row' }}
            className='flex w-screen h-screen bg-white'>

            <div
                style={{ width: window.innerWidth <= 430 ? '100%' : '50%', }}
                className='w-[50%] bg-white h-full rounded-tr-md  overflow-y-auto scrollbar-hidden pb-5 '>

                <div className='flex  items-center px-5'>
                    {!id && <div className='p-0 visible sm:hidden' onClick={() => {
                        navigation('/signIn')

                    }
                    }>
                        <FontAwesomeIcon icon={faCircleChevronLeft} className='text-gray-600 text-[16px] py-10' />
                    </div>
                    }                    <div className='ps-5'>
                        <p className='text-3xl text-primary font-bold capitalize'>{id ? 'Update Your store Details' : 'Create your new store'}</p>
                        {!id && <p className='text-2xl text-black font-light'>SignUp with required details</p>}
                    </div>
                    <div className='sm:visible hidden'>
                        <img src={logo} className='h-[120px] w-[120px]' />
                    </div>

                </div>

                <form onSubmit={formik.handleSubmit} className='sm:w-[60%] w-[90%] flex flex-col m-0 px-8 py-5' >
                    <input
                        id='email'
                        value={formik.values.email}
                        type='email'
                        placeholder='Email*'
                        className='custom-input'
                        onBlur={() => { formik.setFieldTouched('email', true) }}
                        onChange={formik.handleChange('email')}
                    />
                    {formik.touched.email && formik.errors.email && <p className='custom-error'>{formik.errors.email}</p>}

                    <input
                        id='name'
                        value={formik.values.name}
                        type='text'
                        placeholder='Name'
                        className='custom-input mt-5'
                        onBlur={() => { formik.setFieldTouched('name', true) }}
                        onChange={formik.handleChange('name')}
                    />

                    {formik.touched.name && formik.errors.name && <p className='custom-error'>{formik.errors.name}</p>}
                    {!id &&
                        <>
                            <div className='relative flex'>
                                <input
                                    id='passWord'
                                    type={eyeOpen ? 'text' : 'password'}
                                    placeholder='Password'
                                    className='custom-input mt-5'
                                    onBlur={() => { formik.setFieldTouched('passWord', true) }}
                                    onChange={formik.handleChange('passWord')}
                                />
                                <FontAwesomeIcon
                                    icon={eyeOpen ? faEye : faEyeSlash}
                                    className='text-black absolute left-[90%] top-8'
                                    onClick={() => { setEyeOpen(!eyeOpen) }} />
                            </div>

                            {formik.touched.passWord && formik.errors.passWord && <p className='custom-error'>{formik.errors.passWord}</p>}
                        </>

                    }

                    <div className={`${productOpen ? 'z-20' : 'z-0'}`}>
                        <DropDownPicker
                            labelname={'product Category'}
                            open={productOpen}
                            setOpen={setProductOpen}
                            setValue={setProductCategory}
                            multiple={true}
                            value={productCategory}
                            onClick={() => {
                                formik.setFieldTouched('productCategory', true)
                            }
                            }
                            onSelectItem={(value) => {
                                console.log("selcted item of the product Category", value);
                                formik.setFieldValue('productCategory', value)
                            }
                            }
                        />
                    </div>
                    {formik.touched.productCategory && formik.errors.productCategory && <p className='custom-error'>{formik.errors.productCategory}</p>}

                    <div className={`${opens ? 'z-20' : 'z-0'}`}>
                        <DropDownPicker
                            labelname={'Staff Category'}
                            open={opens}
                            setOpen={setOpens}
                            setValue={setStaffCategory}
                            multiple={true}
                            value={staffCategory}
                            onClick={() => { formik.setFieldTouched('staffCategory', true) }}
                            onSelectItem={(value) => {
                                console.log("selcted item of the Staff Category", value);
                                formik.setFieldValue('staffCategory', value)
                            }
                            }
                        />
                    </div>
                    {formik.touched.staffCategory && formik.errors.staffCategory && <p className='custom-error'>{formik.errors.staffCategory}</p>}

                    <input
                        id='phoneNumber'
                        value={formik.values.phoneNumber}
                        type='number'
                        placeholder='Number*'
                        className='custom-input mt-5 focus:text-primary'
                        onBlur={() => { formik.setFieldTouched('phoneNumber', true) }}
                        onChange={formik.handleChange('phoneNumber')}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className='custom-error'>{formik.errors.phoneNumber}</p>}

                    <input
                        id='storeName'
                        value={formik.values.storeName}
                        type='text'
                        placeholder='StoreName'
                        className='custom-input mt-5'
                        onBlur={() => { formik.setFieldTouched('storeName', true) }}
                        onChange={formik.handleChange('storeName')}
                    />
                    {formik.touched.storeName && formik.errors.storeName && <p className='custom-error'>{formik.errors.storeName}</p>}

                    <>{console.log("flag check--->", formik.errors)}</>

                    <div className='flex items-center  justify-center mt-4'>
                        <button
                            type='submit'
                            className='group bg-white border border-black  rounded-xl w-[35%] h-10.5 hover:bg-primary transform duration-100 hover:border-primary ' >
                            {
                                isLoading ? <CommonLoader size='small' /> :
                                    <p className='text-black capitalize font-medium group-hover:text-white group-hover:font-medium '>{id ? 'update' : 'SignUp'}</p>

                            }
                        </button>

                    </div>

                </form>

            </div>

            <div
                style={{ width: isMobile ? '100%' : '50%', height: isMobile ? 100 : 'auto', backgroundImage: `url(${back1})` }}
                className='w-[50%] bg-primary h-full hidden sm:flex justify-center items-center rounded-bl-full bg-blend-color-burn '>
                <FontAwesomeIcon icon={faTruckFast} className='text-9xl text-white' />
            </div>

            <>{console.log("producr", productCategory)
            }</>

        </div>
    )
}
