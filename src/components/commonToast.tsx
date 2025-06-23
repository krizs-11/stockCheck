import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faClose, faCircleExclamation, faTriangleExclamation, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

export type ToastType = "success" | "error" | "info" | "warn";

export interface ToastOptions {
    type?: ToastType;
    message: string;
}

export interface CommonToastRef {
    show: (options: ToastOptions) => void;
}

const CommonToast = forwardRef<CommonToastRef>((_, ref) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>("success");
    const [progress, setProgress] = useState(100);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
        show({ message, type = 'success' }: ToastOptions) {
            setMessage(message);
            setType(type);
            setProgress(100);
            setVisible(true);
        },
    }));

    useEffect(() => {
        if (visible) {
            // Countdown progress line
            progressRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev <= 0) {
                        clearInterval(progressRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 30); // 100 * 30ms = 3 seconds

            // Hide toast after 3 seconds
            timerRef.current = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 3000);

            return () => {
                clearTimeout(timerRef.current!);
                clearInterval(progressRef.current!);
            };
        }
    }, [visible]);

    const IconKeys: Record<string, IconProp> = {
        success: faCheckCircle,
        info: faInfo,
        error: faCircleExclamation,
        warn: faTriangleExclamation
    };


    const Color: Record<string, string> = {
        success: "text-green-700",
        info: "text-blue-700",
        error: "text-red-700",
        warn: "text-yellow-700"
    };


    return (
        <div
            className={`transition-opacity duration-500 ${visible ? "opacity-100" : " opacity-0 pointer-events-none"
                } fixed inset-x-0 z-[99] flex justify-center w-screen py-2  items-end `}>
            <div
                className={`relative px-2 py-2 rounded-xl flex flex-col items-start gap-2 min-w-[300px] max-w-[400px] 
                    bg-white`}
            >
                <div className="flex w-full items-center">
                    <div className="p-0">
                        <FontAwesomeIcon icon={IconKeys[type]} className={` ${Color[type]} text-[13px]`} />
                    </div>
                    <div className="flex justify-between px-2 w-full items-center">
                        <p className={`${Color[type]} font-medium text-sm capitalize`}>{message}</p>
                        <FontAwesomeIcon
                            icon={faClose}
                            color={Color[type]}
                            className="cursor-pointer text-black text-[13px] "
                            onClick={() => setVisible(false)}
                        />
                    </div>
                </div>

                <div className="w-full h-1 bg-white/30 rounded">
                    <div
                        className="h-full bg-black/30 rounded"
                        style={{ width: `${progress}%`, transition: "width 30ms linear" }}
                    />
                </div>
            </div>
        </div >
    );
});

export default CommonToast;
