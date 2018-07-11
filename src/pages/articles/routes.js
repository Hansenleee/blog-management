import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'src/utils/async-component';

export default [
  <Route
    key="articles" path="/articles">
    <Switch>
      <Route exact path="/articles" component={asyncComponent(() => import('./list/container'))}/>
      <Route exact path="/articles/:id" component={asyncComponent(() => import('./detail/container'))}/>
    </Switch>
  </Route>,
];
