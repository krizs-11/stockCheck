import HttpRoutingService from "../httpRoutingService";
import { API } from "../apiRoutes";
export type ApiResponse = {
    success: boolean;
    message: string;
    count: number;
    productDetails: ProductDetail[];
};
export type ProductDetail = {
    id: string;
    productCategory: string;
    productName: string;
    price: number;
    quantity: number;
    quantityType: string;
    stockHistoryExist: boolean;
    stockDate: string; // Can be `Date` if parsed
};

export type singleProductApi =
    {
        "message": "single product fetched succesfully",
        "success": true,
        "inventoryData": ProductDetail
    }


class productService {

    getAllProductData(storeId: string, data: any): Promise<ApiResponse> {
        const url = HttpRoutingService.replaceUrl(API.getAllProductData, { storeId: storeId });
        return HttpRoutingService.getMethod(url, data) as Promise<ApiResponse>;
    }


    getOneProductData(storeId: string, productId: string): Promise<singleProductApi> {
        const url = HttpRoutingService.replaceUrl(API.getOneProductData, { storeId: storeId, productId: productId })
        return HttpRoutingService.getMethod(url) as Promise<singleProductApi>
    }

    getOnePostProductData(storeId: string, data: any) {
        const url = HttpRoutingService.replaceUrl(API.getAllProductData, { storeId: storeId })
        return HttpRoutingService.postMethod(url, data)
    }


    getOneProductDeleteData(storeId: string, productId: string) {
        const url = HttpRoutingService.replaceUrl(API.getOneProductData, { storeId: storeId, productId: productId })
        return HttpRoutingService.deleteMethod(url)
    }


    getOneUpdateProductData(storeId: string, productId: string, data: any): any {
        const url = HttpRoutingService.replaceUrl(API.getOneProductData, { storeId: storeId, productId: productId })
        return HttpRoutingService.putMethod(url, data)
    }

    getAllTotalProducts(storeId: string): any {
        const url = HttpRoutingService.replaceUrl(API.getAllProducts, { storeId: storeId })
        return HttpRoutingService.getMethod(url)
    }

    getOrderInvoice() {
        return HttpRoutingService.postMethod('/shop/order/invoice', { id: "66823a5bc0b0bbcc32617b38" })
    }

    getDashboardInfo(storeId: string): any {
        const url = HttpRoutingService.replaceUrl(API.dashboardinfo, { storeId: storeId })
        return HttpRoutingService.getMethod(url)
    }

    getGraphDetails(storeId: string, data: any) {
        const url = HttpRoutingService.replaceUrl(API.graph, { storeId: storeId })
        return HttpRoutingService.getMethod(url, data)
    }

    getPieDetails(storeId: string) {
        const url = HttpRoutingService.replaceUrl(API.history, { storeId: storeId })
        return HttpRoutingService.getMethod(url)
    }





}

const ProductService = new productService
export default ProductService