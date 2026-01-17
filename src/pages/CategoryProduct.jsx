import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import summaryApi from '../common';

import axiosInstance from "../api/axios";

const CategoryProduct = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListInArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}

    urlCategoryListInArray.forEach(el => {
      urlCategoryListObject[el] = true
    })

    // console.log("urlCategoryListObject",urlCategoryListObject)
    // console.log("urlCategoryListInArray",urlCategoryListInArray)

    const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList,setFilterCategoryList] = useState([])
    const [sortBy,setSortBy] = useState("")
    console.log("sortBy",sortBy)
    // console.log("category",params.categoryName);

    // {params?.categoryName}

    const fetchData = async() => {
      try {
        const response = await axiosInstance({
          url: summaryApi.filterProduct.url,
          method: summaryApi.filterProduct.method,
          data: {
            category: filterCategoryList
          }
        })

        const responseData = response.data;
        setData(responseData?.data || [])
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }

      // console.log("responseData",responseData)
    }

    const handleSelectCategory = (e) => {
      const {name, value, checked} = e.target; 

      setSelectCategory((prev) => {
        return {
          ...prev,
          [value] : checked
        }
      })

      // console.log("selected",name,value,checked)
    }

    // console.log("selectCategory",selectCategory)

    useEffect(() => {
      fetchData()
    },[filterCategoryList])

    useEffect(() => {
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
        if(selectCategory[categoryKeyName]) {
          return categoryKeyName
        }

        return null;
      }).filter(el => el)
      
      setFilterCategoryList(arrayOfCategory)

      // format for changing url (when changes occurs on checkbox)
      const urlFormat = arrayOfCategory.map((el,index) => {
        if((arrayOfCategory.length - 1) === index) {
          return `category=${el}`
        }

        return `category=${el}&&`
      })

      // console.log("urlFormat",urlFormat.join(""))

      navigate("/product-category?"+urlFormat.join(""))

      // console.log("selected c", arrayOfCategory)
    },[selectCategory])

    const handleOnChangeSortBy = (e) => {
      const {value} = e.target

      setSortBy(value)

      if(value === 'asc') {
        setData(preve => preve.sort((a,b) => a.sellingPrice - b.sellingPrice))
      }

      if(value === 'desc') {
        setData(preve => preve.sort((a,b) => b.sellingPrice - a.sellingPrice))
      }
    }

    useEffect(()=> {

    },[sortBy])
  return (
    <div className='container mx-auto p-4'>

      {/* Desktop Version */}
      <div className='hidden lg:grid gap-4 grid-cols-[200px_1fr]'>
        {/* left side */}
        <div className='bg-white p-2 min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-y-scroll lg:overflow-y-hidden'>

          {/* sort by */}

          <div className=''>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>

            <form className='text-sm flex flex-col gap-2 py-2'>
              <div className='flex items-center gap-3'>
                <input type="radio" name="sortBy" id='1' value={'asc'} checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} />
                <label htmlFor='1'>Price - Low to High</label>
              </div>

              <div className='flex items-center gap-3'>
                <input type="radio" name="sortBy" id='2' value={'desc'} checked={sortBy === 'desc'} onChange={handleOnChangeSortBy} />
                <label htmlFor='2'>Price - High to Low</label>
              </div>
            </form>
          </div>

          {/* filter by */}

          <div className=''>
            <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>

            <form className='text-sm flex flex-col gap-2 py-2'>
              {
                productCategory.map((categoryName,index) => {
                  return (
                    <div className='flex items-center gap-3'>
                      <input type="checkbox" name={'category'} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                      <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                    </div>
                  )
                })
              }
            </form>
          </div>
        </div>

        {/* right side (products) */}
        <div className='px-4'>
          <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {data.length}</p>

          <div className='min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-custom'>
            {
              data.length !== 0 && (
                <VerticalCard data={data} loading={loading} />
              )
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default CategoryProduct
