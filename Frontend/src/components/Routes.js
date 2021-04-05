import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Details from './Details';
import AdminControl from './AdminControl';
import PrivateRoute from './PrivateRoute';
import Reset from './Reset'
import SetPassword from './Set'

const Routes = () => {
    return (
        <>
            <Switch>
              
                <Route exact path="/" ><Home /></Route>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/signup" ><Signup /></Route>
                <PrivateRoute exact path="/detail" component={Details}/>
                <PrivateRoute exact path='/all-details' component={AdminControl}/>
                <Route exact path="/reset" component={Reset}/>
                <Route exact path="/set-password/:token" component={SetPassword}/>
            </Switch>
        </>
    )
}
export default Routes;