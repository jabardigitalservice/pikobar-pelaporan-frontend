import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const rdtRouter = {
  path: '/rdt',
  component: Layout,
  redirect: '/rdt/list',
  meta: {
    group: 'Testing',
    title: 'rdt',
    icon: 'mdi-clipboard-check',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/rdt/create',
      component: () => import('@/views/rdt/newInput'),
      meta: {
        title: 'create_rdt',
        icon: 'mdi-book-plus',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    },
    {
      path: '/rdt/list',
      component: () => import('@/views/rdt/list'),
      meta: {
        title: 'list_rdt',
        icon: 'mdi-book-plus',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    },
    {
      path: '/rdt/update/:id',
      component: () => import('@/views/rdt/formRapid'),
      hidden: true,
      meta: {
        title: 'create_rdt',
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    }
  ]
}

export default rdtRouter
