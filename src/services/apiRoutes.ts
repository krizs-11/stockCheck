
export const API =
{
    signIn: '/auth/signIn',
    signUp: '/auth/signUp',
    getAllProductData: '/shop/newStock/{storeId}',
    getOneProductData: '/shop/newStock/{storeId}/{productId}',
    getAllStaffData: '/shop/staff/{storeId}',
    getOneStaffData: '/shop/staff/{storeId}/{staffId}',
    getOneStaffPresent: '/shop/staffPresent/{storeId}/{staffId}',
    getOneStaffAbsent: '/shop/staffAbsent/{storeId}/{staffId}',
    getAllSale: "/shop/sale/{storeId}",
    getOldPostSale: "/shop/sale/old/{storeId}",
    getOneSale: "/shop/sale/{storeId}/{saleId}",
    getAllProducts: "/shop/total/{storeId}",
    getAllStaff: "/shop/staffTotal/total/{storeId}",
    getOneUser: '/auth/user/{id}',
    updateUser: '/auth/updateUser/{userId}',
    verifyEmail: "/auth/forgetPassword",
    verifyOtp: "/auth/verifyOtp",
    updatePassword: '/auth/updatePassword',
    dashboardinfo: '/shop/dashboard/info/{storeId}',
    graph: '/shop/graph/{storeId}',
    history: '/shop/loginHistory/{storeId}',
    logOut: '/auth/logout/{storeId}'
}