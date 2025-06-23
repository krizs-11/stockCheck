import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType, } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faBars, faCoins, faHome, faReceipt, faRightFromBracket, faUserGear } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import storage from '../utils/storage'
import { AppContext } from '../context'

interface SideBarProp {
    setIsExtend: Dispatch<SetStateAction<boolean>>,
    extendTab: boolean
}
// 'bg-primary'}`}>

function SideBar({ setIsExtend, extendTab }: SideBarProp) {


    const navigation = useNavigate()

    const navigationType = useNavigationType();

    const location = useLocation()

    const { setIsLoggedIn } = useContext(AppContext)

    const [screen, setScreen] = useState([

        {
            id: 1,
            name: 'Dashboard',
            iconName: 'faBars',
            subScreen: [],
            isSelected: false,

        },
        {
            id: 1,
            name: 'Product',
            iconName: 'faBagShopping',
            subScreen: [],
            isSelected: false
        },
        {
            id: 1,
            name: 'Staff',
            iconName: 'faUser',
            subScreen: [],
            isSelected: false
        },
        {
            id: 1,
            name: 'Sale',
            iconName: 'faCoins',
            subScreen: []
        },
        {
            id: 1,
            name: 'Settings',
            iconName: 'faUserGear',
            subScreen: [
                {
                    id: 1,
                    name: 'my Account'
                },
                {
                    id: 2,
                    name: 'Forgot Password'
                }
            ],
            isSelected: false
        }
    ])


    useEffect(() => {
        // setIsExtend(!extendTab)
    }, [extendTab])



    useEffect(() => {

        console.log("inside of the location", location.pathname, navigationType);
        const currentPath = location.pathname.split('/')[1].toLowerCase();

        if (currentPath && currentPath != 'signIn') {
            setScreen((prev) => {
                return prev.map((item) => ({
                    ...item,
                    isSelected: item.name.toLowerCase() === currentPath
                }))
            })
        }
        else {
            navigation('/Dashboard')
        }


    }, [location])


    // const [extendTab, setExtendTab] = useState(false)

    const ChooseIcon = (props: { value: string, className?: string }) => {

        if (props.value == 'faBars') {

            return <FontAwesomeIcon icon={faBars} className={'group-hover:text-primary'} />
        }
        else if (props.value == 'faBagShopping') {
            return <FontAwesomeIcon icon={faBagShopping} className={'group-hover:text-primary'} />

        }
        else if (props.value == 'faUser') {
            return <FontAwesomeIcon icon={faUser} className={'group-hover:text-primary'} />

        }
        else if (props.value == 'faUserGear') {
            return <FontAwesomeIcon icon={faUserGear} className={'group-hover:text-primary'} />

        }
        else if (props.value == 'faHome') {
            return <FontAwesomeIcon icon={faHome} className={'group-hover:text-primary'} />

        }
        else if (props.value == 'faCoins') {
            return <FontAwesomeIcon icon={faCoins} className={'group-hover:text-primary'} />
        }
    }

    return (
        <div className={`bg-primary h-screen overflow-hidden w-full flex flex-col relative `}>

            <div className=' justify-center flex items-center self-center py-3 w-full'>
                <FontAwesomeIcon icon={faReceipt} />
            </div>

            <div
                className={`mt-5 w-full flex-1 transition-all ease-in-out duration-500 ${extendTab ? 'ml-2' : 'ml-0'}`}
            >
                {
                    screen.map((value, index) =>
                    (
                        <Link key={index} to={`/${value.name.toLowerCase()}`}>
                            <div
                                onClick={() => {
                                    setScreen((prev) => {
                                        let updateSelected = prev.map((isvalue) => {
                                            if (isvalue.name == value.name) {
                                                isvalue.isSelected = true
                                            }
                                            else {
                                                isvalue.isSelected = false
                                            }
                                            return { ...isvalue }
                                        })
                                        return updateSelected
                                    })

                                }
                                } className={`
                                group flex h-[40px]
                                 items-center justify-between px-4
                                  hover:bg-white duration-150  ${value.isSelected ?
                                        'bg-white duration-500 ' :
                                        'bg-primary'}`}>
                                <div className='flex items-center w-full bg-transparent'>
                                    <div className={`${value.isSelected ? 'text-primary' : 'text-white'}`}>
                                        <ChooseIcon value={value.iconName} />
                                    </div>
                                    {extendTab ? <p className={`text-[13px] font-medium capitalize cursor-pointer px-2 group-hover:text-primary ${value.isSelected ? 'text-primary' : 'text-white'}`}>{value.name}</p> : null}

                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>

            <div className=' flex flex-col w-full self-end items-center justify-center py-3'>


                {extendTab &&
                    <div className='px-5 py-10 cursor-pointer' onClick={() => {
                        storage.removeItem('storeToken')
                        storage.removeItem('storeId')
                        setIsLoggedIn(false)
                        navigation('/signIn', { replace: true }); // Replaces the current entry
                    }}>
                        <p className='text-white font-bold text-xl'>Logout</p>
                    </div>}

                <div className={`${extendTab ? 'rotate-180' : 'rotate-0'} transition-all ease-in-out duration-500 flex items-center`}
                    onClick={() => {
                        // storage.removeItem('storeToken')
                        // storage.removeItem('storeId')
                        // setIsLoggedIn(false)
                        setIsExtend(!extendTab)
                        // navigation('/signIn', { replace: true }); // Replaces the current entry
                    }
                    }>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </div>

            </div>
        </div >
    )
}


export default React.memo(SideBar)
