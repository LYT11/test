export const menuData = [
  {
    id: '0',
    title: '系统首页',
    index: '/dashboard',
    icon: 'Odometer',
  },
  {
    id: '1',
    title: '物料研判',
    index: '/materialAnalysis',
    icon: 'DocumentAdd',
  },
  {
    id: '2',
    title: '用例生成',
    index: '/testCases',
    icon: 'Tickets',
  },
  {
    id: '7',
    index: 'external_link',
    title: '缺陷检测',
    icon: 'Link',
    isExternal: true,
    externalUrl: 'http://127.0.0.1:18789/chat?session=main',
    target: '_blank',
  },
  // {
  // 	id: '8',
  // 	index: '/external-iframe',
  //   title: '缺陷检测',
  //   icon: 'Link',
  //   isIframe: true,
  //   iframeUrl: 'http://127.0.0.1:18789/chat?session=main',
  // },
  {
    id: '3',
    title: '文档生成',
    index: '/test',
    icon: 'Folder', // 可换成 Monitor、Grid 等任意图标
    children: [
      {
        id: '4',
        title: '测试方案',
        index: '/test/plan',
        icon: 'Document',
      },
      {
        id: '5',
        title: '测试报告',
        index: '/test/report',
        icon: 'Memo',
      },
      {
        id: '6',
        title: '模板管理',
        index: '/test/template',
        icon: 'Memo',
      },
    ],
  },
]
