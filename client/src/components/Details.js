import React,{useState,useContext,useEffect} from 'react'
import { useLocation} from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
const Details = () => {
    let location=useLocation();
    const [check,setCheck]=useState(true);
    const userData=location.state;
    console.log("The data is from the showData",userData)
    const [email,setEmail]=useState(location.state.datacheck.email);
    const [passsword,setPassword]=useState(location.state.datacheck.password);
    const [fullname,setFullName]=useState(location.state.datacheck.fullname);
    const [category,setCategory]=useState(location.state.datacheck.category.category)
    const [value, setValue] = useState({})
    const [_id,setId]=useState(location.state.datacheck._id)
    const [resetHide,setResetHide]=useState(false);
    const [warning,setWarning]=useState("");
    const [drop, setDrop] = useState({ "category": "Actor" });
    const [filter, setFilter] = useState();
    const [fitlerDrop, setFilterDrop] = useState();
    const [emailError, setEmailError] = useState("")
    const [fullnameError, setFullNameError] = useState("")
    const [categoryError, setCategoryError] = useState("")

    const handleChange = (key, value) => {
        setValue((prev) => ({ ...prev, [key]: value }))
    }

    useEffect(async () => {
        try {
            console.log("hello sign")
            const dropval = await axios.get('http://localhost:5002/dropdownvalue')
            const storeddrop = dropval.data
            setDrop(storeddrop)
            setFilterDrop(storeddrop)
            console.log("The Value of drop", drop)
        } catch (er) {
            console.log(er)
        }
    }, [])
    const handleSubmit=(e)=>{
        e.preventDefault()
        setWarning("")
        const token = sessionStorage.getItem('auth-token');
        console.log("Submit",value)

        axios.patch(`http://localhost:5002/reset-password/${_id}`,value, token && {
            headers: {
                "auth-token":
                    token
            },
        })
            .then(result => {
                console.log("Result after submit", result)
                // setValue({currentPassword:"",newPassword:"",confirmPassword:""})
                alert("Password Updated Successfully...!!")
            })
            .catch(err=>{console.log({err})
            alert("Password does not match")
            setWarning(err.data)
            })
    }
    const Edit=()=>{
        console.log(check)
        setCheck((prev)=>(!prev))
    }
    const upDate=async ()=>{
        setEmailError("");
        setFullNameError("");
        setCategoryError("")
        console.log(check)
        console.log("Detail filter",filter)
        // setCategory(filter);
        const data=JSON.stringify({email,passsword})
        console.log(data)
        try{
            console.log("Working..")
            const port = 'http://localhost:5002/user-details';
            const token = sessionStorage.getItem('auth-token');

            const res = await axios.patch(`${port}/${_id}`, { "email": email, "fullname": fullname ,"category":filter}, token && {
                headers: {
                    "auth-token":
                        token
                },
            });
            setCheck((prev) => !prev)

            const data1=await res;
            console.log("Just checking....", res.data.user.category.category)
            setCategory(res.data.user.category.category)
            console.log("The data value",data1)
        }catch(err){
            console.log("Detail error",{err});
            if (err.response.data.err.hasOwnProperty("path")) {
                setCategoryError("Select Category");
            } else {
                if (err.response.data.err.hasOwnProperty("code") && err.response.data.err.code === 11000) {
                    setEmailError("Email is already Registered")
                } else {

                    if (err.response.data.err.errors.hasOwnProperty("fullname")) {

                        setFullNameError(err.response.data.err.errors.fullname.message)
                    }
                    if (err.response.data.err.errors.hasOwnProperty("email")) {

                        setEmailError(err.response.data.err.errors.email.message)
                    }
                    if (err.response.data.err.errors.hasOwnProperty("category")) {
                        console.log("category Erro",err.response.data.err.errors.category.message)
                        setCategoryError(err.response.data.err.errors.category.message)
                    }
                }
            }
        } 
    }
    const hideFunction=()=>{
        console.log("From hide function",resetHide)
        setResetHide(!resetHide);
    }
    return (
        <div>
        <Navbar/>
           <center><h1>Welcome to the details of User</h1></center> 
               <div >
             
               <div className=" container card bg-success">
               <br/>
                {check ?<>
                    <span><u>Full Name:</u></span>
                    <p className="text-bold">{fullname && fullname}</p>
                    <span><u>Email:</u></span>
                    <p className="text-bold">{email&&email}</p>
                    <span><u>Category:</u></span>
                    <p>{category&& category}</p>
                    </> :
                <>
                    <label>Update Email</label>
                    <input
                    value={email&&email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className=" form-control mb-2"
                />
                        <div class="text-danger">{emailError}</div>
                </>}  
                {check ?'':
                <>
                        <label>Update Name</label>
                    <input
                    value={fullname&&fullname}
                    onChange={(e) =>setFullName(e.target.value)}
                    
                    className=" form-control mb-3"
                />
                        <div class="text-danger">{fullnameError}</div>
                </>}
                {check ? '' :
                        <>
                        <select
                            className="dropdown mt-2  p-2 bg-secondary d-flex m-auto "
                            onChange={(e) => setFilter(e.target.value)} name="category">
                            {fitlerDrop && fitlerDrop.map((val, index) => {
                                return (
                                    <option value={val._id} className="bg-white">{val.category}</option>)
                            })}
                        </select>
                        <center>

                        <div class="text-danger">{categoryError}</div>
                        </center>
                        </>
                       }
                  { check?<center><button onClick={()=>Edit()} className="btn btn-primary mt-2">Edit</button></center>:<center><button onClick={()=>upDate()} className="btn btn-primary mt-2">Update</button></center>}

               </div>
               <br/>
               <div className=" container card bg-info">
               <center>
               <button className="btn btn-primary mt-4" onClick={hideFunction}>{resetHide?'Do not reset':'Reset Password'}</button>
               </center>
               <br/>

            {resetHide?<form className="form-group" onSubmit={handleSubmit}>
                    <h4 className="text-danger">{warning}</h4>
                <label for="fullname">Enter Current Password</label>
                <input type="password" name="currentPassword"
                    value={value.currentPassword}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                    className="form-control"
                />
                <label for="fullname">Enter New Password</label>
                <input type="password" name="newPassword"
                    value={value.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    className="form-control"
                />
                <label for="fullname">Confirm Password</label>
                <input type="password" name="confirmPassword"
                    value={value.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="form-control mb-2"
                />
                <button type="submit" className="btn btn-warning d-flex m-auto">Reset</button>
              </form>:''}
              </div>
              <br/>
              <br/>
              </div>
            
        </div>
    )
}   

export default Details;
