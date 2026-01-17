import React, { useState } from 'react'
import loginIcons from '../../public/assets/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { data, Link, useNavigate } from "react-router-dom";
import imageToBase64 from '../helpers/imageToBase64';
import summaryApi from '../common';
import { toast } from 'react-toastify';
import axiosInstance from "../api/axios";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);  
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  

        const [data, setData] = useState({
            email: "",
            password: "",
            name: "",
            confirmPassword: "",
            profilePic: "",
        })

        const navigate = useNavigate()

        const handleOnChange = (e) => {
            const {name, value} = e.target;
    
            setData((preve)=> {
                return{
                    ...preve,
                    [name] : value
                }
            })
        }

        const handleSubmit = async(e) => {
            e.preventDefault()

            if (data.password === data.confirmPassword) {
                try {
                     const response = await axiosInstance({
                        url: summaryApi.signup.url,
                        method: summaryApi.signup.method,
                        data: data
                    })
    
                    const dataApi = response.data;

                    if(dataApi.success) {
                        toast.success(dataApi.message)
                        navigate("/login"); 
                    }

                    if(dataApi.error) {
                        toast.error(dataApi.message)
                    }
                } catch (error) {
                    console.error("Signup error:", error);
                    toast.error(error.message || "Signup failed");
                }
            }
            else {
                toast.error("Password and Confirm Password isn't same");
            }
        }

        const handleUploadPic = async(e) => {
            const file = e.target.files[0];
            const imagePic = await imageToBase64(file);

            setData((preve)=> {
                return {
                    ...preve,
                    profilePic : imagePic
                }
            })
        }

  return (
    <section id='sign-up'>
      <div className="mx-auto container p-4 mt-8">
        <div className='bg-white p-8 w-full max-w-md mx-auto rounded-2xl shadow-xl border border-slate-100'>
            <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full ring-4 ring-slate-100 mb-6 group'>
                <div>
                    <img src={data.profilePic || loginIcons} alt="Login icons" className='w-full h-full object-cover' />
                </div>
                <form>
                    <label>
                        <div className='text-xs bg-slate-800 bg-opacity-80 text-white pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full group-hover:bg-red-600 transition-colors'>
                            Upload Photo
                        </div>
                        <input className='hidden' type="file" onChange={handleUploadPic} />
                    </label>
                </form>
            </div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label className='text-slate-600 font-medium'>Name :</label>
                    <div className='bg-slate-50 p-2 rounded-lg border border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all'>
                        <input 
                            className='w-full h-full outline-none bg-transparent placeholder:text-slate-400' 
                            type="text" 
                            name='name'
                            value={data.name}
                            onChange={handleOnChange}
                            required
                            placeholder='enter your name...' />
                    </div>
                </div>

                <div className='grid gap-1'>
                    <label className='text-slate-600 font-medium'>Email :</label>
                    <div className='bg-slate-50 p-2 rounded-lg border border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all'>
                        <input 
                            className='w-full h-full outline-none bg-transparent placeholder:text-slate-400' 
                            type="email" 
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                            required
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
                        required
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
                </div>

                <div className='grid gap-1'>
                    <label className='text-slate-600 font-medium'>Confirm Password :</label>
                    <div className='bg-slate-50 p-2 flex rounded-lg border border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all'>
                        <input 
                        className='w-full h-full outline-none bg-transparent placeholder:text-slate-400' 
                        type={showConfirmPassword ? "text" : "password"} 
                        name='confirmPassword'
                        value={data.confirmPassword}
                        onChange={handleOnChange}
                        required
                        placeholder='enter confirm password...' />
                        <div onClick={()=>setShowConfirmPassword((prev)=>!prev)} className='cursor-pointer text-xl text-slate-500 hover:text-red-600 transition-colors flex items-center'>
                            <span>
                                {
                                    showConfirmPassword 
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
                </div>

                <button className='bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 w-full max-w-[150px] rounded-full cursor-pointer hover:shadow-lg hover:scale-105 transition-all mx-auto block mt-4 font-bold tracking-wide active:scale-95'>
                    Sign Up
                </button>

            </form>
            <p className='my-5 text-center text-slate-500'>Already have an account ? <Link className='text-red-600 hover:text-red-700 hover:underline font-medium' to={"/login"}>Login</Link></p>
        </div>
      </div>
    </section>
  )
}

export default SignUp
