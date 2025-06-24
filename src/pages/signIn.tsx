import { lazy, useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen, faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/logo.png';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AuthService from '../services/components/authService';
import storage from '../utils/storage';
import { AppContext } from '../context';
import { Link, useNavigate } from 'react-router-dom';
import { CommonToast } from "../services/toastService";
// import CommonToasts from '../components/commonToast';
import { requestForToken } from '../firebase-config';
import CommonLoader from '../components/commonLoading';

const OtpScreen = lazy(() => import('./forgetPassword'))

export default function SignIn() {

    const navigation = useNavigate()
    const [isSecure, setIsSecure] = useState(false)
    const { setIsLoggedIn, setUserDetails, setIsStoreId } = useContext(AppContext)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);
    const [screen, setScreen] = useState({ otp: false, password: false })
    // const [fcmToken, setFcmToken] = useState('')
    const [buttonloading, setButtonLoading] = useState(false)
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

    const validationSchema = Yup.object().shape({
        isEmailScreen: Yup.boolean(),
        isUpdateScreen: Yup.boolean(),
        email: Yup.string()
            .when('isUpdateScreen', ([isUpdateScreen], schema) => {
                return isUpdateScreen == false ?
                    schema.required('email Name is required')
                        .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Email id is invalid")
                    : schema.notRequired()
            })
        ,
        passWord: Yup.string()
            .when('isEmailScreen', ([isEmailScreen], schema) => {
                return isEmailScreen == false ?
                    schema.min(8, 'Password is too short - should be 8 chars minimum.')
                        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
                        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
                        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
                        .matches(/[0-9]/, 'Password must contain at least one number.')
                        .matches(/[@$!%*?&]/, 'Password must contain at least one special character.')
                        .required('Password is required') :
                    schema.notRequired()
            }),
        reEnterPassword: Yup.string()
            .when('isUpdateScreen', ([isUpdateScreen], schema) => {
                return isUpdateScreen ?
                    schema.required('Reenter pasword required').test('password did not match', function (value) {
                        const { passWord } = this.parent
                        return passWord === value
                    }) :
                    schema.notRequired()
            })
    })

    const formik = useFormik(
        {
            initialValues:
            {
                email: '',
                passWord: '',
                isEmailScreen: false,
                isUpdateScreen: false,
                reEnterPassword: ''
            },
            validationSchema: validationSchema,
            onSubmit: async () => {
                setButtonLoading(true)
                if (formik.values.isEmailScreen) {
                    await verifyEmail()
                }
                else if (formik.values.isUpdateScreen) {
                    await updatePassowrd()
                    setButtonLoading(false)
                }
                else {
                    await deviceToken()
                    setButtonLoading(false)
                }
            }
        })
    // console.log("navigator.userAgent--->", navigator.userAgent.split('(')[0])

    // for user login
    const authLogin = async (fcmToken: string) => {
        try {
            let data =
            {
                email: formik.values.email,
                password: formik.values.passWord,
                token: fcmToken,
                name: navigator.userAgent.split('(')[0]
            }
            await AuthService.postUser(data).then((isVerifyUser: any) => {
                if (isVerifyUser?.success) {
                    storage.setItem('storeToken', isVerifyUser?.accessToken)
                    storage.setItem('storeId', isVerifyUser?.userCrendentials[0]?.id)
                    setUserDetails(isVerifyUser?.userCrendentials[0])
                    console.log("isVerifyUser?.accessToken", isVerifyUser?.accessToken, isVerifyUser?.userCrendentials[0]?.id);

                    setIsStoreId(String(isVerifyUser?.userCrendentials[0]?.id))
                    setIsLoggedIn(true)
                    setButtonLoading(false)
                    window.location.replace('/dashboard'); // 👈 Most reliable method
                    CommonToast.show({ type: 'success', message: 'Logged in successfully' })
                    navigation('/dashboard', { replace: true })
                }
                else {
                    CommonToast.show({ type: 'info', message: isVerifyUser?.message })
                }


                console.log("isverifyuser--->", JSON.stringify(isVerifyUser))
            }).catch((error) => {
                console.log("error in authLogin-->", error);
            })

        }
        catch (error) {
            console.log("error in authLogin-->", error);
        }

    }

    // using email verify 
    const verifyEmail = async () => {
        try {
            let data =
            {
                email: formik.values.email
            }
            AuthService.requestPasswordVerify(data).then((res: any) => {
                if (res) {
                    if (res.success) {
                        setScreen({ otp: true, password: false })
                        CommonToast.show({ type: 'success', message: 'OTP sent Succesfully' });
                    }
                    else {
                        CommonToast.show({ type: 'warn', message: res.message });
                    }
                    setButtonLoading(false)
                }
            }).catch((error) => {
                console.log("error in verifyEmail", error)
            })
        }
        catch (error) {

        }

    }

    // using for updating new password
    const updatePassowrd = async () => {
        try {
            const encodeData = btoa(formik.values.email + ':' + formik.values.passWord)
            let data =
            {
                isToken: true,
                value: encodeData
            }
            AuthService.requestUpdatePasword(data).then((res: any) => {
                if (res.success) {
                    formik.resetForm()
                    CommonToast.show({ type: 'success', message: 'New Password Updated successfully' })
                }
                else {
                    CommonToast.show({ type: 'info', message: 'something went wrong' })
                }
                setButtonLoading(false)

            }).catch((error) => {
                console.log("error in requestUpdatePasword-->", error);
            })
        }
        catch (error) {

        }
    }


    const deviceToken = async () => {
        await requestForToken().then(async (tokenGenerated) => {
            console.log("requestForTokenhhhb-->", tokenGenerated);
            if (tokenGenerated) {
                // setFcmToken(tokenGenerated)
                console.log("requestForToken--->", tokenGenerated);
                await authLogin(tokenGenerated ? tokenGenerated : '')
            }
            else {
                //     console.log("else of the requestForToken");
                CommonToast.show({ type: 'error', message: 'something went wrong' })
            }
        })
            .catch((error) => {
                console.log("else of the error erques token", error);
                CommonToast.show({ type: 'error', message: 'something went wrong' })
            })

        // if (res) {

    }

    // console.log(fcmToken);

    return (
        <div className={`flex w-screen h-screen bg-primary `} style={{
            flexDirection: isMobile ? 'column' : 'row',
        }}>
            {!screen.otp && <div
                style={{ width: isMobile ? '100%' : '50%', }}
                className='flex flex-col w-[50%] bg-white  justify-center ps-5 rounded-br-full px-3 py-4'>
                <div className='w-full'>
                    <h1 className='sm:text-6xl text-3xl font-bold text-primary'>Welcome</h1>
                    <h2 className='sm:text-6xl text-2xl font-bold  text-primary'>back</h2>
                </div>
                <p className='text-1xl capitalize  text-primary sm:w-[70%] w-[80%] font-medium'>Inventory is a business's stock of goods and materials that are held for sale or use in production. It can include raw materials, work-in-progress, and finished goods.
                </p>
                <button className='bg-primary rounded-xl sm:w-[20%] w-[50%] h-10.5 mt-2 hover:bg-amber-300' onClick={() => {
                    navigation('/home')
                }
                }>
                    <p className='text-white capitalize font-bold'>learn more</p>
                </button>
            </div>}
            <div
                style={{ width: isMobile ? '100%' : '50%', }}
                className='flex w-[50%] bg-primary items-center justify-center flex-col h-full overflow-y-auto '>
                {
                    screen.otp ?
                        <div className='flex bg-amber-500'>
                            <OtpScreen email={formik.values.email}
                                onResend={verifyEmail}
                                setVisible={(val) => {
                                    setScreen({ otp: val, password: true })
                                    formik.setFieldValue('isEmailScreen', false)
                                    formik.setFieldValue('isUpdateScreen', true)
                                    formik.setFieldTouched('reEnterPassword', false)
                                }} />
                        </div>
                        :
                        <form onSubmit={formik.handleSubmit} className='w-[80%] bg-white   rounded-t-xl flex  flex-col overflow-hidden  h-[90%]'>
                            <div className='flex'>
                                <img src={logo} className='sm:h-[150px]sm:w-[150px] h-[100px] w-[100px]' />
                            </div>

                            <div className='ps-5'>
                                <p className='sm:text-3xl text-2xl text-primary font-bold capitalize'>welcome to the stock check</p>
                                {!formik.values.isEmailScreen && <p className='text-2xl text-black font-light'>{formik.values.isUpdateScreen ? "Update New Password" : "SignIn to your store"}</p>}
                                {formik.values.isEmailScreen && <p className='text-xl text-black font-light '>Verify Email</p>}

                            </div>

                            <div className='px-5 flex flex-col items-center justify-center py-5'>
                                {!formik.values.isUpdateScreen && <>
                                    <div className="relative sm:w-[60%] w-[100%] flex items-center border border-black rounded-xl px-3 focus-within:border-2 focus-within:border-primary transform duration-100">
                                        {/* Left-side icon */}
                                        <FontAwesomeIcon
                                            icon={faEnvelopeOpen}
                                            className="text-primary"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            className="peer w-full py-3 
                                bg-white
                                border-none
                                 h-[40px] pl-3 text-black text-base font-medium 
                                 focus:text-blue-600
                                  outline-none focus:ring-0 transition duration-200 placeholder-transparent
                                "
                                            placeholder=" " // Important for `peer-placeholder-shown`
                                            onBlur={() => { formik.setFieldTouched('email', true) }}
                                            onChange={formik.handleChange('email')}
                                        />

                                        <label
                                            htmlFor="email"
                                            className="absolute 
                                  left-8 
                                 bg-white
                             text-[14px] text-black
                             py-0.5
                             px-0.5
         font-medium transition-all duration-200 
        -translate-y-5 scale-75 
        peer-focus:text-blue-600 
        peer-placeholder-shown:top-2 
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-x-0 
        peer-placeholder-shown:-translate-y-0 
        peer-placeholder-shown:mt-0
        peer-focus:-translate-y-5
        peer-focus:scale-75
        peer-focus:translate-x-0
        peer-focus:bg-white"
                                        >
                                            Email
                                        </label>

                                    </div>

                                    {formik.touched.email && formik.errors.email && <p className='text[5px] text-red-500 font-light px-4 py-0 w-[60%]'>Email is required</p>}

                                </>}

                                {!formik.values.isEmailScreen && <>
                                    <div className="relative sm:w-[60%] w-[100%] flex items-center border border-black rounded-xl px-3 focus-within:border-2 focus-within:border-primary transform duration-100 mt-5">
                                        {/* Left-side icon */}
                                        <FontAwesomeIcon
                                            icon={faKey}
                                            className="text-primary"
                                        />

                                        <input
                                            id="password"
                                            value={formik.values.passWord}
                                            type={isSecure ? "text" : "password"}
                                            className="peer w-full py-3 
                                border-none
                                 h-[40px] pl-3 text-black text-base font-medium 
                                 focus:text-blue-600
                                  outline-none focus:ring-0 transition duration-200 placeholder-transparent
                                "
                                            placeholder=" " // Important for `peer-placeholder-shown`
                                            onBlur={() => { formik.setFieldTouched('passWord', true) }}
                                            onChange={formik.handleChange('passWord')}
                                        />

                                        <label

                                            htmlFor="password"
                                            className="absolute 
                                  left-8 
                                 bg-white
                             text-[14px] text-black
                             py-0.5
                             px-0.5
                             font-medium transition-all duration-200 
                             -translate-y-5 scale-75 
                             peer-focus:text-blue-600 
                              peer-placeholder-shown:top-2 
                             peer-placeholder-shown:scale-100
                             peer-placeholder-shown:translate-x-0 
                            peer-placeholder-shown:-translate-y-0 
                               peer-placeholder-shown:mt-0
                         peer-focus:-translate-y-5
        peer-focus:scale-75
        peer-focus:translate-x-0
        peer-focus:bg-white"
                                        >
                                            Password
                                        </label>

                                        <FontAwesomeIcon
                                            onClick={() => { setIsSecure(!isSecure) }}
                                            icon={isSecure ? faEye : faEyeSlash}
                                            className="text-primary"
                                        />
                                    </div>

                                    {formik.touched.passWord && formik.errors.passWord && <p className='text[5px] text-red-500 font-light sm:px-4 py-0 w-[60%]'>Password is required</p>}

                                </>}

                                {formik.values.isUpdateScreen && <>
                                    <div className="relative sm:w-[60%] w-[100%] flex items-center border border-black rounded-xl px-3 focus-within:border-2 focus-within:border-primary transform duration-100 mt-5">
                                        {/* Left-side icon */}
                                        <FontAwesomeIcon
                                            icon={faKey}
                                            className="text-primary"
                                        />

                                        <input
                                            id="reEnterPassword"
                                            value={formik.values.reEnterPassword}
                                            type={isSecure ? "text" : "password"}
                                            className="peer w-full py-3 
                                border-none
                                 h-[40px] pl-3 text-black text-base font-medium 
                                 focus:text-blue-600
                                  outline-none focus:ring-0 transition duration-200 placeholder-transparent
                                "
                                            placeholder=" " // Important for `peer-placeholder-shown`
                                            onBlur={() => { formik.setFieldTouched('reEnterPassword', true) }}
                                            onChange={formik.handleChange('reEnterPassword')}
                                        />

                                        <label
                                            htmlFor="reEnterPassword"
                                            className="absolute 
                                  left-8 
                                 bg-white
                             text-[14px] text-black
                             py-0.5
                             px-0.5
                             font-medium transition-all duration-200 
                             -translate-y-5 scale-75 
                             peer-focus:text-blue-600 
                              peer-placeholder-shown:top-2 
                             peer-placeholder-shown:scale-100
                             peer-placeholder-shown:translate-x-0 
                            peer-placeholder-shown:-translate-y-0 
                               peer-placeholder-shown:mt-0
                         peer-focus:-translate-y-5
        peer-focus:scale-75
        peer-focus:translate-x-0
        peer-focus:bg-white"
                                        >
                                            reEnterPassword
                                        </label>

                                        <FontAwesomeIcon
                                            onClick={() => { setIsSecure(!isSecure) }}
                                            icon={isSecure ? faEye : faEyeSlash}
                                            className="text-primary"
                                        />
                                    </div>

                                    {formik.touched.reEnterPassword && formik.errors.reEnterPassword ? <p className='text[5px] text-red-500 font-light px-4 py-0 w-[60%]'>Password is required</p> : null}

                                </>}

                                {!formik.values.isEmailScreen && !formik.values.isUpdateScreen &&
                                    <div className='flex justify-end sm:ml-50 mt-5 p-0 cursor-pointer ml-20 ' onClick={() => {
                                        formik.setFieldValue('isEmailScreen', true)
                                    }
                                    }>
                                        <p className='text-black'>Forget Password ?</p>
                                    </div>}


                            </div>

                            <div className='flex items-center w-full justify-center'>
                                <button type='submit' className='group bg-white border border-black  rounded-xl  h-10.5 hover:bg-primary transform duration-100 hover:border-primary px-5' >
                                    {buttonloading ? <CommonLoader size='large' /> : <p className='text-black capitalize font-medium group-hover:text-white group-hover:font-medium '>{formik.values.isEmailScreen ? "Verify And Proceed" : formik?.values?.isUpdateScreen ? 'Update Password' : 'SignIn'}</p>}
                                </button>


                            </div>

                        </form>
                }

                {!formik.values.isEmailScreen &&
                    !formik.values.isUpdateScreen &&
                    <div className='flex justify-center bg-white w-[80%] rounded-b-xl items-center '>
                        <p className='text-gray-400 text-[14px] font-medium'>Are you a new user?</p>
                        <Link to={'/signUp'}>
                            <p className='text-black px-2 font-medium text-[14px] cursor-pointer'>SignUp</p>
                        </Link>
                    </div>}

                {/* <CommonToasts ref={setToastRef} /> */}

                <>{console.log("formik--->", formik.touched)
                }</>

            </div>
        </div>
    )
}
