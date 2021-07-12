import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const listVerificationReportRouter = {
  path: '/laporan-verification',
  component: Layout,
  redirect: '/laporan-verification',
  meta: {
    title: 'laporan_title',
    icon: 'library_books',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/laporan-verification',
      component: () => import('@/views/laporan/verification'),
      meta: {
        title: 'verify_case',
        icon: 'library_books',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESKOTA]
      }
    },
    {
      path: '/laporan-verification',
      component: () => import('@/views/laporan/verification'),
      meta: {
        title: 'verification_case_list',
        icon: 'library_books',
        child: true,
        noCache: true,
        roles: [rolesPerm.FASKES]
      }
    }
  ]
}

export default listVerificationReportRouter
