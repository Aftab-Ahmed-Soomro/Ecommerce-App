import summaryApi from "../common";
import {toast} from 'react-toastify'

import axiosInstance from "../api/axios";

const addToCart = async(e,id) => {
    e?.stopPropagation(); 
    e?.preventDefault();

    const response = await axiosInstance({
        url: summaryApi.addToCartProduct.url,
        method: summaryApi.addToCartProduct.method,
        data: {
            productId: id
        }
    });

    const responseData = response.data

    if(responseData.success) {
        toast.success(responseData.message);
    }

    if(responseData.error) {
        toast.error(responseData.message)
    }

    return responseData;
}

export default addToCart;