import React, { useContext } from 'react';
import { Link,useHistory} from 'react-router-dom';
import {ApiContext} from './ApiContext';

const Navbar=()=>{
    let history=useHistory();
  const { truevalue, settruevalue } = useContext(ApiContext);
    const handleOut=()=>{
        sessionStorage.removeItem('auth-token')
        settruevalue(!truevalue)
        history.push('/')
          }
    return(
        
<nav class="navbar navbar-light bg-light d-flex justify-content-end">
  <a class="navbar-brand" href="#">
    <Link to="/login" className="btn btn-warning p-2">Login</Link><span> </span>
    
          {sessionStorage.getItem('auth-token') ? <button onClick={handleOut} className="btn btn-danger">Logout</button> : ''} 
  </a>
</nav>
    )
}
export default Navbar;