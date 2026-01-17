import React, { useContext, useState } from 'react'
import loginIcons from '../../public/assets/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import summaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';

import axiosInstance from "../api/axios";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);  
    
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    // w/o destructured
    // const generalContext = useContext(Context);
    // console.log("generalContext",generalContext.fetchUserDetails());

    // w destructured
    const { fetchUserDetails,fetchUserAddToCart } = useContext(Context);
    // console.log("generalContext",fetchUserDetails());

    const handleOnChange = (e) => {
        const {name, value} = e.target;

        setData((preve)=> {
            return{
                ...preve,
                [name] : value
            }
        })
        console.log("data login", data);
    }
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance({
                url: summaryApi.signin.url,
                method: summaryApi.signin.method,
                data: data
            })

            const dataApi = response.data;

            if(dataApi.success) {
                toast.success(dataApi.message)
                navigate('/');
                fetchUserDetails();
                fetchUserAddToCart()
            }
            
            if(dataApi.error) {
                toast.error(dataApi.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Login failed");
        }
    }

  return (
    <section id='login'>
      <div className="mx-auto container p-4 mt-8">
        <div className='bg-white p-8 w-full max-w-md mx-auto rounded-2xl shadow-xl border border-slate-100'>
            <div className='w-20 h-20 mx-auto mb-6'>
                <img src={loginIcons} alt="Login icons" />
            </div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label className='text-slate-600 font-medium'>Email :</label>
                    <div className='bg-slate-50 p-2 rounded-lg border border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all'>
                        <input 
                            className='w-full h-full outline-none bg-transparent placeholder:text-slate-400' 
                            type="email" 
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                            placeholder='enter your email...' />
                    </div>
                </div>

                <div className='grid gap-1'>
                    <label className='text-slate-600 font-medium'>Password :</label>
                    <div className='bg-slate-50 p-2 flex rounded-lg border border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all'>
                        <input 
                        className='w-full h-full outline-none bg-transparent placeholder:text-slate-400' 
                        type={showPassword ? "text" : "password"} 
                        name='password'
                        value={data.password}
                        onChange={handleOnChange}
                        placeholder='enter your password...' />
                        <div onClick={()=>setShowPassword((prev)=>!prev)} className='cursor-pointer text-xl text-slate-500 hover:text-red-600 transition-colors flex items-center'>
                            <span>
                                {
                                    showPassword 
                                    ? 
                                    (
                                        <FaEyeSlash /> 
                                    )
                                    :
                                    (
                                        <FaEye />   
                                    )
                                }
                            </span>
                        </div>
                    </div>
                    <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600 text-sm text-slate-500 transition-colors'>
                        Forgot Password ?   
                    </Link>
                </div>

                <button className='bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 w-full max-w-[150px] rounded-full cursor-pointer hover:shadow-lg hover:scale-105 transition-all mx-auto block mt-4 font-bold tracking-wide active:scale-95'>
                    Login
                </button>

            </form>
            <p className='my-5 text-center text-slate-500'>Don't have an account ? <Link className='text-red-600 hover:text-red-700 hover:underline font-medium' to={"/sign-up"}>Sign Up</Link></p>
        </div>
      </div>
    </section>
  )
}

export default Login;