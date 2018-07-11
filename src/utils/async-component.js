import Loadable from 'react-loadable';

const Loading = () => null;

export default (componentLoader) => {
  return Loadable({
    loader: componentLoader,
    loading: Loading,
  });
};
