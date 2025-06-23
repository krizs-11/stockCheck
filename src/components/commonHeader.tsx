import { faBars, faBell, faCaretUp, faExclamationTriangle, faPlus, faRightFromBracket, faShoppingCart, faTimesRectangle, faUser, faUserCheck, faUserGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Dispatch, lazy, SetStateAction, useContext, useState } from 'react'
import { AppContext } from '../context'
import AuthService from '../services/components/authService'
import { requestForToken } from '../firebase-config'
import storage from '../utils/storage'
import { useNavigate } from 'react-router-dom'
import { CommonToast } from '../services/toastService'
// focus:shadow-[0_0_2px_2px_rgba(255,215,0,0.6)]
interface headerProps {
    name: string,
    setOpen?: Dispatch<SetStateAction<boolean>>,
    onClickButton: () => void,
    isAddEnable?: boolean
}


interface SearchEnabledProps extends headerProps {
    isSearch: true
    searchvalue: string,
    setSearchValue: Dispatch<SetStateAction<string>>
    onChangeText: (args: string) => void
}


interface SearchDisabledProps extends headerProps {
    isSearch?: false
    searchvalue?: string,
    setSearchValue?: Dispatch<SetStateAction<string>>
    onChangeText?: (args: string) => void
}

interface CustomFilterProps extends headerProps {
    isCustom: true
    CustomComponent: React.ComponentType
}

interface CustomDisableFilterProps extends headerProps {
    isCustom?: false
    CustomComponent?: undefined
}

type HeaderProps = (headerProps) & (SearchEnabledProps | SearchDisabledProps) & (CustomFilterProps | CustomDisableFilterProps)


const SearchBar = lazy(() => import('./commonSearchBar'))


export default function CommonHeader({ onClickButton, name, onChangeText, searchvalue, setSearchValue, setOpen, isSearch, isCustom, CustomComponent, isAddEnable }: HeaderProps) {
    const { setExtendTab, extendTab } = useContext(AppContext)
    const [isOpenSettings, setIsOpenSettings] = useState(false)


    const navigate = useNavigate()
    const { userDetails, storeId, setIsLoggedIn } = useContext(AppContext)
    const navigation = useNavigate()

    // const [fcmToken, setFcmToken] = useState('')


    const deviceToken = async () => {
        await requestForToken().then((res) => {
            if (res) {
                logOut(res)
            }
            console.log("res-->", res);
        }).catch((error) => {
            console.log("error in deviceToken-->", error);
        })
    }

    const logOut = async (fcmToken: string) => {
        try {
            AuthService.requestLogout(storeId, { token: fcmToken }).then((res) => {
                if (res) {
                    storage.removeItem('storeToken')
                    storage.removeItem('storeId')
                    setIsLoggedIn(false)
                    CommonToast.show({ type: 'success', message: 'User Logged out Sucessfully' })
                    window.location.replace('/signIn'); // 👈 Most reliable method
                    navigation('/signIn', { replace: true, }); // Replaces the current entry
                }
            }).catch((error) => {
                console.log("error in requestLogout-->", error)
            })
        }
        catch (error) {
            console.log("error in logOut-->", error);
        }
    }


    return (
        <div className="w-full max-sm:flex-col sm:flex bg-white sm:h-16 max-sm:h-24 py-3 sticky top-0 shadow-md z-50 grow transition-all ease-in-out duration-200">

            <div className="bg-white flex items-center px-5 sm:w-[20%] justify-between">
                <div className='flex justify-center items-center'>

                    <FontAwesomeIcon icon={faBars} className="text-black text-xl" onClick={() => {
                        setExtendTab(!extendTab)
                    }
                    } />
                    <p className="text-primary px-5 sm:text-xl max-sm:text-[12px] font-bold">{name ? `${name}List` : ''}</p>
                </div>
                <div className='px-5 max-sm:flex sm:hidden self-end'>
                    <button type='button'
                        onClick={() => {
                            console.log("inside---->");

                            setOpen?.(true);
                            onClickButton(); // ✅ Now it's triggered
                        }}
                        className='flex justify-between items-center border-2 border-gray-200 h-7 px-2 rounded-xl'>
                        <FontAwesomeIcon icon={faPlus} className='text-black' />
                        <p className='capitilaize text-gray-700 text-[8px] font-bold px-2'>{`Add ${name}`}</p>
                    </button>
                </div>
            </div>

            {isSearch && <div className="flex sm:w-[35%] max-sm:hidden items-center justify-center relative">
                <SearchBar
                    onChangeText={(value) => onChangeText(value.target.value)}
                    placeHolder="searchProducts"
                    setValue={setSearchValue}
                    value={searchvalue}
                />
            </div>}

            <div className="flex items-center justify-end px-5 sm:grow max-sm:hidden ">
                {
                    isCustom &&
                    <div className='cursor-pointer'>
                        <CustomComponent />
                    </div>
                }
                {!isAddEnable && <div className='px-5'>
                    <button type='button'
                        onClick={() => {
                            setOpen?.(true)
                            onClickButton()
                        }}
                        className='flex justify-between items-center border-2 border-gray-200 h-10 px-2 rounded-xl'>
                        <FontAwesomeIcon icon={faShoppingCart} className='text-black' />
                        <p className='capitilaize text-primary text-[12px] font-bold px-2'>{`Add ${name}`}</p>
                    </button>
                </div>}

                <button
                    onMouseEnter={() => {
                        setIsOpenSettings(true)
                    }
                    }
                    onClick={() => {
                        setIsOpenSettings(!isOpenSettings)
                    }
                    } className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUser} className='text-white' />
                </button>

            </div>

            <div className='max-sm:flex sm:hidden py-3 px-1'>
                {isSearch && <div className="flex items-center justify-center relative">
                    <SearchBar
                        onChangeText={(value) => onChangeText(value.target.value)}
                        placeHolder="searchProducts"
                        setValue={setSearchValue}
                        value={searchvalue}
                    />
                </div>}

                {
                    isCustom &&
                    <div className='cursor-pointer'>
                        <CustomComponent />
                    </div>
                }

                <div className="flex items-center justify-end px-5 grow">
                    <FontAwesomeIcon icon={faBell} className="text-gray-700 px-5" />
                    <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className='text-white' />
                    </div>
                </div>

            </div>

            <div className={`transition-all duration-300 ease-in  bg-white absolute  left-0 flex flex-col right-0 top-0 justify-self-end  w-[130px]  items-center mt-19 ${isOpenSettings ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className='flex items-center absolute -top-6 left-0 right-0 ml-[55%]'>
                    <FontAwesomeIcon icon={faCaretUp} className='text-white text-5xl flex justify-self-center' />
                </div>
                <div className='px-3 py-4'>
                    <button className='flex  items-center' onClick={() => {
                        navigate(`/updateUser/${userDetails?.id}`)
                    }
                    }>
                        <FontAwesomeIcon icon={faUserGear} className='text-gray-600' />
                        <p className='px-2 text-primary font-bold text-[14px]'>MyAccount</p>
                    </button>
                    <button className='flex  items-center' onClick={deviceToken}>
                        <FontAwesomeIcon icon={faRightFromBracket} className='text-gray-600' />
                        <p className='px-2 text-primary font-bold text-[14px]'>Logout</p>
                    </button>
                </div>
            </div>

        </div>
    )
}
