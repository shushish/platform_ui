import fetch from '@/utils/fetch'
import qs from 'qs'

export function login ({userName,password}) {
  const params = {userCode:userName,password:password};
  return fetch.post("/api/auth/login",qs.stringify(params))
}
export function getUserInfo () {
  return fetch({
    url: '/api/auth/getUserInfo',
    method: 'post'
  })
}
export function logout () {
  return fetch({
    url: '/api/auth/logout',
    method: 'get'
  })
}
