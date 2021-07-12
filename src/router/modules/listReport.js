import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const listReportRouter = {
  path: '/laporan/list',
  component: Layout,
  redirect: '/laporan/list',
  meta: {
    title: 'laporan_title',
    icon: 'library_books',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/laporan/list',
      component: () => import('@/views/laporan/list'),
      meta: {
        title: 'list_case',
        icon: 'mdi-clipboard-text',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    },
    {
      path: '/laporan/detail-report/:id',
      component: () => import('@/views/laporan/detailReportCase'),
      hidden: true,
      meta: {
        title: 'detail_case',
        icon: 'library_books',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    }
  ]
}

export default listReportRouter
