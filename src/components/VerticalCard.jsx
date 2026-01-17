import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop';
import displayPKRCurrency from '../helpers/displayCurrency';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';

const VerticalCard = ({loading,data = []}) => {
    const loadingList = new Array(13).fill(null);

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async(e,id) => {
      await addToCart(e,id) 
      await fetchUserAddToCart()
    }
  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center gap-4 md:gap-6 overflow-x-hidden p-4'>
          
          {
            loading ? (
              loadingList.map((product,index)=> {
                return (
                  <div key={index} className='w-full bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col'>
                    <div className='bg-slate-200 h-52 p-4 flex justify-center items-center animate-pulse rounded-t-2xl'>
                        
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
                  <Link to={"/product/" + product._id} onClick={scrollTop} key={product?._id} className='w-full bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group'>
                    <div className='bg-slate-50 h-52 p-4 flex justify-center items-center group-hover:bg-white transition-colors'>
                        <img src={product.productImage[0]} className='object-contain h-full hover:scale-110 transition-transform duration-300 mix-blend-multiply' />
                    </div>
                    <div className='p-4 grid gap-2'>
                        <h2 className='font-semibold text-base md:text-lg text-ellipsis line-clamp-1 text-slate-800'>{product?.productName}</h2>
                        <p className='capitalize text-slate-400 text-sm'>{product?.category}</p>
                        <div className='flex items-center gap-3'>
                          <p className='text-red-600 font-bold text-lg'>{displayPKRCurrency(product?.sellingPrice)}</p>
                          <p className='text-slate-400 line-through text-sm'>{displayPKRCurrency(product?.price)}</p>
                        </div>
                        <button onClick={(e)=>handleAddToCart(e,product?._id)} className='text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-3 py-2 rounded-full cursor-pointer font-medium shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap'>Add To Cart</button>
                    </div>
                  </Link>
                )
              })
            )
          }
    </div>
  )
}

export default VerticalCard
