import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './App.css'
import './components/commonStyle/commonStyle.css'
import { AppContext } from './context'
import storage from './utils/storage'
import AuthService from './services/components/authService'
import { useNavigate } from 'react-router-dom'
import { setToastRef } from "../src/services/toastService";
import { CommonToastRef } from './components/commonToast'
import { messaging } from './firebase-config'
import { onMessage } from 'firebase/messaging'
import Lottie from "lottie-react";
import loader from '../lazyloader.json'
import useNetworkStatus from './customHooks/useNetworkStatus'
import noNetwork from '../nointernet.json'

const AuthStack = lazy(() => import('./stack/authStack'))
const DrawerStack = lazy(() => import('./stack/drawerStack'))
const CommonToast = lazy(() => import('./components/commonToast'))


// type User = {
//   _id: string;
//   email: string;
//   name: string;
//   password: string;
//   phoneNumber: number;
//   storeName: string;
//   productCategory: string[];
//   staffCategory: string[];
//   __v: number;
// };

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [storeId, setIsStoreId] = useState('')
  const [userDetails, setUserDetails] = useState<any>(null)
  const ID = storage.getItem('storeId')
  const [isLoading, setIsLoading] = useState(false)
  const [extendTab, setIsExtendTab] = useState(false)
  const navigation = useNavigate()
  const toastRef = useRef<CommonToastRef>(null);
  const isOnline = useNetworkStatus()

  useEffect(() => {
    if (ID) {
      setIsLoading(true)
      getOneUser()
    }
    else {
      navigation('/home')
      // navigation('/signIn')
    }
  }, [isOnline])



  useEffect(() => {
    setToastRef(toastRef.current);
  }, []);

  const getOneUser = async () => {
    try {
      AuthService.GetOneUser(ID).then((res: any) => {
        if (res) {
          console.log("JsonStrinbgy-->", JSON.stringify(res, null, 6));
          setUserDetails(res?.userData)
          setIsLoggedIn(true)
          setIsStoreId(ID)
          if (location.pathname == '/') {
            navigation('/dashboard')
          }
        }
      })
        .catch((error) => {
          console.log("error in GetOneUser-->", error);
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
    catch (error) {
      console.log("error in", error);
    }

  }

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("apyload", payload);
      })

    }

  }, [])


  console.log(isLoading);

  return (
    <Suspense fallback={
      <div className='flex justify-center items-center w-full h-screen overflow-hidden bg-white'>
        <Lottie animationData={loader} loop={true} />
      </div>
    }>
      {
        isOnline ?
          <div className='flex overflow-hidden scrollbar-hidden'>
            <AppContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, setIsStoreId: setIsStoreId, storeId: storeId, userDetails: userDetails, setUserDetails: setUserDetails, extendTab: extendTab, setExtendTab: setIsExtendTab }}>
              {
                isLoggedIn ?
                  <DrawerStack /> :
                  <AuthStack />
              }
              <CommonToast ref={setToastRef} />
            </AppContext.Provider>
          </div>
          :
          <div className='flex  flex-col justify-center items-center bg-gray-100 h-screen'
          >
            <Lottie animationData={noNetwork} loop className='w-[50%] h-[50%]' />
            <p className='text-xl text-amber-400 font-bold py-2 capitalize'>Please check your internet connection</p>
          </div>
      }
    </Suspense>

  )
}

export default App
