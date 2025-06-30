import { faCheck, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context'
import AuthService from '../services/components/authService'
import { requestForToken } from '../firebase-config'
import storage from '../utils/storage'
// import back1 from '../assets/log2.png'
// import { Messaging } from 'firebase/messaging';

export default function Settings() {
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
        <div className='w-full flex h-screen '>
            <div className='sm:w-[50%] py-5 w-full'>
                <div className='flex px-5 py-2 text-xl text-gray-400 justify-center' >
                    <p className='text-2xl font-medium backdrop-blur-2xl  text-primary drop-shadow-2xl capitalize'>Hi , {userDetails?.name}</p>
                </div>
                <div className='flex px-5 py-2 text-xl text-gray-800' onClick={() => {
                    navigate(`/updateUser/${userDetails?.id}`)
                }
                }>
                    <FontAwesomeIcon icon={faUser} className='text-2xl text-primary px-5' />
                    <p>My Account</p>
                </div>
                <div className='flex px-5 py-2 text-xl text-gray-800' onClick={deviceToken}>
                    <FontAwesomeIcon icon={faRightFromBracket} className='text-2xl text-primary px-5' />
                    <p>Logout</p>
                </div>
                <div className='flex px-5 py-2 text-[20px] text-gray-600 h-[75%] items-end justify-center font-light' onClick={deviceToken}>

                    <p>Version :0:0.1</p>
                </div>


            </div>
            <div className='w-[50%] bg-primary rounded-tl-full hidden justify-center items-center flex-col sm:flex'>
                <FontAwesomeIcon icon={faCheck} className='text-white text-9xl' />
                <p className='text-2xl font-medium backdrop-blur-2xl drop-shadow-2xl'>StockCheck</p>
                <p className='text-2xl font-medium backdrop-blur-2xl  text-gray-100 drop-shadow-2xl capitalize'>Everything can be Made in one place</p>

            </div>
        </div>
    )
}
