import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import Home from "../pages/home";
// import SignIn from "../pages/signIn";
// import SignUp from "../pages/signUp";
// import OtpScreen from "../pages/forgetPassword";
import { lazy, Suspense, useEffect } from "react";
import CommonLazyLoader from "../components/commonLazyLoader";

const Home = lazy(() => import('../pages/home'))
const SignIn = lazy(() => import('../pages/signIn'))
const SignUp = lazy(() => import('../pages/signUp'))
// const OtpScreen = lazy(() => import('../pages/forgetPassword'))



export default function AuthStack() {
    const navigation = useNavigate()
    const location = useLocation()

    let pathval = ['signin', 'signup', 'home']

    useEffect(() => {
        if (!pathval.includes(location.pathname.split('/').join('').toLocaleLowerCase())) {
            navigation('/home', { replace: true })
        }
    }, [location.pathname])

    return (
        <Suspense fallback={<CommonLazyLoader />}>
            <Routes location={location}>
                <Route path='/signIn' element={<SignIn key={location.key} />} />
                <Route path="/signUp" element={<SignUp key={location.key} />} />
                <Route index path="/home" element={<Home key={location.key} />} />
                <Route index path="*" element={<Home key={location.key} />} />
            </Routes>
        </Suspense>
    )
}
