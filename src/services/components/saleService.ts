import { API } from "../apiRoutes";
import HttpRoutingService from "../httpRoutingService";

class saleService {

    getAllSales(storeId: string, data: any): any {
        const url = HttpRoutingService.replaceUrl(API.getAllSale, { storeId: storeId })
        return HttpRoutingService.getMethod(url, data,)
    }

    getPostSalesLogs(storeId: string, data: any): any {
        const url = HttpRoutingService.replaceUrl(API.getAllSale, { storeId: storeId })
        return HttpRoutingService.postMethod(url, data)
    }

    getOneUpdateSaleLogs(storeId: string, saleId: string, data: any) {
        const url = HttpRoutingService.replaceUrl(API.getOneSale, { storeId: storeId, saleId: saleId })
        return HttpRoutingService.putMethod(url, data)
    }

    getPostMissedSaleLogs(storeId: string, data: any) {
        const url = HttpRoutingService.replaceUrl(API.getOldPostSale, { storeId: storeId })
        return HttpRoutingService.postMethod(url, data)
    }

    getOneDeleteSaleLogs(storeId: string, saleId: string) {
        const url = HttpRoutingService.replaceUrl(API.getOneSale, { storeId: storeId, saleId: saleId })
        return HttpRoutingService.deleteMethod(url)
    }

    getOneSaleLogs(storeId: string, saleId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getOneSale, { storeId: storeId, saleId: saleId })
        return HttpRoutingService.getMethod(url)
    }



}
const SaleService = new saleService
export default SaleService
