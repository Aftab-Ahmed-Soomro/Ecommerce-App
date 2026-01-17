import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayPKRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';
import addToCart from '../helpers/addToCart';

const CategoryWiseProductDisplay = ({category, heading}) => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const loadingList = new Array(13).fill(null);

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async(e,id) => {
      await addToCart(e,id) 
      await fetchUserAddToCart()
    }

    const fetchData = async() => {
      try {
        setLoading(true);
        setError(null);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setLoading(false);

        if (categoryProduct?.success) {
          setData(categoryProduct?.data || []);
        } else {
          setError(categoryProduct?.message || "Failed to fetch products");
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
        setError("Failed to load products");
        setData([]);
        setLoading(false);
      }
    }

    useEffect(()=> {
      fetchData()
    },[])

    // Ensure data is always an array
    const safeData = Array.isArray(data) ? data : [];

  return (
    <div className='container mx-auto px-4 my-6 relative'>

      <h2 className='text-2xl font-semibold pb-4'>{heading}</h2>

      {error && (
        <p className='text-red-600 text-center py-4'>{error}</p>
      )}

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          
          {loading ? (
            loadingList.map((_, index) => (
              <div key={index} className='w-full bg-white rounded-sm shadow'>
                <div className='bg-slate-200 h-48 animate-pulse'></div>
                <div className='p-4 grid gap-3'>
                    <h2 className='animate-pulse bg-slate-200 py-2'></h2>
                    <p className='animate-pulse bg-slate-200 py-2'></p>
                    <div className='flex gap-3'>
                      <p className='animate-pulse bg-slate-200 w-full py-2'></p>
                      <p className='animate-pulse bg-slate-200 w-full py-2'></p>
                    </div>
                    <button className='animate-pulse bg-slate-200 py-2'></button>
                </div>
              </div>
            ))
          ) : (
            safeData.map((product, index) => (
              <Link key={product?._id || index} to={"/product/" + product._id} onClick={scrollTop} className='w-full bg-white rounded-sm shadow'>
                <div className='bg-slate-200 h-48 flex justify-center items-center'>
                    <img src={product?.productImage?.[0]} className='object-scale-down h-full hover:scale-110 transition-all cursor-pointer mix-blend-multiply' />
                </div>
                <div className='p-4 grid gap-3'>
                    <h2 className='font-medium text-lg text-black'>{product?.productName}</h2>
                    <p className='capitalize text-slate-500'>{product?.category}</p>
                    <div className='flex gap-3'>
                      <p className='text-red-600 font-medium'>{displayPKRCurrency(product?.sellingPrice)}</p>
                      <p className='text-slate-500 line-through'>{displayPKRCurrency(product?.price)}</p>
                    </div>
                    <button onClick={(e) => handleAddToCart(e, product?._id)} className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full'>Add To Cart</button>
                </div>
              </Link>
            ))
          )}
        </div>
    </div>

  )
}

export default CategoryWiseProductDisplay;
