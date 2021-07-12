<template>
  <div>
    <v-list-item-group
      class="sidebar"
      color="primary"
    >
      <div v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
        <v-subheader v-if="item.meta.group" class="text-uppercase text-menu-group">{{ item.meta.group }}</v-subheader>
        <v-list-item v-if="!onlyOneChild.hidden && !onlyOneChild.children && onlyOneChild.meta" :to="resolvePath(item.path)">
          <v-list-item-icon>
            <v-icon v-if="!item.meta.child" v-text="onlyOneChild.meta.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-badge :value="item.meta.title === 'verify_case' && totalPending !== 0" overlap offset-x="25" :content="totalPending" color="#EB5757">
              <v-list-item-title v-text="generateTitle(onlyOneChild.meta.title)" />
            </v-badge>
          </v-list-item-content>
        </v-list-item>
        <div v-if="!onlyOneChild.hidden && onlyOneChild.children">
          <v-list-group
            sub-group
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="generateTitle(onlyOneChild.meta.title)" />
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(crud, i) in onlyOneChild.children"
              :key="i"
              :to="resolvePath(crud.path)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="generateTitle(crud.meta.title)" />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </div>
      </div>
      <div v-else>
        <v-subheader v-if="item.meta.group" class="text-uppercase text-menu-group">{{ item.meta.group }}</v-subheader>
        <v-list-group
          :key="itemPending"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon v-text="item.meta.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="generateTitle(item.meta.title)" />
            </v-list-item-content>
          </template>
          <sidebar-item
            v-for="child in item.children"
            :key="child.path"
            :item="child"
          />
        </v-list-group>
      </div>
    </v-list-item-group>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import generateTitle from '@/utils/generateTitle'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      onlyOneChild: null,
      itemPending: null
    }
  },
  computed: {
    ...mapGetters('reports', [
      'totalPending'
    ])
  },
  watch: {
    totalPending(value) {
      this.itemPending = value
    }
  },
  methods: {
    generateTitle,
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }

      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style scoped>
.text-menu-group {
    color: #BDBDBD !important;
    font-family: Product Sans;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 0em;
    text-align: left;
}
</style>
