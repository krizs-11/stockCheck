import { useEffect, useMemo, useRef, useState } from 'react'
import AuthService from '../services/components/authService'
import { CommonToast } from '../services/toastService'

interface OtpProps {
    email: string,
    setVisible: (res: boolean) => void,
    setEnableUpdatePassword?: (res: boolean) => void,
    onResend: () => void
}

export default function OtpScreen({ email, setVisible, setEnableUpdatePassword, onResend }: OtpProps) {

    const [otpField, setOtpField] = useState([
        {
            id: '1',
            value: '',
        },
        {
            id: '2',
            value: ''
        }, {
            id: '3',
            value: ''
        }, {
            id: '4',
            value: ''
        }
    ])

    const inputRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRef.current[0]?.focus()

    }, [])

    const isEnable = useMemo(() => {
        return otpField.every((item) => item.value != '')
    }, [otpField])

    const [fieldSeconds, setFieldSeconds] = useState(59)

    const handleKeyDown = (e: any, index: any) => {
        if (e.key == 'Backspace' && index > 0 && e.currentTarget.value == '') {
            inputRef.current[index - 1]?.focus();
        }
        else if (e.key == 'Enter' && isEnable) {
            verifyOtp()
        }
    }

    useEffect(() => {
        const setTimeInterval = setInterval(() => {
            setFieldSeconds((prev) => {
                if (prev < 1) {
                    clearInterval(setTimeInterval)
                    return 0
                }
                else {
                    return prev - 1
                }
            })
        }, 1000)

        return () => clearInterval(setTimeInterval)
    }, [fieldSeconds, email])

    const verifyOtp = async () => {
        try {
            const otpValue = otpField.reduce((res, item) => res + item.value, '') || 0;
            let data =
            {
                email: email,
                otp: Number(otpValue)
            }
            AuthService.requestOtpVerify(data).then((res: any) => {
                if (res) {
                    if (res.success) {
                        setVisible(false)
                        setEnableUpdatePassword?.(true)
                        CommonToast.show({ type: 'success', message: res?.message })
                    }
                    else {
                        CommonToast.show({ type: 'warn', message: res?.message })
                    }
                }
            }).catch((error) => {
                console.log("error in requestOtpVerify-->", error);
            })
        }
        catch (error) {
            console.log("inside verifyOtp-->", error);
        }
    }

    return (
        <div className='w-full bg-white h-screen justify-center flex items-center flex-col'>

            <div className='w-full px-5 py-5 justify-center flex'>
                <p className='text-primary font-bold text-[20px]'>Enter OTP sent to <span className='text-black/50 font-meduim'>{email}</span></p>
            </div>

            <div className='flex items-center w-[80%]  justify-center'>
                {
                    otpField.map((item, index) =>
                    (
                        <div key={index} className='max-sm:w-[13%] w-[8%] mx-3'>
                            <input
                                ref={(el) => {
                                    inputRef.current[index] = el; // ✅ Correct way to set ref
                                }}
                                inputMode='numeric'
                                type='number'
                                // className='no-spinner custom-input text-center py-2 leading-tight px-4'
                                className='no-spinner custom-input'
                                onKeyDown={(e) => { handleKeyDown(e, index) }}
                                value={item.value}
                                onChange={(e) => {
                                    setOtpField((prev) => {
                                        return prev.map((values) => {
                                            if (values.id === item.id) {
                                                const newValue = e.target.value.length > 1
                                                    ? e.target.value.split('')[e.target.value.length - 1] // only allow first character
                                                    : e.target.value.trim();
                                                return {
                                                    ...values,
                                                    value: newValue,
                                                };
                                            }
                                            return values;
                                        });
                                    });

                                    if (e.target.value != '' && index < 3) {
                                        console.log("inside of the onchangetext", e.target.value);
                                        inputRef.current[index + 1]?.focus()
                                    }

                                    if (e.target.value.trim() == '') {
                                        console.log("inside of the no value", e.target.value);
                                        if (index > 0) {
                                            inputRef.current[index - 1]?.focus();
                                        }
                                    }
                                    else {
                                        console.log("what happeninh ", e.target.value);
                                    }
                                }
                                }
                                maxLength={1}
                            />
                        </div>
                    ))

                }
            </div>

            <button className='w-full px-5 py-5 flex justify-center' onClick={() => {
                if (!fieldSeconds) {
                    onResend()
                    setFieldSeconds(50)
                }
            }
            }>
                <p className='text-black/50 font-meduim'>Didn't receive Otp ? </p>
                {fieldSeconds ? <p className='font-bold text-primary px-3'>{`00:${fieldSeconds}s`}</p> : <p className='font-bold text-primary px-3'>Resend OTP</p>}
            </button>

            <div className='flex items-center w-full justify-center mt-5'>
                <button
                    type='button'
                    onClick={verifyOtp}
                    disabled={!isEnable}
                    className={`${isEnable ? 'bg-primary' : 'bg-gray-200 border-black'} group  border   rounded-xl  h-10.5 hover:bg-primary transform duration-100 hover:border-primary px-5`} >
                    <p className={`${isEnable ? 'text-white' : 'text-black/50'}  capitalize font-medium group-hover:text-white group-hover:font-medium `}>Verify OTP</p>
                </button>
            </div>

        </div>
    )
}
