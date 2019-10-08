import fetch from '@/utils/fetch'
import qs from 'qs'

export const getTableData = (available,parameter) => {
  const parameters = {available:available,parameter:parameter};
  return fetch.post("/api/permission/list", qs.stringify(parameters)
  )
}

export const getList = (available,parameter,type) => {
  const parameters = {available:available,parameter:parameter,type:type};
  return fetch.post("/api/permission/getList", qs.stringify(parameters)
  )
}

export function savePermission (parameters) {
  return fetch.post("/api/permission/add", qs.stringify(parameters)
  )
}

export function updatePermission (parameters) {
  return fetch.post("/api/permission/update", qs.stringify(parameters)
  )
}

export function deletePermission (id) {
  const parameters = {id:id};
  return fetch.post("/api/permission/delete", qs.stringify(parameters)
  )
}

