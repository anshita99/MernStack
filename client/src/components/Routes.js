import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import Reset from './Reset';
import  SetPassword from './Password'
import ShowData from './ShowData';

const Routes = () => {
    return (
        <>
            <Switch>
              
                <Route exact path="/" ><Home /></Route>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/signup" ><Signup /></Route>
                <Route exact path="/reset" component={Reset}/>
                <Route exact path="/set-password/:token" component={SetPassword}/>
                <PrivateRoute exact path="/showdata" component={ShowData}/>
                
            </Switch>
        </>
    )
}
export default Routes;