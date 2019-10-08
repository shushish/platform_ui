import { login, logout, getUserInfo } from '@/api/system/login'
import { setToken, getToken } from '@/utils/auth'

export default {
  state: {
    userName: '',
    userCode: '',
    userId: '',
    companyName:'',
    companyId:'',
    departmentName:'',
    title:'',
    avatorImgPath: '',
    token: getToken,
    access: '',
    hasGetInfo: false
  },
	getters:{
		userName: state => state.userName,
    companyName: state => state.companyName,
    companyId: state => state.companyId,
    departmentName: state => state.departmentName,
    title: state => state.title,
    userCode: state => state.userCode
	},
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setUserCode (state, userCode){
      state.userCode = userCode
    },
    setCompanyName (state, companyName) {
      state.companyName = companyName
    },
    setCompanyId (state, companyId) {
      state.companyId = companyId
    },
    setDepartmentName (state, name) {
      state.departmentName = name
    },
    setTitle (state, title) {
      state.title = title
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },

  },
  actions: {
    // 登录

    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data;
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            commit('setUserName', data.name);
            commit('setCompanyName', data.companyName);
            commit('setCompanyId', data.companyId);
            commit('setDepartmentName', data.departmentName);
            commit('setTitle', data.title);
            commit('setUserCode', data.userCode);
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
