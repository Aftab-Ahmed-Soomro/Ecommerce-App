import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import summaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

import axiosInstance from './api/axios';

const App = () => {

  const dispatch = useDispatch();
  const [cartProductCount, setcartProductCount] = useState(0);

  const fetchUserDetails = async() => {
    try {
        const response = await axiosInstance({
            url: summaryApi.current_user.url,
            method: summaryApi.current_user.method
        })
        const dataApi = response.data;

        if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data))
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
  }

  const fetchUserAddToCart = async() => {
    try {
        const response = await axiosInstance({
            url: summaryApi.addToCartProductCount.url,
            method: summaryApi.addToCartProductCount.method
        })
        const dataApi = response.data;

        setcartProductCount(dataApi?.data?.count)
    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
  }

  useEffect(()=> {
    // user Details
    fetchUserDetails();

    // user 
    fetchUserAddToCart(); 
  },[])

  return (
    <>
      <Context.Provider value={{
        fetchUserDetails, //user details fetch
        cartProductCount, // current user add to cart product count
        fetchUserAddToCart
      }}>
        <ToastContainer 
         position='top-center'
        />
        <Header />
        <div className='flex flex-col min-h-screen pt-16'>
          <main className='flex-1'>
            <Outlet />
          </main>
          <Footer />
        </div>
      </Context.Provider>
    </>
  )
}

export default App
