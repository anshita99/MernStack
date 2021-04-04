import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
        <br/>
            <center>
            <div className="lead d-inline-block ml-2">
            <Link className="btn btn-primary btn-lg" to="/login">Login</Link>
            </div>
            </center>
            <br/>
            <center>
            <h1>Welcome Home</h1>
            </center>
       
        </div>

    )
}

export default Home;
