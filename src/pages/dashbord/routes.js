import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'src/utils/async-component';

export default [
  <Route
    key="home" path="/dashbord">
    <Switch>
      <Route exact path="/dashbord" component={asyncComponent(() => import('./index/container'))}/>
    </Switch>
  </Route>,
];
