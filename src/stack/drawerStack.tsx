import { lazy, Suspense, useContext, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
// import SideBar from '../components/sidebar'
import Home from '../pages/home';
// import Product from '../pages/product';
// import DashBoard from '../pages/dashBoard';
// import Sale from '../pages/sale';
// import Settings from '../pages/settings';
// import Staff from '../pages/staff';
import '../index.css'
import CommonLazyLoader from '../components/commonLazyLoader';
import { AppContext } from '../context';
// import SignUp from '../pages/signUp';
// import CommonLoader from '../components/commonLoading';

const SideBar = lazy(() => import('../components/sidebar'))
const Product = lazy(() => import('../pages/product'))
const DashBoard = lazy(() => import('../pages/dashBoard'))
const Staff = lazy(() => import('../pages/staff'))
const Sale = lazy(() => import('../pages/sale'))
const Settings = lazy(() => import('../pages/settings'))
const SignUp = lazy(() => import('../pages/signUp'))
// const CommonLoader = lazy(() => import('../components/commonLoading'))


export default function DrawerStack() {
    console.log("inside of the drawerstack");
    const navigation = useNavigate()

    const location = useLocation()

    // const [isExtend, setIsExtend] = useState(false)

    const { setExtendTab, extendTab } = useContext(AppContext)


    useEffect(() => {

        console.log(location.pathname);
        if (location.pathname == '/signIn') {
            navigation('/dashboard', { replace: true })
        }
    }, [location])


    return (
        <Suspense fallback={<CommonLazyLoader />}>
            <div className='flex h-screen w-screen'>
                <div
                    className={`flex transition-all duration-500 ease-in-out 
    ${extendTab ? 'w-[15%] min-w-[100px]' : 'w-[50px] min-w-[50px]'}`}
                >
                    <SideBar extendTab={extendTab} setIsExtend={setExtendTab} />
                </div>
                <div className='bg-gray-200 w-full overflow-y-auto scrollbar-hidden'>
                    <Routes location={location}>
                        <Route element={<Home key={location.key} />} path='/home' />
                        <Route element={<Product key={location.key} />} path='/product' />
                        <Route element={<DashBoard key={location.key} />} path='/dashboard' />
                        <Route element={<Sale key={location.key} />} path='/sale' />
                        <Route element={<Settings key={location.key} />} path='/settings' />
                        <Route element={<Staff key={location.key} />} path='/staff' />
                        <Route element={<SignUp key={location.key} />} path='/updateUser/:id' />
                        <Route path="*" element={<Staff />} /> {/* Fallback route */}
                    </Routes>
                </div>
            </div>
        </Suspense>

    )
}
