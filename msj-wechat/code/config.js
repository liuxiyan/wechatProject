const host = 'https://ssl.jiaminsu.com';  //https的服务器域名
const userAccountKey = 'userAccount';     //存在本地的账号
const userPassWordKey = 'userPassWord';   //存在本地的密码
const paramsTypeKey = 'paramsType';       //类型参数  0、1、2、3 不限 我选 我说 我画

var config = {
    mainHost: host,
    userAccountKey: userAccountKey,
    userPassWordKey: userPassWordKey,
    paramsTypeKey: paramsTypeKey
};
//模块化
module.exports = config