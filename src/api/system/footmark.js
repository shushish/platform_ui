import fetch from '@/utils/fetch'
import qs from 'qs'


export function queryFootmarkPage(pageNum,pageSize,id) {
	const params = {pageNum:pageNum,pageSize:pageSize,id:id};
  return fetch.post("/api/footmark/listPage", qs.stringify(params));
}













