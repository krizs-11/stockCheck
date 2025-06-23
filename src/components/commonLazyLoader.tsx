import Lottie from 'lottie-react'
import loader from '../../lazyloader.json'

export default function CommonLazyLoader() {
    return (
        <div className='grid place-items-center w-full h-screen overflow-hidden bg-white'>
            <Lottie animationData={loader} />
        </div>
    )
}
