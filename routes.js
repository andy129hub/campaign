const routes = require('next-routes')();  // 加() 代表立即执行

// :变量名

routes
.add('/campaigns/new','/campaigns/new')
.add('/campaigns/:address','/campaigns/show')
.add('/campaigns/:address/requests','/campaigns/requests/index')
.add('/campaigns/:address/requests/new','/campaigns/requests/new')


/*  添加跳转路径
routes
.add('about')
.add('blog', '/blog/:slug')
.add('user', '/user/:id', 'profile')
.add('/:noname/:lang(en|es)/:wow+', 'complex')
.add({name: 'beta', pattern: '/v3', page: 'v3'})

*/

module.exports = routes;
