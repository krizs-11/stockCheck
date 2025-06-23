import { API } from "../apiRoutes";
import HttpRoutingService from "../httpRoutingService";

class staffService {

    getAllStaffData(storeId: string, data: any): any {
        const url = HttpRoutingService.replaceUrl(API.getAllStaffData, { storeId: storeId })
        return HttpRoutingService.getMethod(url, data,)
    }

    getOneStaffData(storeId: string, staffId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getOneStaffData, { storeId: storeId, staffId: staffId })
        return HttpRoutingService.getMethod(url)
    }

    getPostStaffData(storeId: string, data: any): any {
        const url = HttpRoutingService.replaceUrl(API.getAllStaffData, { storeId: storeId })
        return HttpRoutingService.postMethod(url, data)
    }

    getOneUpdateStaff(storeId: string, staffId: string, data: any): any {
        const url = HttpRoutingService.replaceUrl(API.getOneStaffData, { storeId: storeId, staffId: staffId })
        return HttpRoutingService.putMethod(url, data)
    }

    getOneDeleteStaffData(storeId: string, staffId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getOneStaffData, { storeId: storeId, staffId: staffId })
        return HttpRoutingService.deleteMethod(url)
    }


    getOneStaffPresent(storeId: string, staffId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getOneStaffPresent, { storeId: storeId, staffId: staffId })
        return HttpRoutingService.putMethod(url)
    }

    getOneStaffAbsent(storeId: string, staffId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getOneStaffAbsent, { storeId: storeId, staffId: staffId })
        return HttpRoutingService.putMethod(url)
    }

    getAllStaff(storeId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getAllStaff, { storeId: storeId })
        return HttpRoutingService.getMethod(url)
    }




}

const StaffService = new staffService
export default StaffService