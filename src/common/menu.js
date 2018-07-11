export default [
  {
    name: '分类管理',
    key: 'category',
    icon: 'bars',
    children: [
      {
        name: '分类列表',
        key: 'category-list',
        path: '/category',
      }
    ]
  }, {
    name: '文章',
    key: 'articles',
    icon: 'profile',
    children: [
      {
        name: '文章列表',
        key: 'articles-list',
        path: '/articles'
      }
    ]
  }, {
    name: '系统管理',
    key: 'system',
    icon: 'appstore',
    children: [
      {
        name: '用户管理',
        key: 'system-users',
        path: '/system/users'
      }
    ]
  }
]

export function getPathMap(routes, paths = [], parents = []) {
  routes.forEach((route) => {
    const children = route.children;

    if (children && Array.isArray(children)) {
      const parentKeys = parents.concat([route.key]);
      getPathMap(children, paths, parentKeys);
    }

    if (route.path) {
      paths.push({
        key: route.key,
        path: route.path,
        parents: parents.slice(0),
      });
    }
  })

  const map = {}
  paths.forEach((path) => map[path.path] = path);
  return map;
}