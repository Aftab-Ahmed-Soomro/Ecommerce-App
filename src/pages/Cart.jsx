import React, { useContext, useEffect, useState } from 'react'
import summaryApi from '../common'
import Context from '../context'
import displayPKRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";

import axiosInstance from "../api/axios";

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(context.cartProductCount).fill(null)

    const fetchData = async() => {
        try {
             const response = await axiosInstance({
                url: summaryApi.addToCartProductView.url,
                method: summaryApi.addToCartProductView.method
            })

            const responseData = response.data;

            if(responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    // ... (keep handleLoading) ...

    const increaseQty = async(id,qty) => {
        // Optimistically update UI
        setData(prevData => prevData.map(item => 
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));

        try {
            const response = await axiosInstance({
                url: summaryApi.updateCartProduct.url,
                method: summaryApi.updateCartProduct.method,
                data: {
                    _id : id,
                    quantity : qty + 1 
                }
            })

            const responseData = response.data;

            if(!responseData.success) {
                fetchData() // Fallback
            }
        } catch (error) {
             console.error("Error increasing cart qty:", error);
             fetchData();
        }
    }

    const decreaseQty = async(id,qty) => {
        if (qty >= 2) {
            // Optimistically update UI
            setData(prevData => prevData.map(item => 
                item._id === id ? { ...item, quantity: item.quantity - 1 } : item
            ));

            try {
                 const response = await axiosInstance({
                    url: summaryApi.updateCartProduct.url,
                    method: summaryApi.updateCartProduct.method,
                    data: {
                        _id : id, 
                        quantity : qty - 1 
                    }
                })
        
                const responseData = response.data;
        
                if(!responseData.success) {
                    fetchData()
                    context.fetchUserAddToCart() 
                }
            } catch (error) {
                console.error("Error decreasing cart qty:", error);
                fetchData();
                context.fetchUserAddToCart();
            }
        }
    }

    const deleteCartProduct = async(id) =>{
        try {
            const response = await axiosInstance({
                url: summaryApi.deleteCartProduct.url,
                method: summaryApi.deleteCartProduct.method,
                data: {
                    _id : id,
                }
            })

            const responseData = response.data;

            if(responseData.success) {
                fetchData()
                context.fetchUserAddToCart()
            }
        } catch (error) {
            console.error("Error deleting cart product:", error);
        }
    }

    const totalQty = data.reduce((prevValue,currValue)=> prevValue + currValue.quantity, 0)
    const totalPrice = data.reduce((prevValue,currValue)=> prevValue + (currValue.quantity * currValue?.productId?.sellingPrice),0)
  return (
    <div className='container mx-auto p-4'>  
      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between '>
        {/* view product */}
        <div className='w-full max-w-3xl'>
            <h2 className='text-2xl font-bold mb-4 text-slate-800 border-b-2 border-red-600 inline-block pb-1'>Your Cart</h2>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5'>No Product Found</p>
                    )
                }
            </div>
            {
                loading ? (
                    loadingCart.map((el,index)=> {
                        return (
                            <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded-xl'>
                            </div>
                        )
                    })
                ) : (
                    data.map((product) => {
                        return (
                            <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-32 my-4 border border-slate-100 rounded-xl shadow-sm flex relative hover:shadow-md transition-shadow'>
                                <div className='w-32 h-full bg-slate-50 rounded-l-xl p-2 flex justify-center items-center'>
                                    <img src={product?.productId.productImage[0]} className='w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform' />
                                </div>
                                <div className='px-4 py-2 w-full relative'>
                                        {/* Delete Product */}
                                    <div className='flex justify-between items-start'>
                                        <h2 className='text-lg lg:text-xl font-semibold text-slate-800'>
                                            {product?.productId?.productName?.length > 45  
                                            ? product?.productId?.productName?.slice(0, 45) + "..."  
                                            : product?.productId?.productName}
                                        </h2>
                                        <div onClick={()=>deleteCartProduct(product?._id)} className='text-red-500 rounded-full p-2 hover:bg-red-50 hover:text-red-700 cursor-pointer absolute right-2 top-2 text-xl transition-colors'>
                                            <MdDelete />
                                        </div>
                                    </div>
                                    <p className='capitalize text-slate-400 font-medium text-sm'>{product?.productId?.category}</p>
                                    <div className='flex items-center justify-between mt-2'>
                                        <p className='text-red-600 font-bold text-lg'>{displayPKRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className='text-slate-800 font-bold text-lg'>{displayPKRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                    <div className='flex items-center gap-3 mt-2'>
                                        <button onClick={()=>decreaseQty(product?._id,product?.quantity)} className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-7 h-7 flex justify-center items-center rounded-full cursor-pointer transition-colors font-bold'>-</button>
                                        <span className='font-medium text-slate-700'>{product?.quantity}</span>
                                        <button onClick={()=>increaseQty(product?._id,product?.quantity)} className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-7 h-7 flex justify-center items-center rounded-full cursor-pointer transition-colors font-bold'>+</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>

        {/* Total Amount */}
        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
            {
                loading ? (
                    <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse rounded-xl'>
                        
                    </div>
                ) : (
                    <div className='bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden sticky top-20'>
                        <h2 className='text-white bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-semibold text-lg'>Order Summary</h2>
                        <div className='p-6 flex flex-col gap-4'>
                            <div className='flex items-center justify-between font-medium text-lg text-slate-600'>
                                <p>Quantity</p>
                                <p className='text-slate-800 font-bold'>{totalQty}</p>
                            </div>

                            <div className='flex items-center justify-between font-medium text-lg text-slate-600 border-t border-slate-100 pt-4'>
                                <p>Total Price</p>
                                <p className='text-slate-800 font-bold text-xl'>{displayPKRCurrency(totalPrice)}</p>
                            </div>

                            <button className='w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-full hover:from-blue-700 hover:to-blue-600 transition-all shadow-md active:scale-95'>Proceed to Checkout</button>
                        </div>
                    </div>
                )
            }
        </div>

      </div>
    </div>
  )
}

export default Cart
