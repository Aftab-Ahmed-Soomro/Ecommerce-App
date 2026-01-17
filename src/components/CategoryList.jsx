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
      <div className='flex items-center gap-4 justify-between overflow-scroll scrollBar-none'>
        {
          loading ? (
              categoryLoading.map((el,index)=> {
                return (
                    <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'>

                    </div>
                )
              })
          ) :
          (
            categoryProduct.map((product,index)=> {
              return (
                <Link to={"/product-category?category="+product?.category} key={product?.category} className='cursor-pointer'>
                  <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                    <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all' />
                  </div>
                  <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
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
