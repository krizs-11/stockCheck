// toastService.ts
import { CommonToastRef, ToastOptions } from "../components/commonToast";

let toastRef: CommonToastRef | null = null;

export const setToastRef = (ref: CommonToastRef | null) => {
    toastRef = ref;
};

export const CommonToast = {
    show: (options: ToastOptions) => {
        if (toastRef) {
            toastRef.show(options);
        } else {
            console.warn("CommonToast not initialized");
        }
    },
};
