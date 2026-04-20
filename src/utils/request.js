import axios from 'axios'

// 获取当前访问的地址（协议+主机+端口）
const currentOrigin = window.location.origin;
console.log('currentOrigin', currentOrigin)
const service = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	// baseURL: `${currentOrigin}`,
  	timeout: 300000
})

service.interceptors.request.use(
	config => {
		// const time = new Date()
		// const onlyKey = time.getTime() + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		// if (config.url.indexOf('?') !== -1) {
		// 	config.url = config.url + '&onlyKey=' + onlyKey
		// } else {
		// 	config.url = config.url + '?onlyKey= ' + onlyKey
		// }
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		const res = response.data

		if (response?.config?.responseType && response?.config?.responseType === 'blob') {
			return response
		}

		if (res.code !== 200) {
      ElMessage.error(res.message || "请求失败，请稍后重试")
      return Promise.reject(res)
		}
		return res
	},
	error => {
		if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      ElMessage.error('网络请求超时，请稍后重试')
		} else {
			ElMessage.error(error.response?.data?.message || '请求失败，请稍后重试')
		}
		return Promise.reject(error)
	}
)

export default service


