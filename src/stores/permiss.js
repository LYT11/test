import { defineStore } from 'pinia'

export const usePermissStore = defineStore('permiss', {
  state: () => {
    const defaultList = {
      admin: ['0', '1', '2', '3', '4', '5', '7', '8'],
      user: ['0', '1', '2', '3', '4', '5', '7', '8'],
    }
    const username = localStorage.getItem('vuems_name')
    return {
      key: username == 'admin' ? defaultList.admin : defaultList.user,
      defaultList,
    }
  },
  actions: {
    handleSet(val) {
      this.key = val
    },
  },
})
