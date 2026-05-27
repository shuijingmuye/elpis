const koaNunjucks = require('koa-nunjucks-2');
const path = require('path');

module.exports = (app)=>{
    // 配置静态根目录
    const KoaStatic = require('koa-static');
    app.use(KoaStatic(path.resolve(process.cwd(), './app/public')));
    // 模版渲染引擎
    app.use(koaNunjucks({
        ext: "tpl", // 模板文件后缀
        // path: path.join(app.businessPath, 'app/public'),
        path: path.resolve(process.cwd(), './app/public'), // 模板文件路径
        nunjucksConfig: {
            noCache: true,
            trimBlocks: true,
            lstripBlocks: true
        }
    }));

    // 引入 ctx.body 解析中间件
    const bodyParser = require('koa-bodyparser');
    app.use(bodyParser({
        formList: '1000mb',
        enableTypes: [ 'form', 'json', 'text' ]
    }));

    // 引入异常捕获中间件
    app.use(app.middlewares.errorHandler);

    // 引入签名合法性校验中间件
    app.use(app.middlewares.apiSignVerify);

    // 引入参数校验中间件
    app.use(app.middlewares.apiParamsVerify);
}