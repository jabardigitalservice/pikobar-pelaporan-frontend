import Layout from '@/layout'
import {
  rolesPerm
} from '@/utils/constantVariable'

const submissionLogistikRouter = {
  path: '/submission-logistik',
  component: Layout,
  redirect: '/submission-logistik/create',
  meta: {
    group: 'Lainnya',
    title: 'submission_Logistics',
    icon: 'mdi-archive',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/submission-logistik/create',
      component: () => import('@/views/logistik/submissionLogistik'),
      meta: {
        title: 'submission_Logistics',
        icon: 'mdi-archive',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    }
  ]
}

export default submissionLogistikRouter
