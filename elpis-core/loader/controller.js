const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆
/**
 * controller loader
 * @param {object} app Koa实例
 * 
 * @description
 * 加载所有 controller  ，可通过‘app.controller.${目录}.${文件}’ 访问
 * controller 目录结构如下：
 * - app
 *   - controller
 *    - custom-module
 *      - custom-controller.js
 *  => app.controller.customModule.customController
 * 
 * 注意：controller 目录下的文件必须导出一个函数，且函数参数必须为 app 实例
*/

module.exports = (app) => {
    // 读取app/controller/**/**.js  目录下的所有js文件
    const controllerPath = path.resolve(app.businessPath,`.${sep}controller`);
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`));
    // 遍历所有文件目录，把内容加载到app.controller 下
    const controller = {};
    fileList.forEach(file => {
        // 读取文件名称
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.js'));
        // 把‘-’变成驼峰，custom-module/custom-controller.js => customModule.customController
        name = name.replace(/[_-][a-z]/ig, (s)=> s.substring(1).toUpperCase());
        // 挂载 controller 到内存 app 对象中
        let tempController = controller;
        const names = name.split(sep); // [ customModule(目录), customController(文件) ]
        for(let i = 0,len = names.length; i < len ; i++) {
            if(i === len - 1) {
                const controllerModule = require(path.resolve(file))(app);
                tempController[names[i]] = new controllerModule();
            } else {
                if(!tempController[names[i]]) {
                    tempController[names[i]] = {};
                }
                tempController = tempController[names[i]];
            }
        }
    });
    app.controller = controller;
}