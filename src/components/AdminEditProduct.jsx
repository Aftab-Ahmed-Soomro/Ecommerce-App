import { IoMdClose } from "react-icons/io";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import summaryApi from '../common';
import {toast} from 'react-toastify'
import axiosInstance from "../api/axios";

const AdminEditProduct = ({
    onClose,
    productData,
    fetchData
}) => {
  const [data, setData] = useState({
    ...productData,
    productName : productData?.productName,
    brandName : productData?.brandName,
    category : productData?.category,
    productImage : productData?.productImage || [],
    description : productData?.description,
    price : productData?.price,
    sellingPrice : productData?.sellingPrice
  }); 

  const [fullScreenImage,setFullScreenImage] = useState("")
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)

  const handleOnChange = (e) => {
    const { name, value} = e.target;
    setData((preve)=> {
      return {
        ...preve,
        [name] : value
      }
    })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]

    const uploadImageCloudinary = await uploadImage(file)

    setData((preve)=> {
      return {
        ...preve,
        productImage : [ ...preve.productImage, uploadImageCloudinary.url ]
      }
    })
  }

  const handleDeleteProductImage = async(index) => {

    const newProductImage = data.productImage.filter((_, i) => i !== index); // Creates a new array without the deleted image

    setData((preve)=> {
      return {
        ...preve,
        productImage : [ ...newProductImage ]
      }
    })
  }

  { /* submit form */ }
  { /* submit form */ }
  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance({
        url: summaryApi.updateProduct.url,
        method: summaryApi.updateProduct.method,
        data: data
      })

      const responseData = response.data;

      if(responseData.success) {
        toast.success(responseData?.message);
        onClose();
        fetchData();
      }

      if(responseData.error) { 
        toast.error(responseData?.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    }
  }

  return (
    <div className='fixed bg-slate-200/35 w-full h-full top-0 left-0 bottom-0 right-0 flex justify-center items-center'>
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className='flex justify-between items-center pb-3'>
            <h2 className='font-bold text-lg'>Edit Product</h2>
            <div onClick={onClose} className='w-fit ml-auto cursor-pointer text-2xl hover:text-red-600'>
                <IoMdClose />
            </div>
        </div>
        <form onSubmit={handleSubmit} className='grid p-4 gap-2 overflow-y-scroll h-full pb-5'>
          <label htmlFor="productName">Product Name :</label>
          <input 
          type="text" 
          id='productName' 
          placeholder='enter product name'
          name='productName' 
          value={data.productName} 
          onChange={handleOnChange}
          className="p-2 bg-slate-100 border border-gray-300 rounded"
          required
          />

          <label htmlFor="brandName" className='mt-3'>Brand Name :</label>
          <input 
          type="text" 
          id='brandName'  
          placeholder='enter brand name' 
          name='brandName'
          value={data.brandName} 
          onChange={handleOnChange}
          className="p-2 bg-slate-100 border border-gray-300 rounded"
          required
          />

          <label htmlFor="category" className='mt-3'>Category :</label>
          <select required onChange={handleOnChange} value={data.category} name="category" id="category" className="p-2 bg-slate-100 border border-gray-300 rounded">
          <option value="">Select Category</option>
            {
              productCategory.map((el,index)=> {
                return (
                  <option value={el.value} key={el.value+index}>
                    {el.label}
                  </option>
                )
              })
            }
          </select>

          <label htmlFor="productImage" className='mt-3'>Product Image :</label>
            <label htmlFor='uploadImageInput'>
              <div className='p-2 bg-slate-100 border border-gray-300 rounded h-[110px] w-full flex justify-center items-center cursor-pointer'> 
                <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                  <span className='text-4xl'><FaCloudUploadAlt /></span>
                  <p className='text-sm'>Upload Product Image</p>
                  <input onChange={handleUploadProduct} type="file" id='uploadImageInput' className='hidden' />
                </div>
              </div>
            </label>  
          <div>
            {
              data?.productImage[0] ? (
                <div className='flex items-center gap-2'>
                  {
                    data.productImage.map((el,index)=> {   
                      return (
                        <div className='relative group'>
                          <img 
                          onClick={()=>{
                            setOpenFullScreenImage(true),
                            setFullScreenImage(el)
                          }} 
                          src={el} 
                          alt={el} 
                          width={80} 
                          height={80} 
                          className='bg-slate-100 border border-gray-300 cursor-pointer' 
                          />
                          <div onClick={()=>handleDeleteProductImage(index)} className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer'>
                            <MdDelete />
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                <p className='text-red-600 text-sm py-2'>*Please upload product image</p>
              )
            }
          </div>

          <label htmlFor="price" className='mt-3'>Price :</label>
          <input 
          type="number" 
          id='price'  
          placeholder='enter price' 
          name='price'
          value={data.price} 
          onChange={handleOnChange}
          className="p-2 bg-slate-100 border border-gray-300 rounded"
          required
          />

          <label htmlFor="sellingPrice" className='mt-3'>Selling Price :</label>
          <input 
          type="number" 
          id='sellingPrice'  
          placeholder='enter selling price' 
          name='sellingPrice'
          value={data.sellingPrice} 
          onChange={handleOnChange}
          className="p-2 bg-slate-100 border border-gray-300 rounded"
          required
          />

          <label htmlFor="description" className='mt-3'>Description :</label>
          <textarea onChange={handleOnChange} name='description' value={data.description} id='description' className='h-28 bg-slate-100 border border-gray-300 resize-none p-1' placeholder='enter product description' rows={3}></textarea>

          <button className='px-3 py-2 bg-red-600 text-white mb-8 hover:bg-red-700 cursor-pointer'>Update Product</button>

        </form>
      </div>

      {/* display image full screen */}
      {
        openFullScreenImage &&  (
        <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
      )
      }

    </div>
  )
}

export default AdminEditProduct