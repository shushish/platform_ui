import fetch from '@/utils/fetch'
import qs from 'qs'

export function saveDepartmentTask (depTask) {
  return fetch.post("/api/department/saveDepartmentTask", qs.stringify(depTask));
}

export function getDepartmentTask (departmentId) {
  const params = {departmentId:departmentId};
  return fetch.post("/api/department/getDepartmentTask", qs.stringify(params));
}

export function getDepaertmentData (state,parameter) {
  const parameters = {state:state,parameter:parameter};
  return fetch.post("/api/department/queryDep", qs.stringify(parameters)
  )
}

export function getDepaertment (state,parameter) {
  const parameters = {state:state,parameter:parameter};
  return fetch.post("/api/department/queryList", qs.stringify(parameters)
  )
}

export function addDepaertment (parameters) {
  return fetch.post("/api/department/add", qs.stringify(parameters)
  )
}

export function updateDepaertment (parameters) {
  return fetch.post("/api/department/update", qs.stringify(parameters)
  )
}


export function deleteDepartment (id) {
  const parameters = {id:id};
  return fetch.post("/api/department/delete", qs.stringify(parameters)
  )
}
