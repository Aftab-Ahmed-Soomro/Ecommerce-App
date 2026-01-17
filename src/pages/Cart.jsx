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

    // console.log("cart data",data)

    const totalQty = data.reduce((prevValue,currValue)=> prevValue + currValue.quantity, 0)
    const totalPrice = data.reduce((prevValue,currValue)=> prevValue + (currValue.quantity * currValue?.productId?.sellingPrice),0)
  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
        {
            data.length === 0 && !loading && (
                <p className='bg-white py-5'>No Product Found</p>
            )
        }
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
        {/* view product */}
        <div className='w-full max-w-3xl'>
            {
                loading ? (
                    loadingCart.map((el,index)=> {
                        return (
                            <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>

                            </div>
                        )
                    })
                ) : (
                    data.map((product) => {
                        return (
                            <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300 rounded flex relative'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img src={product?.productId.productImage[0]} className='w-full h-full object-scale-down scale-90 mix-blend-multiply' />
                                </div>
                                <div className='px-4 py-2'>
                                        {/* Delete Product */}
                                    <div className='flex justify-between items-center'>
                                        <h2 className='text-lg lg:text-xl'>
                                            {product?.productId?.productName?.length > 45  
                                            ? product?.productId?.productName?.slice(0, 45) + "..."  
                                            : product?.productId?.productName}
                                        </h2>
                                        <div onClick={()=>deleteCartProduct(product?._id)} className='text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer absolute right-0 text-lg lg:text-2xl'>
                                            <MdDelete />
                                        </div>
                                    </div>
                                    <p className='capitalize text-slate-500'>{product?.productId?.category}</p>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-red-600 font-medium text-lg'>{displayPKRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className='text-slate-600 font-semibold text-lg absolute right-0 p-2'>{displayPKRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                    <div className='flex items-center gap-3 mt-1'>
                                        <button onClick={()=>decreaseQty(product?._id,product?.quantity)} className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded cursor-pointer'>-</button>
                                        <span>{product?.quantity}</span>
                                        <button onClick={()=>increaseQty(product?._id,product?.quantity)} className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded cursor-pointer'>+</button>
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
                    <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'>
                        
                    </div>
                ) : (
                    <div className='h-36 bg-white'>
                        <h2 className='text-white bg-red-600 px-4 py-2'>Summary</h2>
                        <div className='flex items-center justify-between px-4 py-1 gap-2 font-medium text-lg text-slate-600'>
                            <p>Quantity</p>
                            <p>{totalQty}</p>
                        </div>

                        <div className='flex items-center justify-between px-4 py-1 gap-2 font-medium text-lg text-slate-600'>
                            <p>Total Price</p>
                            <p>{displayPKRCurrency(totalPrice)}</p>
                        </div>

                        <button className='bg-blue-600 p-2 text-white w-full'>Payment</button>
                    </div>
                )
            }
        </div>

      </div>
    </div>
  )
}

export default Cart
