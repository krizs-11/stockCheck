import axiosInstance from "./interceptor"
import { Config } from "../environment";
// import axios from "axios";


class httpRoutingService {

    getMethod<T>(url: string, params?: any): Promise<T> {
        let finalURl = Config.URL + url
        console.log("-=-=-=- Get method -- >", finalURl);
        return axiosInstance?.get<T>(finalURl, { params }) as Promise<T>
    }

    putMethod<T>(url: string, data?: any): Promise<T> {
        if (data?.isToken) {
            return axiosInstance.put<T>(Config.URL + url, data, { headers: { passkey: JSON.stringify(data.value) } }) as Promise<T>
        }
        else {
            return axiosInstance.put<T>(Config.URL + url, data) as Promise<T>

        }
    }

    postMethod<T>(url: string, data?: any,): Promise<T> {
        console.log("-=-=-=- Post method -- >", Config.URL + url + JSON.stringify(data));
        return axiosInstance.post<T>(Config.URL + url, data) as Promise<T>
    }

    deleteMethod<T>(url: string, data?: any): Promise<T> {
        console.log("-=-=-=- delte method -- >", Config.URL + url);
        return axiosInstance.delete<T>(Config.URL + url, data) as Promise<T>
    }

    replaceUrl(url: string, replaceValues: any) {
        for (const key in replaceValues) {
            url = url.replace('{' + key + '}', replaceValues[key]);
        }
        return url;
    }
}

const HttpRoutingService = new httpRoutingService()
export default HttpRoutingService