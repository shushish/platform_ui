import fetch from '@/utils/fetch'
import qs from 'qs'

export function queryFactoryPage(pageNum,pageSize,key) {
	const params = {pageNum:pageNum,pageSize:pageSize,key:key};
  return fetch.post("/api/factory/queryPage", qs.stringify(params));
}

export function queryFactory(key) {
	const params = {key:key};
  return fetch.post("/api/factory/queryList", qs.stringify(params));
}

export function saveFactory(factory) {
  return fetch.post("/api/factory/save", qs.stringify(factory));
}

export function updateFactory(factory) {
  return fetch.post("/api/factory/update", qs.stringify(factory));
}

export function removeFactory(id) {
	const params = {id:id};
  return fetch.post("/api/factory/delete", qs.stringify(params));
}

export function findFactoryByCode(facode){
	const params = {facode:facode};
	return fetch.post("/api/factory/findFactoryByCode", qs.stringify(params));
}