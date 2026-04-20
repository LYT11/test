import request from '@/utils/request'
const url = 'api/analysis-demand'

/**
* 获取列表页
* @param params
* @returns {*}
*/
export const getList = (params) => {
	return request ({
		url: `${url}/list/`,
		method: 'get',
		params
	})
}

/**
* 新增
* @param params
* @returns {*}
*/
export const createMaterial = (data) => {
	return request ({
		url: `${url}/create/`,
		method: 'post',
		data
	})
}

/**
* 删除
* @param params
* @returns {*}
*/
export const deleteMaterial = (id) => {
	return request ({
		url: `${url}/delete/${id}/`,
		method: 'delete'
	})
}

/**
* 详情
* @param params
* @returns {*}
*/
export const getDetail = (id) => {
	return request ({
		url: `${url}/detail/${id}/`,
		method: 'get'
	})
}