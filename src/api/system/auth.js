import fetch from '@/utils/fetch'
import qs from 'qs'


export function queryPermission (type) {
  const params = {type};
  return fetch({
    url: '/api/user/queryPermission',
    method: 'post',
    params
  })
}
export function queryPermissionTree (type) {
  const params = {type};
  return fetch({
    url: '/api/user/queryPermissionTree',
    method: 'post',
    params
  })
}
// export function getMenu () {
//   return new Promise((resolve, reject) => {
//     let menu =
//       [
//         {"perId":2,"name":"首页","type":"menu","path":"/home","perCode":"home","parentId":1,"parentIds":"/1","clazz":"md-home","sortString":"1."},
//         {"perId":3,"name":"系统管理","type":"menu","path":"/home","perCode":"system","parentId":1,"parentIds":"/1","clazz":"md-settings","sortString":"2.",
//           "children":
//             [
//               {"perId":11,"name":"用户管理","type":"menu","path":"/system/user","perCode":"user_manager","parentId":2,"parentIds":"/1/3","clazz":"md-contact","sortString":"1."},
//               {"perId":12,"name":"角色管理","type":"menu","path":"/system/role","perCode":"role_manager","parentId":2,"parentIds":"/1/3","clazz":"md-contacts","sortString":"2."},
//               {"perId":13,"name":"资源管理","type":"menu","path":"/system/permission","perCode":"permission","parentId":2,"parentIds":"/1/3","clazz":"md-menu","sortString":"3."},
//               {"perId":14,"name":"字典管理","type":"menu","path":"/system/dictionary","perCode":"dictionary","parentId":2,"parentIds":"/1/3","clazz":"md-paper","sortString":"4."},
//             ]
//         }
//     ]
//     resolve({data:{menu,auth:[]}});
//   });
// }
