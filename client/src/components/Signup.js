import React from 'react'
import Navbar from './Navbar';
import AddDataComp from './AddData';

const Signup = () => {

    return (
        <div>
            <Navbar />
            <AddDataComp heading="Sign up" button="Sign up"/>
        </div>
    )
}

export default Signup