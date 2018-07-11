import * as React from 'react';
import axios from 'axios';
import { IS_DEV } from 'src/utils/env';

/**
 * 页面级组件的基类
 */
export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.axios = axios;
  }

  /**
   * 打印日志方法
   */
  log(...args) {
    if (!IS_DEV) {
      return;
    }
    const prefixes = `%c[${this.constructor.name}]:`;
    args.unshift(prefixes, 'color: lightseagreen');
    // tslint:disable-next-line:no-console
    console.log(...args);
  }
}
