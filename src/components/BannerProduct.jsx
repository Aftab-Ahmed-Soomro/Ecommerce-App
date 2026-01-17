import React, { useEffect, useState } from 'react'

// desktop images
import image1 from '../../public/assets/banner/img1.webp'
import image2 from '../../public/assets/banner/img2.webp'
import image3 from '../../public/assets/banner/img3.jpg'
import image4 from '../../public/assets/banner/img4.jpg'
import image5 from '../../public/assets/banner/img5.webp'

// mobile images 
import image1Mobile from '../../public/assets/banner/img1_mobile.jpg'
import image2Mobile from '../../public/assets/banner/img2_mobile.webp'
import image3Mobile from '../../public/assets/banner/img3_mobile.jpg'
import image4Mobile from '../../public/assets/banner/img4_mobile.jpg'
import image5Mobile from '../../public/assets/banner/img5_mobile.png'

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

const BannerProduct = () => {
    const [currentImage,setCurrentImage] = useState(0)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ]

    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ]

    const nextImage = () => {
        if(desktopImages.length - 1 > currentImage) {
            setCurrentImage(prev => prev + 1)
        }
    }

    const prevImage = () => {
        if (currentImage != 0) {
            setCurrentImage(prev => prev - 1)
        }
    }

    useEffect(()=> {
        const interval = setInterval(()=>{
            if(desktopImages.length - 1 > currentImage) {
                nextImage()
            }
            else {
                setCurrentImage(0)
            }
        },5000) 

        return ()=> clearInterval(interval)
    },[currentImage])
  return (
    <div className='container mx-auto px-4 rounded'>
      <div className='h-56 md:h-[266px] w-full bg-slate-200 relative'>
        <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
            <div className='w-full flex justify-between text-2xl'>
                <button onClick={prevImage} className='bg-white shadow-lg rounded-full p-2 cursor-pointer hover:scale-110 transition-transform text-slate-700 z-10'>
                    <FaAngleLeft />
                </button>
                <button onClick={nextImage} className='bg-white shadow-lg rounded-full p-2 cursor-pointer hover:scale-110 transition-transform text-slate-700 z-10'>
                    <FaAngleRight />
                </button>
            </div>
        </div>

        {/* desktop & tablet version */}
        <div className='hidden md:flex w-full h-full overflow-hidden'>
            {
                desktopImages.map((imageURL,index) => {
                    return (
                        <div className="w-full h-full min-w-full min-h-full transition-all" key={imageURL} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                            <img src={imageURL} className='w-full h-full'/>
                        </div>
                    )
                })
            }
        </div>
        
        {/* mobile version */}
        <div className='md:hidden flex w-full h-full overflow-hidden'>
            {
                mobileImages.map((imageURL,index) => {
                    return (
                        <div className="w-full h-full min-w-full min-h-full transition-all" key={imageURL} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                            <img src={imageURL} className='w-full h-full object-cover'/>
                        </div>
                    )
                })
            }
        </div>
      </div>
    </div>
  )
}

export default BannerProduct
