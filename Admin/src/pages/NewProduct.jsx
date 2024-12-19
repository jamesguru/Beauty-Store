import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from "axios"
import { userRequest } from '../requestMethods';
import { useState } from 'react';

const NewProduct = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputs, setInputs] = useState({});
  const [uploading, setUploading] = useState("Uploading is 0%");
  const [selectedOptions, setSelectedOptions] = useState({
    concern: [],
    skintype: [],
    categories: [],
  });


  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: [...prev[name], value],
    }));
  };

  const handleRemoveOption = (name, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: prev[name].filter((options) => options !== value)
    }));
  }

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
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
      await userRequest.post("/products", {img: url, ...inputs, ...selectedOptions})
    } catch (error) {
      console.log(error);
      setUploading("Uploading failed")
      
    }


  }
  return (
    <div className="p-5">
      <div className="flex items-center justify-center mb-5">
        <h1 className="text-2xl font-semibold">New Product</h1>
      </div>

      <div className="mt-5 bg-white p-5 shadow-lg rounded-lg">

        <form className="flex flex-col md:flex-row rounded-lg">

          {/* LEFT */}

          <div className="flex-1 space-y-5">

            <div>

              <label htmlFor="" className="font-semibold">
                Product Image:
              </label>
              
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

            <span className='text-green-500'>{uploading}</span>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Product Name
              </label>
              <input
                type="text"
                name="title"
                id=""
                placeholder="Product Name"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Product Description
              </label>
              <textarea
                type="text"
                cols={15}
                rows={7}
                name="desc"
                onChange={handleChange}
                id=""
                placeholder="Product Description"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Product Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                id=""
                onChange={handleChange}
                placeholder="$100"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Product Discounted Price
              </label>
              <input
                type="number"
                name="discountedPrice"
                id=""
                onChange={handleChange}
                placeholder="$80"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

          </div>

          {/* RIGHT */}

          <div className="ml-5 flex-1 space-y-5">
            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Wholesale Price
              </label>
              <input
                type="number"
                name="wholesalePrice"
                onChange={handleChange}
                id=""
                placeholder="$70"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Wholesale Minimum Quantity
              </label>
              <input
                type="number"
                name="wholesaleMinimumQuantity"
                onChange={handleChange}
                id=""
                placeholder="10"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                id=""
                onChange={handleChange}
                placeholder="Kylie"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Concern
              </label>
              <select
                name="concern"
                id=""
                className="border-2 border-[#444] border-solid p-2 mb-4 sm:mb-0 sm:mr-4"
                onChange={handleSelectChange}
              >
                <option disabled defaultValue={true}>
                  Select Concern
                </option>
                <option>Dry Skin</option>
                <option>Pigmentation</option>
                <option>Oil Control</option>
                <option>Anti Acne</option>
                <option>Sunburn</option>
                <option>Skin Brightening</option>
                <option>Tan Removal</option>
                <option>Night Routine</option>
                <option>UV Protection</option>
                <option>Damaged Hair</option>
                <option>Frizzy Hair</option>
                <option>Stretch Marks</option>
                <option>Color Protection</option>
                <option>Dry Hair</option>
                <option>Soothing</option>
                <option>Dandruff</option>
                <option>Greying</option>
                <option>Hairfall</option>
                <option>Hair Color</option>
                <option>Well Being</option>
                <option>Acne</option>
                <option>Hair Growth</option>

              </select>
            </div>

            <div className="mt-2">
                {selectedOptions.concern.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <span>{option}</span>
                    <FaTrash
                      className="cursor-pointer text-red-500"
                      onClick={() => handleRemoveOption("concern", option)}
                    />
                  </div>
                ))}
              </div>

            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                SkinType
              </label>
              <select
                name="skintype"
                id=""
                onChange={handleSelectChange}
                className="border-2 border-[#444] border-solid p-2 mb-4 sm:mb-0 sm:mr-4"
              >
                <option disabled defaultValue={true}>
                  Select Skin Type
                </option>
                <option>All</option>
                <option>Oily</option>
                <option>Dry</option>
                <option>Sensitive</option>
                <option>Normal</option>

              </select>
            </div>
            <div className="mt-2">
                {selectedOptions.skintype.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <span>{option}</span>
                    <FaTrash
                      className="cursor-pointer text-red-500"
                      onClick={() => handleRemoveOption("skintype", option)}
                    />
                  </div>
                ))}
              </div>


            <div>
              <label htmlFor="" className="block mb-2 font-semibold">
                Category
              </label>
              <select
                name="categories"
                onChange={handleSelectChange}
                id=""
                className="border-2 border-[#444] border-solid p-2 mb-4 sm:mb-0 sm:mr-4"
              >
                <option disabled defaultValue={true}>
                  Category
                </option>
                <option>Toners</option>
                <option>Serums</option>
                <option>Foundations</option>
                <option>Lotions</option>

              </select>
            </div>
            <div className="mt-2">
                {selectedOptions.categories.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <span>{option}</span>
                    <FaTrash
                      className="cursor-pointer text-red-500"
                      onClick={() => handleRemoveOption("categories", option)}
                    />
                  </div>
                ))}
              </div>


            <button className='bg-slate-500 text-white py-2 px-4 rounded' onClick={handleUpload}>Create</button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default NewProduct;
