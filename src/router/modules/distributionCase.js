import Layout from '@/layout/distributionCase'
import {
  rolesPerm
} from '@/utils/constantVariable'

const distributionCaseRouter = {
  path: '/distribution-case',
  component: Layout,
  redirect: '/distribution-case/network',
  meta: {
    title: 'distribution_case',
    icon: 'mdi-map',
    roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
  },
  active: false,
  children: [
    {
      path: '/distribution-case/map',
      component: () => import('@/views/distributionCase/mapv2'),
      meta: {
        title: 'distribution_case_map',
        icon: 'mdi-map-marker-radius',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    },
    {
      path: '/distribution-case/network',
      component: () => import('@/views/distributionCase/networkv2'),
      meta: {
        title: 'distribution_case_network',
        icon: 'location_on',
        child: true,
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA, rolesPerm.FASKES]
      }
    },
    {
      path: '/distribution-case/network/:id',
      component: () => import('@/views/distributionCase/network_detail'),
      hidden: true,
      meta: {
        title: 'distribution_case_network',
        icon: 'location_on',
        noCache: true,
        roles: [rolesPerm.ADMIN, rolesPerm.DINKESPROV, rolesPerm.DINKESKOTA]
      }
    }
  ]
}

export default distributionCaseRouter
