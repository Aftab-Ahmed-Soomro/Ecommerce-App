import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import summaryApi from '../common';
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayPKRCurrency from '../helpers/displayCurrency';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

import axiosInstance from "../api/axios";

const ProductDetails = () => {
    const [data,setData] = useState({
        productName : "",
        brandName : "",
        category : "",
        productImage : [],
        description : "",
        price : "",
        sellingPrice : ""
    })

    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
        x : 0, 
        y : 0
    })
    const [zoomImage, setZoomImage] = useState(false)

    const productImageListLoading = new Array(4).fill(null);

    // console.log("product id",params);

    const fetchProductDetails = async() => {
        setLoading(true)
        try {
            const response = await axiosInstance({
                url: summaryApi.productDetails.url,
                method: summaryApi.productDetails.method,
                data: {
                    productId: params?.id
                }
            })
            
            setLoading(false)
            const dataResponse = response.data;
            setData(dataResponse?.data)
            setActiveImage(dataResponse?.data.productImage[0])
        } catch (error) {
             console.error("Error fetching product details:", error);
             setLoading(false);
        }
    }

    // console.log("data",data);
    
    useEffect(()=> {
        fetchProductDetails();
    },[params])
    
    const handleMouseEnterProduct = (imageURL) => {
        setActiveImage(imageURL)
    }

    const handleZoomImage = useCallback((e) => {
        setZoomImage(true)
        const { left, top, width, height } = e.target.getBoundingClientRect()
        console.log("Coordinate", left, top , width, height);

        const x = (e.clientX - left) / width
        const y = (e.clientY - top) / height

        setZoomImageCoordinate({
            x,
            y
        })
    },[zoomImageCoordinate])

    const handleLeaveImageZoom = () => {
        setZoomImage(false)
    }

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async(e,id) => {
        await addToCart(e,id)
        fetchUserAddToCart()
    }

    const handleBuyProduct = async(e,id) => {
        await addToCart(e,id)
        fetchUserAddToCart()
        navigate('/cart')
    }

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>

        {/* Product Image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
 
            <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2">
                <img onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom} src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' />

                {/* Product Magnify(Zoom) */}
                {
                    zoomImage && (
                        <div className='hidden lg:block absolute min-w-[500px] min-h-[400px] overflow-hidden bg-slate-200 p-1 -right-[510px] top-0'>
                            <div
                                className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-125'
                                style={{
                                    backgroundImage : `url(${activeImage})`,
                                    backgroundRepeat : `no-repeat`,
                                    backgroundPosition : `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                                }}
                            >
                            </div>
                        </div>
                    )
                }
            </div>

            <div className='h-full'>
                {
                    loading ? (
                        <div className='flex gap-2 lg:flex-col overflow-scroll scrollBar-none h-full'>
                            {
                                productImageListLoading.map((el,index) =>{
                                    return (
                                        <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage"+index}>
         
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div className='flex gap-2 lg:flex-col overflow-scroll scrollBar-none h-full'>
                            {
                                data?.productImage?.map((imgURL,index) =>{
                                    return (
                                        <div key={imgURL} className='h-23 w-20 bg-slate-200 rounded p-1'>
                                            <img onMouseEnter={()=>handleMouseEnterProduct(imgURL)} onClick={()=>handleMouseEnterProduct(imgURL)} src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>

        {/* Product Details */}
        {
            loading ? (
                <div className='grid gap-1 w-full'>
                    <p className='bg-slate-200 animate-pulse h-6 lg:h-8 rounded-full inline-block w-full'></p>
                    <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8 bg-slate-200 animate-pulse w-full'></h2>
                    <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-full'></p>

                    <div className='flex items-center gap-1 text-slate-200 animate-pulse w-full'>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>

                    <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8 animate-pulse w-full'>
                        <p className='text-red-600 bg-slate-200 w-full'></p>
                        <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                    </div>

                    <div className="flex items-center gap-3 my-2 w-full">
                        <button className='h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></button>
                        <button className='h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></button>
                    </div>

                    <div className='w-full'>
                        <p className='text-slate-600 font-medium my-1 h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></p>
                        <p className='h-10 bg-slate-200 rounded animate-pulse w-full'></p>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-1'>
                    <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data.brandName}</p>
                    <h2 className='text-2xl lg: text-text-4xl font-medium'>{data?.productName}</h2>
                    <p className='capitalize text-slate-400'>{data?.category}</p>

                    <div className='text-red-600 flex items-center gap-1 '>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStarHalf />
                    </div>

                    <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                        <p className='text-red-600'>{displayPKRCurrency(data?.sellingPrice)}</p>
                        <p className='text-slate-400 line-through'>{displayPKRCurrency(data?.price)}</p>
                    </div>

                    <div className="flex items-center gap-3 my-2">
                        <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white cursor-pointer' onClick={(e)=>handleBuyProduct(e,data?._id)}>Buy</button>
                        <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white cursor-pointer' onClick={(e)=>handleAddToCart(e,data?._id)}>Add To Cart</button>
                    </div>

                    <div>
                        <p className='text-slate-600 font-medium my-1'>Description :</p>
                        <p>{data?.description}</p>
                    </div>
                </div>
            )
        }

      </div>

      {
        data?.category && <CategoryWiseProductDisplay category={data?.category} heading={"Recommended Product"} />
      }

    </div>
  )
}

export default ProductDetails
