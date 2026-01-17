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
    <section id=''>
      <div className="mx-auto container p-4">
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
            <div className='w-20 h-20 mx-auto'>
                <img src={loginIcons} alt="Login icons" />
            </div>
            <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                <div className='grid'>
                    <label>Email: </label>
                    <div className='bg-slate-100 p-2'>
                        <input 
                            className='w-full h-full outline-none bg-transparent' 
                            type="email" 
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                            placeholder='enter your email...' />
                    </div>
                </div>

                <div>
                    <label>Password: </label>
                    <div className='bg-slate-100 p-2 flex'>
                        <input 
                        className='w-full h-full outline-none bg-transparent' 
                        type={showPassword ? "text" : "password"} 
                        name='password'
                        value={data.password}
                        onChange={handleOnChange}
                        placeholder='enter your password...' />
                        <div onClick={()=>setShowPassword((prev)=>!prev)} className='cursor-pointer text-xl'>
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
                    <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                        Forgot Password ?   
                    </Link>
                </div>

                <button className='bg-red-600 text-white px-6 py-2 w-full max-w-[150px] rounded-full cursor-pointer hover:scale-110 transition-all mx-auto block mt-6'>
                    Login
                </button>

            </form>
            <p className='my-5'>Don't have an account ? <Link className='text-red-600 hover:text-red-700 hover:underline' to={"/sign-up"}>Sign Up</Link></p>
        </div>
      </div>
    </section>
  )
}

export default Login;