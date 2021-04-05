import axios from 'axios';
import React,{useState} from 'react'
import Navbar from './Navbar';

const Reset = () => {
    const [email,setEmail]=useState("");
    const [resetPasswordError,setPasswordError]=useState("")
    const forgotHandle=(e)=>{
        e.preventDefault();
        setPasswordError("")
        axios.post('http://localhost:5002/forgot-password',{"email":email})
        .then(result=>{
            console.log(result)
            alert(`Email sent to ${email} check your mail..`)
        }).catch(err=>{
            console.log({err})
            setPasswordError(err.response.data.error)
        })
    }
    return (
        <div>
     <Navbar/>
 
   <center>
       <h1>Reset Password</h1>
   </center>
            
            <center>
            <form onSubmit={forgotHandle}>
                <input
                
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input type="submit" />
            </form>
            <div className="text-danger">{resetPasswordError}</div>
            </center>
        </div>
    )
}

export default Reset
