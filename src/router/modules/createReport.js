import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const createReportRouter = {
  path: '/laporan-create',
  component: Layout,
  redirect: '/laporan-create',
  meta: {
    group: 'Tracing',
    title: 'laporan_title',
    icon: 'library_books',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/laporan-create',
      component: () => import('@/views/laporan/newFormCreateReport'),
      meta: {
        title: 'laporan_create',
        icon: 'mdi-note-plus-outline',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    }
  ]
}

export default createReportRouter
