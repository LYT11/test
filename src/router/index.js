import { createRouter, createWebHistory } from 'vue-router'
import { usePermissStore } from '../stores/permiss';
import Home from '../views/home.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
					path: '/dashboard',
					name: 'dashboard',
					meta: {
						title: '系统首页',
						noAuth: true,
					},
					component: () => import('../views/dashboard.vue'),
        },
        {
					path: '/materialAnalysis',
					name: 'materialAnalysis',
					meta: {
						title: '物料研判',
						noAuth: true,
					},
					component: () => import('../views/materialAnalysis/index.vue'),
        },
        {
					path: '/materialAnalysis/add',
					name: 'materialAdd',
					meta: {
						title: '新增物料研判',
						hide: true,
						noAuth: true,
					},
					component: () => import('../views/materialAnalysis/add.vue'),
        },
        {
					path: '/materialAnalysis/detail/:id?',
					name: 'materialDetail',
					meta: {
						title: '物料研判详情',
						hide: true,
						noAuth: true,
					},
					component: () => import('../views/materialAnalysis/detail.vue'),
				},
				{
					path: '/testCases',
					name: 'testCases',
					meta: {
						title: '用例生成',
						noAuth: true,
					},
					component: () => import('../views/testCases/index.vue'),
				},
				{
					path: '/testCases/detail',
					name: 'testCasesDetail',
					meta: {
						title: '用例生成详情',
						hide: true,
						noAuth: true,
					},
					component: () => import('../views/testCases/detail.vue'),
				},
        {
					path: '/pageone',
					name: 'pageone',
					meta: {
						title: '页面1',
						noAuth: true,
					},
					component: () => import('../views/pageOne/index.vue'),
        },
        
        {
					path: '/theme',
					name: 'theme',
					meta: {
						title: '主题设置',
						permiss: '7',
					},
					component: () => import('../views/theme.vue'),
        },
      ],
    },

    {
			path: '/403',
			meta: {
				title: '没有权限',
				noAuth: true,
			},
			component: () => import('../views/403.vue'),
    },
    {
			path: '/404',
			meta: {
				title: '找不到页面',
				noAuth: true,
			},
			component: () => import('../views/404.vue'),
    },
    { path: '/:path(.*)', redirect: '/404' }
  ],
})

router.beforeEach((to, from) => {
	// NProgress.start();
	// const role = localStorage.getItem('vuems_name');
	const permiss = usePermissStore();
	if (typeof to.meta.permiss == 'string' && !permiss.key.includes(to.meta.permiss)) {
		// 如果没有权限，则进入403
		return '/403';
	} else {
		return true
	}
});

export default router
