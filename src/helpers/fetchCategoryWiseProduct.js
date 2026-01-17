import summaryApi from "../common";

import axiosInstance from "../api/axios";

const fetchCategoryWiseProduct = async(category) => {
    try {
        const response = await axiosInstance({
            url: summaryApi.categoryWiseProduct.url,
            method: summaryApi.categoryWiseProduct.method,
            data: {
                category: category
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching category products:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch products",
            data: [],
            error: true
        };
    }
}

export default fetchCategoryWiseProduct;