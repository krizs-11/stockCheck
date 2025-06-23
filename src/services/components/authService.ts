import HttpRoutingService from "../httpRoutingService";
import { API } from "../apiRoutes";
// import { log } from "console";

class authService {
    postNewUserData(data: any) {
        return HttpRoutingService?.postMethod(API.signUp, data)
    }

    postUser(data: any) {
        return HttpRoutingService.postMethod(API.signIn, data)
    }

    updateUserData(data: any, userId: any) {
        let Url = HttpRoutingService.replaceUrl(API.updateUser, { userId: userId })
        return HttpRoutingService?.putMethod(Url, data)
    }

    GetOneUser(id: any) {
        console.log("inside gteoneuser-->", id);

        const Url = HttpRoutingService.replaceUrl(API.getOneUser, { id: id })
        return HttpRoutingService.getMethod(Url)
    }

    requestPasswordVerify(data: any) {
        return HttpRoutingService?.postMethod(API.verifyEmail, data)
    }

    requestOtpVerify(data: any) {
        return HttpRoutingService?.postMethod(API.verifyOtp, data)
    }

    requestUpdatePasword(data: any) {
        return HttpRoutingService?.putMethod(API.updatePassword, data)
    }

    requestLogout(storeId: string, data: any) {
        const Url = HttpRoutingService.replaceUrl(API.logOut, { storeId: storeId })
        return HttpRoutingService.putMethod(Url, data)
    }


}

const AuthService = new authService
export default AuthService