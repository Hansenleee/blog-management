import axios from 'axios';
import { message } from 'antd';
// import md5 from 'md5';
import events from 'src/utils/events';
import { IS_LOCAL } from 'src/utils/env';

axios.interceptors.request.use(
  (config) => {
    const apiPathname = IS_LOCAL ? 'localhost:3000' : '120.55.171.184:3000'
    config.url = `http://${apiPathname}/api/manage${config.url}`;
    // 不能在header头加列表意外（非正规的）信息
    // config.headers['sign']= `${md5('libin')}11`;
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => {
    const { data } = response;
    const code = String(data.code);

    switch (code) {
      case "0":
        return data;
      case "-2":
        // 需要登录
        events.emit('change-login-visible');
        return Promise.reject(data);
      default:
        message.error(data.message);
        return Promise.reject(data)
    }
  },
  (error) => {
    if (error.response && error.response.status >= 500) {
      message.info('抱歉，服务器开小差啦，请稍后再试o(╯□╰)o');
    }
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error);
  },
);