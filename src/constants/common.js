export const STATUS_OPTIONS = [
  { value: 1, label: '完成', type: 'success' },
  { value: 2, label: '进行中', type: 'primary' },
  { value: 3, label: '失败', type: 'danger' },
]

export const BUSINESS_TYPE_OPTIONS = [
  { value: 1, label: '测试方案' },
  { value: 2, label: '测试报告' },
]

export const REPORT_TYPE_OPTIONS = [
  { value: 1, label: '出厂/验收报告' },
  { value: 2, label: '入网安评' },
  { value: 3, label: '源码审计' },
]

// Content-Type 映射表
export const TYPE_MAP = {
  'application/vnd.ms-excel': 'xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/pdf': 'pdf',
  'application/msword': 'docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}
