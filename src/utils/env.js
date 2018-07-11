/**
 * 各种环境变量
 */

// 是否开发模式, 一般情况下用这个就够了
export const IS_DEV = process.env.NODE_ENV === 'development';

// 本地开发模式
const hostname = global.location.hostname;
export const IS_LOCAL = hostname === 'localhost' || /^192\.168\.[1-9]\d*\.[1-9]\d*$/.test(hostname);
