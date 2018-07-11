import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'src/utils/async-component';

export default [
  <Route
    key="system" path="/system">
    <Switch>
      <Route exact path="/users" component={asyncComponent(() => import('./users/container'))}/>
    </Switch>
  </Route>,
];
