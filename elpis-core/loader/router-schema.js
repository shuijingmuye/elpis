
// const { pa } = require('element-plus/es/locale/index.mjs');
const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆

/**
 * router schema loader
 * @param {object} app koa 实例
 * 
 * 通过 ‘json-schema && ajv’ 对 API 规则进行约束，配合 api-params-verify 中间件使用
 *
 * app/router-schema/**.js
 *   输出：
 *   app.routerSchema = {
 *     '${api1}': ${jsonSchema},
 *     '${api2}': ${jsonSchema},
 *     '${api3}': ${jsonSchema}
 *   }
 * 
*/
module.exports = (app) => {
    // 读取app/router-schema/**/**.js  所有js文件
    const routerSchemaPath = path.resolve(app.businessPath,`.${sep}router-schema`);
    const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`));
    
    // 注册所有 routerSchema ,使得可以 'app.routerSchema' 这样访问
    let routerSchema = {};
    fileList.forEach(file => {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        };
    });
    app.routerSchema = routerSchema;
}