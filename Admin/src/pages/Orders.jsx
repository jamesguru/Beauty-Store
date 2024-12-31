import {FaCheckCircle, FaCheckDouble,FaClock  } from "react-icons/fa"
import {DataGrid} from '@mui/x-data-grid';
import { useState } from "react";
import { useEffect } from "react";
import {userRequest} from "../requestMethods";

const Orders = () => {
  const [orders, setOrders] = useState([]);


  const handleUpdateOrder = async(id) =>{

    try {
      await userRequest.put(`/orders/${id}`, {
        "status": 2
      })
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    { field: "_id", headerName: "Order ID", width: 100 },
    { field: "name", headerName: "Customer Name", width: 200 },
    { field: "email", headerName: "Customer Email", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === 0 || params.row.status === 1 ? (
              <FaClock className="text-yellow-500 text-[25px] cursor-pointer mt-2" />
            ) : (
              <FaCheckDouble className="text-green-500 text-[25px]" />
            )}
          </>
        );
      },
    },
    {
      field: "Deliver",
      headerName: "Mark as Delivered",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === 1 || params.row.status === 0 ? (
              <FaCheckCircle className=" text-[25px] cursor-pointer mt-2" 

              onClick={() => handleUpdateOrder(params.row._id)}
             
              />
            ) : (
             ""
            )}
          </>
        );
      },
    },   
  ];

  
  useEffect(() =>{
    const getOrders = async() =>{
    
      try {
        const res = await userRequest.get("/orders");
        setOrders(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getOrders();
    
    },[])

  return (
    <div className="p-5 w-[70vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">Orders</h1>
      </div>
      <div className='m-[30px]'>
      <DataGrid getRowId={(row) => row._id} rows={orders} checkboxSelection columns={columns} />
      </div>

    </div>
  )
}

export default Orders