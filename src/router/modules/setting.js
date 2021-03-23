import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const settingRouter = {
  path: '/setting',
  component: Layout,
  redirect: '/user/list',
  meta: {
    title: 'setting',
    icon: 'mdi-settings',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA]
  },
  active: false,
  children: [
    {
      path: '/user/list',
      component: () => import('@/views/user/list'),
      meta: {
        title: 'user_management',
        icon: 'mdi-account-multiple',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA]
      }
    },
    {
      path: '/user/create',
      component: () => import('@/views/user/formUser'),
      hidden: true,
      meta: {
        title: 'user_create',
        icon: 'mdi-book-plus',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA]
      }
    },
    {
      path: '/user/detail/:id',
      component: () => import('@/views/user/detail'),
      hidden: true,
      meta: {
        title: 'user_detail',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA]
      }
    },
    {
      path: '/user/edit/:id',
      component: () => import('@/views/user/editUser'),
      hidden: true,
      meta: {
        title: 'user_edit',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA]
      }
    },
    {
      path: '/user/update',
      component: () => import('@/views/user/editUser'),
      hidden: true,
      meta: {
        title: 'user_edit',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    },
    {
      path: '/change-password/:id',
      component: () => import('@/views/changePassword/index'),
      hidden: true,
      meta: {
        title: 'change_password',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN]
      }
    }
  ]
}

export default settingRouter
