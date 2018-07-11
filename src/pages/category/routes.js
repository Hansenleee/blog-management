import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'src/utils/async-component';

export default [
  <Route
    key="category" path="/category">
    <Switch>
      <Route exact path="/category" component={asyncComponent(() => import('./list/container'))}/>
    </Switch>
  </Route>,
];
