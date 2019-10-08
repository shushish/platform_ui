import Cookies from 'js-cookie'
import {queryPermission,queryPermissionTree} from "@api/system/auth"

const TokenKey = 'Admin-Token'
const menu_key = "menus"

export const getToken = () => {
  return Cookies.get(TokenKey)
}

export const setToken = token => {
  return Cookies.set(TokenKey, token)
}

export const removeToken = () => {
  return Cookies.remove(TokenKey)
}

export const  loadMenu = () => {
  return new Promise((resolve, reject) => {
    queryPermissionTree("menu").then(res => {
        localStorage.setItem(menu_key,JSON.stringify(res.data));
        resolve(res.data)
      },error =>{
        reject(error);
      })
  })
}

export const  getMenu = () => {
  let menu = localStorage.getItem(menu_key);
  return JSON.parse(menu);
}

const auth_key = "auth-key";
export const getAuth = () => {
  return JSON.parse(localStorage.getItem(auth_key))
}

export const loadAuth = () =>{
  return new Promise((resolve, reject) => {
    queryPermission("button").then(res => {
      let auths = [];
      res.data.forEach(item => {
        auths.push(item.perCode);
      })
      setAuth(auths);
      resolve(res.data)
    },error =>{
      reject(error);
    })
  })
}
export const setAuth = auth => {
  return localStorage.setItem(auth_key,JSON.stringify(auth));
}

export const isAuth = perCode => {
  var auths = getAuth();
  if(auths.indexOf(perCode)  === -1){
    return false;
  }
  return true;
}









