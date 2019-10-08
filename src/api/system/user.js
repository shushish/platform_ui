import fetch from '@/utils/fetch'
import qs from 'qs'

export function queryUserPage (pageNum,pageSize,locked,key) {
  const params = {pageNum:pageNum,pageSize:pageSize,locked:locked,key:key};
  return fetch.post("/api/user/queryPage",qs.stringify(params))
}

export function queryUserList (locked,key,companyId) {
  const params = {locked:locked,key:key,companyId:companyId};
  return fetch.post("/api/user/queryList",qs.stringify(params))
}

export function userExport (locked,key,companyId) {
  const params = {locked:locked,key:key,companyId:companyId};
  return fetch({method: 'POST',url: '/api/user/userExport',data: params,responseType: 'blob'});
}

export function queryUserTree (locked,key,companyId) {
  const params = {locked:locked,key:key,companyId:companyId};
  return fetch.post("/api/user/queryUserTree",qs.stringify(params))
}

export function saveUser (params) {
  return fetch.post("/api/user/save",qs.stringify(params))
}

export function updateUser (params) {
  return fetch.post("/api/user/update",qs.stringify(params))
}

export function resetPwd (id) {
  const params = {id:id};
  return fetch.post("/api/user/resetPwd",qs.stringify(params))
}

export function removeUser (id) {
  const params = {id:id};
  return fetch.post("/api/user/remove",qs.stringify(params))
}

export function getUser (id) {
  const params = {id:id};
  return fetch.post("/api/user/getUser",qs.stringify(params))
}

export function updatePwd (newPwd,oldPwd){
	const params = {newPwd:newPwd,oldPwd:oldPwd};
	return fetch.post("/api/user/updatePwd",qs.stringify(params));
}

export function locked (params){
	return fetch.post("/api/user/locked",qs.stringify(params));
}

export function unLocked (params){
	return fetch.post("/api/user/unLocked",qs.stringify(params));
}
export function getChiefId(userId){
  const params = {userId:userId};
  return fetch.post("/api/user/getChiefId",qs.stringify(params));
}
export function initOwnerNameAndManageNameByLoginId(){
	 return fetch.post("/api/user/initOwnerNameAndManageNameByLoginId");
}
export function initProjectOwnerUserArray(){
	 return fetch.post("/api/user/initProjectOwnerUserArray");
}
