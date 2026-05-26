const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆
/**
 * middleware loader
 * @param {object} app Koa实例
 * 
 * @description
 * 加载所有 middlerware  ，可通过‘app.middlewares.${目录}.${文件}’ 访问
 * middlerware 目录结构如下：
 * - app
 *   - middleware
 *    - custom-module
 *      - custom-module.js
 *  => app.middlewares.customModule.customModule
 * 
 * 注意：middlerware 目录下的文件必须导出一个函数，且函数参数必须为 app 实例
*/

module.exports = (app) => {
    // 读取app/middleware/**/**.js  目录下的所有js文件
    const middlewarePath = path.resolve(app.businessPath,`.${sep}middleware`);
    const fileList = glob.sync(middlewarePath, `.${sep}**${sep}**.js`);

    // 遍历所有文件目录，把内容加载到app.middlewares 下
    const middlewares = {};
    fileList.forEach(file => {
        // 读取文件名称
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.js'));
        // 把‘-’变成驼峰，custom-module/custom-module.js => customModule.customModule.js
        name = name.replace(/[_-][a-z]/ig, (s)=> s.substring(1).toUpperCase());
        // 挂载 middleware 到内存 app 对象中
        let tempMiddleware = middlewares;
        const names = name.split(sep);
        for(let i = 0,len = names.length; i < len ; i++) {
            if(i === len - 1) {
                tempMiddleware[names[i]] = require(path.resolve(file))(app);
            } else {
                if(!tempMiddleware[names[i]]) {
                    tempMiddleware[names[i]] = {};
                }
                tempMiddleware = tempMiddleware[names[i]];
            }
        }
    });
    app.middlewares = middlewares;
}