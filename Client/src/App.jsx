import axios from "axios";
import './App.css'
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";

function App() {
  
  const[users,setUsers] = useState([]);
  const[filterUsers,setFilterUsers] = useState([]);
  const[modelopen,setModelOpen] = useState(false);
  const[userDate,setUserdata] = useState({name:"",age:"",city:""});

//Url get
  const getAllUser = async () => {
  try {
    const res = await axios.get("http://localhost:8000/users");
    console.log(res.data);
    setUsers(res.data);
    setFilterUsers(res.data);
  } catch (error) {
    console.error("❌ Failed to fetch users:", error);
  }
};
    useEffect(()=>{
    getAllUser();
  },[]); 

//Search Function
const HandleSearch =(e)=>{
  const searchText = e.target.value.toLowerCase();
  const filterUsers = users.filter((user)=>
    user.name.toLowerCase().includes(searchText) || 
    user.city.toLowerCase().includes(searchText));
    setFilterUsers(filterUsers);
};

//Delete Function

const HandleDelete = async (id) => {
  const userToDelete = users.find((user) => user.id === id);
  if (!userToDelete) return;
  const result = await Swal.fire({
    title: 'Are you sure?',
    html: `You are about to delete <b>${userToDelete.name}</b> from <b>${userToDelete.city}</b>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      const res = await axios.delete(`http://localhost:8000/users/${id}`);
      setUsers(res.data);
      setFilterUsers(res.data);
      Swal.fire('Deleted!', `${userToDelete.name} has been removed.`, 'success');
    } catch (error) {
      console.error("❌ Delete failed:", error);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  }
};

const HandleAddRecord=()=>{
  setUserdata({name:"",age:"",city:""});
  setModelOpen(true);
}
///Close Model
const CloseModel=()=>{
  setModelOpen(false);
  getAllUser();
};
//Data handle
const HandleData=(e)=>{
  setUserdata({...userDate,[e.target.name] : e.target.value});
}
//Submit Data

const HandleSubmit = async (e)=>{
  e.preventDefault();
  if(userDate.id){
    await axios.patch(`http://localhost:8000/users/${userDate.id}`,userDate).then((res)=>{
    console.log(res);
  });
  }else{
  await axios.post("http://localhost:8000/users",userDate).then((res)=>{
    console.log(res);
  });
}
CloseModel();
setUserdata({name:"",age:"",city:""});
};

//Updaet Edit
const HandleEdit=(user)=>{
  setUserdata(user);
  setModelOpen(true);
}


  return (
      <div className='container'>
          <h3>CRUD App </h3>
          <div className="input-search">
            <input type="search" placeholder="Search here" onChange={HandleSearch}/>
            <button className='btn blue' onClick={HandleAddRecord}>Add record</button>
          </div>
          <table className='table'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              { filterUsers && filterUsers.map((user,index)=>{
                return (
              <tr key={user.id}>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td>
                <button className='btn green' onClick={()=>HandleEdit(user)}>Edit</button>
              </td>
              <td>
                <button className='btn red' onClick={()=>HandleDelete(user.id)}>Delete</button>
              </td>
              </tr>
              );
              })} 
            </tbody>
          </table>
          {modelopen && (
            <div className="model">
               <div className="model-content">
                <span className="close" onClick={CloseModel}> &times;</span>
                <h2>{userDate.id ? "Update Record" : "Create Record"}</h2>
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" value={userDate.name} onChange={HandleData} name="name" id="name" />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input type="number" value={userDate.age} onChange={HandleData} name="age" id="age" />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input type="text" value={userDate.city} onChange={HandleData} name="city" id="city" />
                </div>
                <button className="btn green" onClick={HandleSubmit}>Add User</button>
               </div>
            </div>
          )}
      </div>
  )
}

export default App
