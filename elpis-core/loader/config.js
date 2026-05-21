const path = require('path');
// const { env, config } = require('process');
const { sep } = path; // 兼容不同操作系统上的斜杆

/**
 * config loader
 * @param {object} app koa实例
 * 
 * 配置区分 本地/测试/生产， 通过 env 环境读取不同文件配置 env.config
 * 通过 env.config 覆盖default.config 加载到 app.config 中
 * 
 * 目录下对应的config 配置
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.beta.js
 * 生成配置 config/config.prod.js
 * 
 */
module.exports = (app) => {
    // 找到 config/ 目录
    const configPath = path.resolve(app.baseDir,`.${sep}config`);

    // 获取 default.config
    let defaultConfig = {};
    try {
        defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`));
    } catch(e) {
        console.log('[exception] there is no default.config file');
    }

    // 获取 env.confg
    let envConfig = {};
    try {
        if (app.env.isLocal()) { // 本地环境
            envConfig = require(path.resolve(configPath,`.${sep}config.local.js`));
        } else if (app.env.isBeta()) { // 测试环境
            envConfig = require(path.resolve(configPath,`.${sep}config.beta.js`));
        } else if (app.env.isProduction()) { // 生产环境
            envConfig = require(path.resolve(configPath,`.${sep}config.prod.js`));
        }
    } catch (error) {
        console.log('[exception] there is no env.config file');
    }

    // 覆盖并加载 config 配置
    app.config = Object.assign({}, defaultConfig,envConfig);
}