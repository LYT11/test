import { defineStore } from 'pinia';

export const usePermissStore = defineStore('permiss', {
	state: () => {
		const defaultList = {
			admin: [
				'0', '1', '2', '8'
			],
			user: ['0', '1', '2', '8'],
		};
		const username = localStorage.getItem('vuems_name');
		console.log('username', username);
		return {
			key: (username == 'admin' ? defaultList.admin : defaultList.user),
			defaultList,
		};
	},
	actions: {
		handleSet(val) {
			this.key = val;
		},
	},
});
