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
}