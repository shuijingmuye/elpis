const koa = require('koa');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆

const env = require('./env');

const configLoader = require('./loader/config');
const controllerLoader = require('./loader/controller');
const extendLoader = require('./loader/extend');
const middlerwareLoader = require('./loader/middleware');
const serviceLoader = require('./loader/service');
const routerLoader = require('./loader/router');
const routerSchemaLoader = require('./loader/router-schema');

module.exports = {
    /**
     * 启动项目
     * @param {*} options // 项目配置
     */
    start (options = {}) {
        // Koa实例
        const app = new koa();

        // 应用配置
        app.options = options;

        // 基础路径
        app.baseDir = process.cwd();

        // 业务文件路径
        app.businessPath = path.resolve(app.baseDir,`.${sep}app`);

        // 初始化环境配置
        app.env = env();
        console.log(`当前环境：，${app.env.get()}`);

        // 加载 middlerware
        middlerwareLoader(app);
        console.log('--[start]-- load middlerware done');
        
        // 加载 config
        configLoader(app);
        console.log('--[start]-- load config done');

        // 加载 controller
        controllerLoader(app);
        console.log('--[start]-- load controller done');

        // 加载 service
        serviceLoader(app);
        console.log('--[start]-- load service done');
        
        // 加载 extend
        extendLoader(app);
        console.log('--[start]-- load extend done');

        // 加载 router schema
        routerSchemaLoader(app);
        console.log('--[start]-- load router schema done');

        // 注册全局中间件
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app);
            console.log('--[start]-- load appMiddleware done');
        } catch (e) {
            console.log(`[exception] there is no middleware file`);
        }

        // 加载 router
        routerLoader(app);

        try {
            const port = process.env.PORT || 8080;
            const host = process.env.IP || '0.0.0.0';
            app.listen(port,host);
            console.log(`Server is running at http://${host}:${port}`)
        }catch (e){
            console.error(e);
        }
    }
}

