const glob = require('glob');
const path = require('path');
const { sep } = path; // 兼容不同操作系统上的斜杆
/**
 * extend loader
 * @param {object} app Koa实例
 * 
 * @description
 * 加载所有 extend  ，可通过‘app.extend.${目录}.${文件}’ 访问
 * extend 目录结构如下：
 * - app
 *   - extend
 *     - custom-extend.js
 * 
 *  => app.extend.customExtend 访问
 * 
*/

module.exports = (app) => {
    // 读取app/extend/**.js  目录下的所有js文件
    const extendPath = path.resolve(app.businessPath,`.${sep}extend`);
    const fileList = glob.sync(extendPath, `.${sep}**${sep}**.js`);

    // 遍历所有文件目录，把内容加载到app.extend 下
    fileList.forEach(file => {
        // 读取文件名称
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.js'));
        // 把‘-’变成驼峰，custom-module/custom-extend.js => customModule.customExtend
        name = name.replace(/-([a-z])/g, (s)=> s.substring(1).toUpperCase());
        // 过滤 app 已经存在的key
        for (let key in app){
            if (key === name){
                console.log(`[extend loader error] name:${name} is already in app)`);
                return;
            }
        }
        // 挂载 extend 到 app 上
        app[name] = require(path.resolve(file))(app);
    });
}