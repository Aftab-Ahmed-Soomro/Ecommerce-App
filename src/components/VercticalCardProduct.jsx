import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayPKRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Context from '../context';
import addToCart from '../helpers/addToCart';

const VerticalCardProduct = ({category, heading}) => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    const loadingList = new Array(13).fill(null);
    const scrollElement = useRef();

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async(e,id) => {
      await addToCart(e,id) 
      await fetchUserAddToCart()
    }

    const fetchData = async() => {
      setLoading(true);
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setLoading(false);

      setData(categoryProduct?.data)
    }

    useEffect(()=> {
      fetchData()
    },[])

    const scrollRight = () => {
      scrollElement.current.scrollLeft += 300
    }

    const scrollLeft = () => {
      scrollElement.current.scrollLeft -= 300
    }
  return (
    <div className='container mx-auto px-4 my-6 relative'>

        <h2 className='text-2xl font-bold pb-4 text-slate-800 border-b-2 border-red-600 inline-block mb-6'>{heading}</h2>

        <div ref={scrollElement} className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollBar-none transition-all py-4'>
          <button onClick={scrollLeft} className='bg-white shadow-lg rounded-full p-2 cursor-pointer absolute left-0 text-2xl z-10 hidden md:block hover:scale-110 transition-transform text-slate-700'>
              <FaAngleLeft />
          </button>
          <button onClick={scrollRight} className='bg-white shadow-lg rounded-full p-2 cursor-pointer absolute right-0 text-2xl z-10 hidden md:block hover:scale-110 transition-transform text-slate-700'>
              <FaAngleRight />
          </button>
          {
            loading ? (
              loadingList.map((product,index)=> {
                return (
                  <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col'>
                    <div className='bg-slate-200 h-52 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse rounded-t-2xl'>
                    </div>
                    <div className='p-4 grid gap-3'>
                        <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 rounded-full animate-pulse bg-slate-200 py-2'></h2>
                        <p className='capitalize text-slate-500 p-1 rounded-full animate-pulse bg-slate-200 py-2'></p>
                        <div className='flex gap-3'>
                          <p className='text-red-600 font-medium p-1 rounded-full animate-pulse bg-slate-200 w-full py-2'></p>
                          <p className='text-slate-500 line-through p-1 rounded-full animate-pulse bg-slate-200 w-full py-2'></p>
                        </div>
                        <button className='text-sm text-white px-3 rounded-full bg-slate-200 animate-pulse py-2'></button>
                    </div>
                  </div>
                )
              })
            ) : (
              data.map((product,index)=> {
                return (
                  <Link to={"/product/"+product?._id} key={index+"aftab"} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group'>
                    <div className='bg-slate-50 h-52 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center group-hover:bg-white transition-colors'>
                        <img src={product.productImage[0]} className='object-contain h-full hover:scale-110 transition-transform duration-300 mix-blend-multiply' />
                    </div>
                    <div className='p-4 grid gap-2'>
                        <h2 className='font-semibold text-base md:text-lg text-ellipsis line-clamp-1 text-slate-800'>{product?.productName}</h2>
                        <p className='capitalize text-slate-400 text-sm'>{product?.category}</p>
                        <div className='flex items-center gap-3'>
                          <p className='text-red-600 font-bold text-lg'>{displayPKRCurrency(product?.sellingPrice)}</p>
                          <p className='text-slate-400 line-through text-sm'>{displayPKRCurrency(product?.price)}</p>
                        </div>
                        <button onClick={(e)=>handleAddToCart(e,product?._id)} className='text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-3 py-2 rounded-full cursor-pointer font-medium shadow-sm hover:shadow-md transition-all active:scale-95'>Add To Cart</button>
                    </div>
                  </Link>
                )
              })
            )
          }
        </div>

    </div>
  )
}

export default VerticalCardProduct;
