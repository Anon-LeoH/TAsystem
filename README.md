TAsystem
========

A system for the sysu lab assistent;

###模块构成

####通用模块：
* server.js     服务器模块
* router.js     路由模块
* page.js       返回页面模块
* proload.js    页面组装模块
* dbopt.js      数据库操作模块
* csv.js        csv分析模块
* exception.js  异常处理模块
* sign\_in.js   登录模块

####助理使用模块：
* work.js       在线签到提交日志等功能

####管理员使用模块：
* admin.js      管理助理以及查看，管理日志等功能

####如何验证客户端上传数据：
  为了让这个系统稍微可靠点，每一次客户端工作开始的ajax请求
  都会触发服务端产生随机钥（16位字符串）并返回。工作结束请求必
  须包含正确的随机钥，否则不能结束工作。
  必须要实验室IP才能开始/结束工作，否则不予处理。
  开始了工作却未正常结束的助理需要联系管理员清空保存的随意
  钥，否则将无法开始工作。
  以上

####如何配置环境
  暂时写ubuntu下如何配置……
  过两天有时间再加

````bash
$ chmod +x setup.sh
$ sudo ./setup.sh

# 初始化数据库
$ nodejs dbinit.js

# 运行服务端程序
$ nodejs server.js
````

进入页面: 浏览器输入localhost:8080
