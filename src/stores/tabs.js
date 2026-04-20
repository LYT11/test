import { defineStore } from 'pinia';

export const useTabsStore = defineStore('tabs', {
	state: () => {
		return {
			list: []
		};
	},
	getters: {
		show: state => {
			return state.list.length > 0;
		},
		nameList: state => {
			return state.list.map(item => item.name);
		}
	},
	actions: {
		delTabsItem(index) {
			this.list.splice(index, 1);
		},
		setTabsItem(data) {
			this.list.push(data);
		},
		clearTabs() {
			this.list = [];
		},
		closeTabsOther(data) {
			this.list = data;
		},
		closeCurrentTag(data) {
			for (let i = 0, len = this.list.length; i < len; i++) {
				const item = this.list[i];
				if (item.path === data.$route.fullPath) {
					if (i < len - 1) {
						data.$router.push(this.list[i + 1].path);
					} else if (i > 0) {
						data.$router.push(this.list[i - 1].path);
					} else {
						data.$router.push('/');
					}
					this.list.splice(i, 1);
					break;
				}
			}
		}
	}
});
