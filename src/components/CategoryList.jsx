import React, { useEffect, useState } from 'react'
import summaryApi from '../common';
import { Link } from 'react-router-dom';

import axiosInstance from "../api/axios";

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading,setLoading] = useState(false);

    const categoryLoading = new Array(13).fill(null);

    const fetchCategoryProduct = async() => {
        setLoading(true);
        try {
            const response = await axiosInstance({
                url: summaryApi.categoryProduct.url,
                method: summaryApi.categoryProduct.method
            });
            const dataResponse = response.data;
            setLoading(false);
            setCategoryProduct(dataResponse.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    }

    useEffect(()=> {
        fetchCategoryProduct();
    },[])
  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center gap-6 justify-between overflow-x-scroll scrollBar-none py-2'>
        {
          loading ? (
              categoryLoading.map((el,index)=> {
                return (
                    <div key={"loading"+index} className='h-20 w-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-slate-200 animate-pulse'>
                    </div>
                )
              })
          ) :
          (
            categoryProduct.map((product,index)=> {
              return (
                <Link to={"/product-category?category="+product?.category} key={product?.category} className='cursor-pointer group flex flex-col items-center gap-2' style={{animationDelay: `${index * 0.1}s`}}>
                  <div className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden p-4 bg-white shadow-md group-hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-slate-100 group-hover:border-red-500'>
                    <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply group-hover:scale-110 transition-all duration-300' />
                  </div>
                  <p className='text-center text-sm md:text-base capitalize font-medium text-slate-700 group-hover:text-red-600 transition-colors'>{product?.category}</p>
                </Link>
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default CategoryList
