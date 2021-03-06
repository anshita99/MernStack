import React, { useEffect, useState } from 'react'
import axios from 'axios';


const AddDataComp = ({heading,button}) => {
    const [change, setChange] = useState(false)
    const [value, setValue] = useState({ })
    const [drop, setDrop] = useState();
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [fullnameError, setFullNameError] = useState("")


    const handleChange = (key, value) => {
        setValue((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("")
        setEmailError("");
        setFullNameError("");
        console.log(value)
        try {
            const res = await axios.post('http://localhost:5000/signup/', value)
                .then(result => {
                    console.log("Drop value", result.status)
                    if (result.status === 201) {
                        setValue({ "category": "Actor" });
                        setChange(!change)
                        alert("Data Added Successfully")

                    }
                })
            
        } catch (err) {
            if (err.response.data.err.hasOwnProperty("code") && err.response.data.err.code===11000)
            {
                setEmailError("Email is already Registered")
            }else{

            if (err.response.data.err.errors.hasOwnProperty("fullname")) {

                setFullNameError(err.response.data.err.errors.fullname.message)
            }
            if (err.response.data.err.errors.hasOwnProperty("email")) {

                setEmailError(err.response.data.err.errors.email.message)
            }
            if (err.response.data.err.errors.hasOwnProperty("password")) {

                setPasswordError(err.response.data.err.errors.password.message)
            }
        }
            
        }

    }
    useEffect(async () => {
        try {
            console.log("hello sign")
            const dropval = await axios.get('http://localhost:5000/dropdownvalue')
            const storeddrop = dropval.data
            setDrop(storeddrop)
            console.log("The Value of drop", drop)
        } catch (er) {
            console.log(er)
        }
    }, [change])
    return (
        <div>
            <form onSubmit={handleSubmit} className="form-group ">
                <center><h2 >{heading}</h2></center>
                <label for="fullname">Full Name</label>
                <input type="text" name="fullname"
                    value={value.fullname}
                    onChange={(e) => handleChange("fullname", e.target.value)}
                    className="form-control"
                />
                <div >{fullnameError}</div>

                <label for="email">Email</label>
                <input type="text" name="email" 
                    value={value.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="form-control"
                />
                <div >{emailError}</div>
                <label for="password">password</label>
                <input type="password" name="password"
                    value={value.password}
                    className="form-control"
                    onChange={(e) => handleChange("password", e.target.value)}
                />
                <div >{passwordError}</div>
                <select
                    className="dropdown mt-2  p-2 bg-secondary"
                    onChange={(e) => {
                        handleChange("category", e.target.value)
                    }} name="category">
                    {drop && drop.map((val, index) => {
                        return (
                            <option value={val._id} className="bg-white">{val.category}</option>)
                    })}
                </select>
                <center> <button className="btn btn-primary mt-2 ">{button}</button></center>
            </form>
        </div>
    )
}

export default AddDataComp
