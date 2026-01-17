import { useContext, useState } from "react";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../../public/assets/icons8-cart-96.png'
import { useDispatch, useSelector } from "react-redux";
import summaryApi from "../common";
import {toast} from 'react-toastify'
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import axiosInstance from "../api/axios";

import Context from "../context";

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay,setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)

  const handleLogout = async() => {
    try {
      const response = await axiosInstance({
        url: summaryApi.logout_user.url,
        method: summaryApi.logout_user.method
      });

      const data = response.data;

      if (data.success) {
        toast.success(data.message)
        dispatch(setUserDetails(null))
        context.fetchUserAddToCart() // Reset cart count
        navigate('/')
      }
      if (data.error) {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Logout failed")
      console.error(error)
    }
  } 

  const handleSearch = (e) => {
    const {value} = e.target

    setSearch(value)

    if(value) {
      navigate(`/search?q=${value}`)
    }
    else{
      navigate(`/search`)
    }
  }
  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="flex items-center h-full container mx-auto px-4 justify-between">
        <div>
          <Link to={"/"}>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-slate-800 font-sans tracking-tight">SOOMRO</span>
              <span className="text-2xl font-bold text-red-600 font-sans tracking-tight">GROUP</span>
            </div>
            {/* <img
              className="rounded-xl"
              src={logo}
              width={50}
              height={50}
            ></img> */}
          </Link>
        </div>

        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border-gray-200 border-2 rounded-full focus-within:shadow-md pl-2">
          <input onChange={handleSearch} value={search} className="w-full outline-none" type="text" placeholder="search product here..." />
          <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        <div className="flex items-center gap-7">
          <div className="relative flex justify-center">
            {
              user?._id && (
                <div className="text-3xl cursor-pointer relative flex justify-center" onClick={()=>setMenuDisplay(preve => !preve)}>
                  {
                    user?.profilePic ? (
                      <img src={user?.profilePic} className="w-10 h-10 rounded-full" alt={user?.name}/>
                    ) : (
                    <FaRegCircleUser />
                    )
                  }
                </div>
              )
            }
            {
              menuDisplay && (
                <div className="hidden md:block  absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
                  <nav>
                    {
                      user?.role === ROLE.ADMIN && (
                        <Link to={"/admin-panel/all-products"} onClick={()=>setMenuDisplay(preve => !preve)} className="whitespace-nowrap hover:bg-slate-100 p-2">Admin Panel</Link>
                      )
                    }
                  </nav>
                </div>  
              )
            }
            </div>

            {
              user?._id && (
                <Link to={"/cart"} className="text-2xl relative">
                  <span><FaShoppingCart /></span>
                  <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                    <p className="text-sm">{context?.cartProductCount}</p>
                  </div>
                </Link>
              )
            }

          <div>
            {
              user?._id ? (
                <button onClick={handleLogout} className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer">Logout</button>
              )
              :
              (
                <Link to={"/login"} className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                  Login
                </Link>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
