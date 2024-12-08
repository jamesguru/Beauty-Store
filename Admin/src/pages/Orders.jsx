import {FaCheckCircle, FaCheckDouble,FaClock  } from "react-icons/fa"
import {DataGrid} from '@mui/x-data-grid';

const Orders = () => {

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
             
              />
            ) : (
             ""
            )}
          </>
        );
      },
    },   
  ];

  
const data = [
  { _id: "o101", name: "Alice Johnson", email: "alice@example.com", status: 1 },
  { _id: "o102", name: "Bob Smith", email: "bob@example.com", status: 0 },
  { _id: "o103", name: "Charlie Brown", email: "charlie@example.com", status: 2 },
  { _id: "o104", name: "David Clark", email: "david@example.com", status: 1 },
  { _id: "o105", name: "Eve Stone", email: "eve@example.com", status: 0 },
  { _id: "o106", name: "Frank Wilson", email: "frank@example.com", status: 1 },
  { _id: "o107", name: "Grace Lee", email: "grace@example.com", status: 2 },
  { _id: "o108", name: "Henry Kim", email: "henry@example.com", status: 0 },
];


  return (
    <div className="p-5 w-[70vw]">
      <div className="flex items-center justify-between m-[30px]">
        <h1 className="m-[20px] text-[20px]">Orders</h1>
      </div>
      <div className='m-[30px]'>
      <DataGrid getRowId={(row) => row._id} rows={data} checkboxSelection columns={columns} />
      </div>

    </div>
  )
}

export default Orders