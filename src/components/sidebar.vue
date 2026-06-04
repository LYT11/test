<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      :background-color="sidebar.bgColor"
      :text-color="sidebar.textColor"
      @select="handleSelect"
    >
      <template v-for="item in menuData" :key="item.index">
        <template v-if="item.children">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.id">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-sub-menu
                v-if="subItem.children"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.id"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.children"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.id">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.id">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSidebarStore } from '../stores/sidebar'
import { useRoute, useRouter } from 'vue-router'
import { menuData } from '@/components/menu'

const route = useRoute()
const router = useRouter()
const onRoutes = computed(() => {
  return route.path
})

const sidebar = useSidebarStore()

// 打开外链的方法
const openExternalLink = (item) => {
  const { externalUrl, target = '_blank' } = item
  if (externalUrl) {
    window.open(externalUrl, target)
  } else {
    console.warn('外链菜单缺少 externalUrl 配置', item)
  }
}

const findMenuItem = (items, targetIndex) => {
  for (const item of items) {
    if (item.index === targetIndex) return item
    if (item.children) {
      const found = findMenuItem(item.children, targetIndex)
      if (found) return found
    }
  }
  return null
}

const handleSelect = (index) => {
  const menuItem = findMenuItem(menuData, index)
  if (!menuItem) return
  if (menuItem.isExternal) {
    openExternalLink(menuItem)
  } else if (menuItem.isIframe) {
    router.push({
      path: menuItem.index,
      query: { url: menuItem.iframeUrl },
    })
  } else if (menuItem.index) {
    router.push(menuItem.index)
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}

.sidebar-el-menu {
  min-height: 100%;
}
</style>
