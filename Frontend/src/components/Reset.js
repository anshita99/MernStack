import axios from 'axios';
import React,{useState} from 'react'

const Reset = () => {
    const [email,setEmail]=useState("");
    const forgotHandle=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:5000/forgot-password',{"email":email})
        .then(result=>{
            console.log(result)
        }).catch(err=>{
            console.log({err})
        })
    }
    return (
        <div>
            <center>
            <h1 className="text-danger">Reset Passowrd</h1>
            <form onSubmit={forgotHandle}>
                <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input type="submit" />
            </form>
            </center>
        </div>
    )
}

export default Reset