import React from 'react';
import {BrowserRouter, Route, Switch, useParams} from 'react-router-dom';
import {Home} from './pages/Home';
import {Login} from './pages/Login';
import {ActivatePlayer} from './pages/Login/activate';
import {ActivationConfirm} from './pages/Login/activationconfirm';
import {PlayerPage} from './pages/playerpage';


export function Routes(){
    return (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/login/:routetoken" exact component={Login}></Route>
            <Route path="/login/activate/:token" exact component={ActivatePlayer}></Route>
            <Route path="/login/activate/confirm/success" exact component={ActivationConfirm}></Route>
            <Route path="/player/page" exact component={PlayerPage}></Route>
        </Switch>
    </BrowserRouter>
    )
}