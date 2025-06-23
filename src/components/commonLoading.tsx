
interface loaderProps {
    size: 'small' | 'large'
}
export default function CommonLoader({ size }: loaderProps) {

    return (
        // <div className="flex items-center justify-center">
        //     <div className='w-7 h-7 rounded-full border-2 border-gray-600 animate-spin border-l-transparent'>
        //     </div>
        // </div>

        <div className="flex items-center justify-center bg-[rgba(255,255,255,0.2)] ">

            <div className={`${size == 'small' ? 'w-4 h-4' : 'w-6 h-6'} rounded-full border-3 border-amber-400 animate-spin border-l-transparent`}></div>

        </div>



    )
}
