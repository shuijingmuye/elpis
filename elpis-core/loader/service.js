const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆
/**
 * service loader
 * @param {object} app Koa实例
 * 
 * @description
 * 加载所有 service  ，可通过‘app.service.${目录}.${文件}’ 访问
 * service 目录结构如下：
 * - app
 *   - service
 *    - custom-module
 *      - custom-service.js
 *  => app.service.customModule.customService
 * 
*/

module.exports = (app) => {
    // 读取app/service/**/**.js  目录下的所有js文件
    const servicePath = path.resolve(app.businessPath,`.${sep}service`);
    const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));

    // 遍历所有文件目录，把内容加载到app.service 下
    const service = {};
    fileList.forEach(file => {
        // 读取文件名称
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.js'));
        // 把‘-’变成驼峰，custom-module/custom-service.js => customModule.customService
        name = name.replace(/[_-][a-z]/ig, (s)=> s.substring(1).toUpperCase());
        // 挂载 service 到内存 app 对象中
        let tempService = service;
        const names = name.split(sep); // [ customModule(目录), customService(文件) ]
        for(let i = 0,len = names.length; i < len ; i++) {
            if(i === len - 1) {
                const controllerModule = require(path.resolve(file))(app);
                tempService[names[i]] = new controllerModule();
            } else {
                if(!tempService[names[i]]) {
                    tempService[names[i]] = {};
                }
                tempService = tempService[names[i]];
            }
        }
    });
    app.service = service;
}