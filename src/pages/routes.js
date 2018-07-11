
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import category from './category/routes';
import articles from './articles/routes';
import dashbord from './dashbord/routes';

export default [
  ...category,
  ...dashbord,
  ...articles,
  <Redirect key="redirect" to="/dashbord" />,
];
