import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import summaryApi from '../common';
import VerticalCard from '../components/VerticalCard';

import axiosInstance from "../api/axios";

const SearchProduct = () => {
    const query = useLocation();
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);

    const fetchProduct = async() => {
        setLoading(true);
        try {
            // Using existing logic of appending query string to URL
            const response = await axiosInstance({
                url: summaryApi.searchProduct.url + query.search,
                method: summaryApi.searchProduct.method
            })
            const responseData = response.data;
            setLoading(false);

            setData(responseData.data)
        } catch (error) {
             console.error("Error fetching search results:", error);
             setLoading(false);
        }
    }

    useEffect(()=> {
        fetchProduct()   
    },[query])
  return (
    <div className='container mx-auto p-4'>
      {
        loading && (
          <p className='text-lg text-center'>Loading ...</p>
        )
      }

      <p className='text-lg font-semibold my-3'>Search Results : {data.length}</p>

      {
        data.length == 0 && !loading && (
          <p className='bg-white text-lg text-center p-4'>No Results Found</p>
        )
      }

      {
        data.length != 0 && !loading && (
              <VerticalCard loading={loading} data={data} />
            )
      }
    </div>
  )
}

export default SearchProduct
