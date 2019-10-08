import fetch from '@/utils/fetch'
import qs from 'qs'

export function queryCompanyPage(pageNum,pageSize,key) {
	const params = {pageNum:pageNum,pageSize:pageSize,key:key};
  return fetch.post("/api/company/queryPage", qs.stringify(params));
}

export function queryCompany(key,isAll) {
	const params = {key:key,isAll:isAll};
  return fetch.post("/api/company/queryList", qs.stringify(params));
}

export function saveCompany(company) {
  return fetch.post("/api/company/save", qs.stringify(company));
}

export function updateCompany(company) {
  return fetch.post("/api/company/update", qs.stringify(company));
}

export function removeCompany(id) {
	const params = {id:id};
  return fetch.post("/api/company/delete", qs.stringify(params));
}

export function queryIsAllCompanyList() {
  return fetch.post("/api/company/queryIsAllCompanyList");
}
