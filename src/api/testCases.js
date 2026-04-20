import request from '@/utils/request'
const url = 'api/test-cases'

/**
* 文件上传 提交
* @param data
* @returns {*}
*/
export function addTest(data) {
  return request ({
    url: `${url}/add/`,
    method: 'post',
    data
  })
}

/**
* 获取列表页
* @param params
* @returns {*}
*/
export function getList(params) {
  return request ({
    url: `${url}/list/`,
    method: 'get',
    params
  })
}

/**
* 获取详情页
* @param params
* @returns {*}
*/
export function getDetail(params) {
  return request ({
    url: `${url}/detail/`,
    method: 'get',
    params
  })
}

/**
* 删除
* @param data
* @returns {*}
*/
export function deleteCase(data) {
  return request ({
    url: `${url}/delete/`,
    method: 'post',
    data
  })
}

/**
* 下载
* @param id
* @returns {*}
*/
export function downloadCase(id) {
  return request ({
    url: `${url}/download?project_id=${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
* 获取模型
* @returns {*}
*/
export function getModel() {
  return request ({
    url: `${url}/model/`,
    method: 'get',
  })
}

/**
* 获取知识库
* @returns {*}
*/
export function getKnowledge() {
  return request ({
    url: `${url}/knowledge/`,
    method: 'get',
  })
}

