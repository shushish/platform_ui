import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { getToken } from '@/utils/auth'
import config from '@/config'
import iView from 'iview'
const { homeName } = config

Vue.use(Router)

const router = new Router({
	base:'/pc/',
  routes
  ,scrollBehavior (to, from, savedPosition) {    // 从第二页返回首页时savedPosition为undefined
      if (savedPosition || typeof savedPosition === 'undefined') {      // 只处理设置了路由元信息的组件
        from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : false
        to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : true
        if (savedPosition) {
          return savedPosition
        }
      } else {
        from.meta.keepAlive = typeof from.meta.keepAlive === 'undefined' ? undefined : true
        to.meta.keepAlive = typeof to.meta.keepAlive === 'undefined' ? undefined : false
      }
  }
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  const token = getToken()

  iView.LoadingBar.start()
  // var interceptUri = ['/handle','/login']
  // if (interceptUri.indexOf(to.path)  !== -1 && getToken()) {
  //   // 用户使用后退返回到授权页，则默认回到首页
  //   next('/home')
  //   return false
  // }
  if(to.path == '/'){
    next({name:homeName})
    return false
  }
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (!token) {
      next({name:LOGIN_PAGE_NAME})
      return false
    }  else {
      next()
      return false
    }
  }
  next()
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router;
