import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from "axios"
import { userRequest } from '../requestMethods';
import { useEffect } from 'react';

const Banners = () => {

  const [selectedImage, setSelectedImage] = useState(null)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [banners, setBanners] = useState([])
  const [uploading, setUploading] = useState("Uploading is 0%")


  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleUpload = async(e) =>{
    e.preventDefault();
    const data = new FormData();
    data.append("file", selectedImage);
    data.append("upload_preset", "uploads");

    setUploading("Uploading ...")
    try {
      
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dkjenslgr/image/upload",
        data
      );

      const {url} = uploadRes.data;

      setUploading("Uploaded 100%")
      await userRequest.post("/banners", {img: url, title, subtitle})
    } catch (error) {
      console.log(error);
      setUploading("Uploading failed")
      
    }


  }

  useEffect(() =>{

    const getBanners = async() =>{
      try {
        const res = await userRequest.get("/banners");
        setBanners(res.data);
      } catch (error) {
        console.log(error)
      }
    }

    getBanners();
  }, [])


  const handleDelete = async(id) =>{
    try {
      await userRequest.delete(`/banners/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex justify-evenly m-[10%]">
      {/* LEFT */}
      <div className="mr-[50px]">
        <h2 className="text-xl font-semibold mb-4">Active Banners</h2>

        <div className="flex flex-col space-y-4">

          {banners?.map((banner, index)  => 
          <div className="flex items-center justify-between border-b border-gray-200 pb-4" key={index}>
          <img
            src={banner.img}
            alt=""
            className="w-32 h-32 object-cover rounded-md"
          />

          <div className="flex-1 ml-4">
            <h3 className="text-xl font-semibold mb-2">
              {banner.title}
            </h3>
            <p className="text-gray-600 mb-2">
              {banner.subtitle}
            </p>
          </div>
          <button className="bg-red-500 p-2 text-white font-semibold cursor-pointer" onClick={() => handleDelete(banner._id)}>
            Delete
          </button>
        </div>

          
          )}
          

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex flex-col">
        <div className="flex-1 bg-white p-5">

          <div className="flex flex-col">
            <span htmlFor="" className="font-semibold">Image:</span>
            <div className="border-2 h-[100px] w-[100px] border-[#444] border-solid rounded-md">
              {!selectedImage ? (
                <div className="border-2 h-[100px] w-[100px] border-[#444] border-solid rounded-md flex items-center justify-center">
                  <label htmlFor="file" className="cursor-pointer">
                    <FaPlus className="text-[20px]" />
                  </label>
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Product"
                  className="h-[100px] w-[100px] object-cover rounded-md"
                />
              )}
              <input
                type="file"
                id="file"
                onChange={imageChange}
                style={{ display: "none" }}
              />
            
            </div>
            <span className='text-green-500 mt-[20px]'>{uploading}</span>
            <div className='flex flex-col my-3'>
              <span className='font-semibold'>Title:</span>
              <input type="text" className='w-[250px] outline-none border-b-2 border-[#444] border-solid' onChange={(e) => setTitle(e.target.value)}/>
            </div>

            <div className='flex flex-col my-3'>
              <span className='font-semibold'>Subtitle:</span>
              <input type="text" className='w-[250px] outline-none border-b-2 border-[#444] border-solid' onChange={(e) => setSubtitle(e.target.value)} />
            </div>


            <button className='bg-[#1e1e1e] p-2 text-white font-semibold cursor-pointer' onClick={handleUpload}>Upload</button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Banners;
