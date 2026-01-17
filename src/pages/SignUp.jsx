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
            // console.log("data login", data)
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

            // Gives the picture in base64 format
            // console.log("image", imagePic);

            // Gives the file name 
            // console.log("file", file);
        }

  return (
    <section id='sign-up'>
      <div className="mx-auto container p-4">
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
            <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                <div>
                    <img src={data.profilePic || loginIcons} alt="Login icons" />
                </div>
                <form>
                    <label>
                        <div className='text-xs bg-slate-200 opacity-80 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                            Upload Photo
                        </div>
                        <input className='hidden' type="file" onChange={handleUploadPic} />
                    </label>
                </form>
            </div>
            <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                <div className='grid'>
                    <label>Name: </label>
                    <div className='bg-slate-100 p-2'>
                        <input 
                            className='w-full h-full outline-none bg-transparent' 
                            type="text" 
                            name='name'
                            value={data.name}
                            onChange={handleOnChange}
                            required
                            placeholder='enter your name...' />
                    </div>
                </div>

                <div className='grid'>
                    <label>Email: </label>
                    <div className='bg-slate-100 p-2'>
                        <input 
                            className='w-full h-full outline-none bg-transparent' 
                            type="email" 
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                            required
                            placeholder='enter your email...' />
                    </div>
                </div>

                <div>
                    <label>Password: </label>
                    <div className='bg-slate-100 p-2 flex'>
                        <input 
                        className='w-full h-full outline-none bg-transparent' 
                        type={showConfirmPassword ? "text" : "password"} 
                        name='confirmPassword'
                        value={data.confirmPassword}
                        onChange={handleOnChange}
                        required
                        placeholder='enter confirm password...' />
                        <div onClick={()=>setShowConfirmPassword((prev)=>!prev)} className='cursor-pointer text-xl'>
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

                <div>
                    <label>Confirm Password: </label>
                    <div className='bg-slate-100 p-2 flex'>
                        <input 
                        className='w-full h-full outline-none bg-transparent' 
                        type={showPassword ? "text" : "password"} 
                        name='password'
                        value={data.password}
                        onChange={handleOnChange}
                        required
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
                </div>

                <button className='bg-red-600 text-white px-6 py-2 w-full max-w-[150px] rounded-full cursor-pointer hover:scale-110 transition-all mx-auto block mt-6'>
                    Sign Up
                </button>

            </form>
            <p className='my-5'>Already have an account ? <Link className='text-red-600 hover:text-red-700 hover:underline' to={"/login"}>Login</Link></p>
        </div>
      </div>
    </section>
  )
}

export default SignUp
