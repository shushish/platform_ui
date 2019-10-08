import fetch from '@/utils/fetch'
import qs from 'qs'

export function queryRolePage (pageNum,pageSize,available,key) {
  const params = {pageNum:pageNum,pageSize:pageSize,available:available,key:key};
  return fetch.post("/api/role/queryPage",qs.stringify(params))
}

export function queryRoleList (available,key) {
  const params = {available:available,key:key};
  return fetch.post("/api/role/queryList",qs.stringify(params))
}

export function saveRole (params) {
  return fetch.post("/api/role/save",qs.stringify(params))
}

export function updateRole (params) {
  return fetch.post("/api/role/update",qs.stringify(params))
}

export function removeRole (id) {
  const params = {id:id};
  return fetch.post("/api/role/remove",qs.stringify(params))
}
