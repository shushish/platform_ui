import login from '_v/auth/login'
import main from '_c/main'

const home =  () => import( /* webpackChunkName: 'home' */'_v/home/home');
const allSearch =  () => import( /* webpackChunkName: 'allSearch' */'_v/home/allSearch');
const showProject =  () => import( /* webpackChunkName: 'allSearch' */'_v/home/showProject');
const mailBox =  () => import( /* webpackChunkName: 'allSearch' */'_v/home/mailBox');

const user =  () => import( /* webpackChunkName: 'home' */'_v/system/user');
const role =  () => import(/* webpackChunkName: 'home' */'_v/system/role');
const permission =  () => import( /* webpackChunkName: 'home' */'_v/system/permission');
const dictionary =  () => import( /* webpackChunkName: 'home' */'_v/system/dictionary');
const department =  () => import( /* webpackChunkName: 'home' */'_v/system/department');
const company = () => import(/* webpackChunkName: 'home' */'_v/system/company');
const factory = () => import(/* webpackChunkName: 'home' */'_v/system/factory');

const test = () => import(/* webpackChunkName: 'support' */'_v/test');

export default [
  {
    path: '/login', name: 'login', component: login, meta: {title: 'RCMmaker - 登录',noBack:true}
  },
  {
    path: '/', name: '_home',redirect: '/home', component: main,
    children:[
      {path: '/home', name: 'home', component: home, meta: {title: '首页',noBack:true,requireAuth:true}},
	    {path: '/allSearch', name: 'allSearch', component: allSearch, meta: {title: '全局搜索',noBack:true,requireAuth:true}},
      {path: '/showProject', name: 'showProject', component: showProject, meta: {title: '统计信息',noBack:true,requireAuth:true}},
      {path: '/mailBox', name: 'mailBox', component: mailBox, meta: {title: '市场信箱',noBack:true,requireAuth:true}}
    ]
  },
  {
    path: '/system', name: 'system',meta:{title:'系统管理'}, component: main,
    children:[
      {path: 'user', name: 'user_manager', component: user, meta: {title: '用户管理',noBack:true,requireAuth:true}},
      {path: 'role', name: 'role_manager', component: role, meta: {title: '角色管理',noBack:true,requireAuth:true}},
      {path: 'permission', name: 'permission', component: permission, meta: {title: '资源管理',noBack:true,requireAuth:true}},
      {path: 'dictionary', name: 'dictionary', component: dictionary, meta: {title: '字典管理',noBack:true,requireAuth:true}},
      {path: 'department', name: 'department', component: department, meta: {title: '部门管理',noBack:true,requireAuth:true}},
      {path: 'company', name: 'company_manager', component: company, meta: {title: '公司管理',noBack:true,requireAuth:true}},
      {path: 'factory', name: 'factory', component: factory, meta: {title: '工厂管理',noBack:true,requireAuth:true}},
    ]
  },
	{
		path: '/test', name: 'test', component: test
	}
]
