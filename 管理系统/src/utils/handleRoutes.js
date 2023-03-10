import { asyncRoutes } from '@/router';


export function convertRouter(routers) {
  return routers.map((route) => {
    return setRoutes(route, asyncRoutes);
  });
}

/**
 * @description 处理后端路由数据
 * @param {*} route 路由数据
 * @param {*} list 前端路由 asyncRoutes配置项
 * @returns {*}
 */
const setRoutes = (route, list) => {
  // 返回 符合过滤条件的元素组成的新路由数组
  list.filter((item) => {
    if (item.path === route.path) {
      route.component = item.component;
      // route.meta = item.meta;
      // route.name = item.name;
      // item前端路由
      // route后端路由
      // item.component = route.component;
      item.meta = route.meta;
      item.name = route.name;
      // item.icon = route.icon;
      if (route.children && route.children.length) {
        let children = [];
        route.children.filter((option) => {
          children.push(setRoutes(option, item.children));
        });
        route.children = children;
      }
    }
  });
  return route;
};



/**
 * @description 处理前端路由数据
 * @param {*} permissions 路由权限
 * @param {*} route 
 */
function hasPermission(permissions, route) {
  // if (route.meta.permissions) {
  //   // some是数组中只要有一个符合条件就返回true
  //   return permissions.some((role) => route.meta.permissions.includes(role));
  // }
  
  if (route.meta && route.meta.permissions) {
    // some是数组中只要有一个符合条件就返回true
    return permissions.some((role) => route.meta.permissions.includes(role));
  }
   else {
    return true;
  }
  // return true;
}


export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = [];
  routes.forEach((route) => {
    const item = { ...route };
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions);
      }
      finallyRoutes.push(item);
    }
  });
  return finallyRoutes;
}
