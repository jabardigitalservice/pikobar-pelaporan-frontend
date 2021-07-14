import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const dailyReportRouter = {
  path: '/daily-report',
  component: Layout,
  redirect: '/daily-report',
  meta: {
    title: 'daily_report',
    icon: 'mdi-calendar',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/daily-report',
      component: () => import('@/views/laporan/dailyReport'),
      meta: {
        title: 'daily_report',
        icon: 'mdi-calendar',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    }
  ]
}

export default dailyReportRouter
