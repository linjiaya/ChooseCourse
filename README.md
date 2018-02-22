<h1 align="center">大学生网上选课系统</h1>
<p align="right"><small>－－我的毕业设计</small></p>
<h1>下载安装</h1>
<p><code>git clone git@github.com:linjiaya/ChooseCourse.git</code></p>
<p><code>npm install</code></p>
<p><code>node index.js</code></p>
## 系统大纲
  此系统分为三个角色：学生、教师、管理员。每个角色都有各自的功能。例如：
  
* 学生
  * 查看公告
  * 网上选课
  * 查看选课结果
  * 退课
  * 查看课表

* 教师
  * 查看公告
  * 查看选课结果（查看选课学生名单）
  * 申请退课
  * 查看课表  

* 管理员
  * 发布选课公告
  * 发布选课
  * 查看选课结果（设置无效选课）
  * 审批退课
  * 结束选课

# 系统设计

## 登录

 用户输入校园通账号、密码，选择对应的身份进行验证登录。本系统暂时只设定了几个账号用于登录。
 * 学生 --  账号:10000  密码:111111
 * 教师 --  账号:10000  密码:aaaaaa
 * 管理员 --  账号:ECIT 密码:00001111<br/>
<br><br>
![](https://github.com/linjiaya/ChooseCourse/raw/master/webImages/login.png)
 
 ## 找回密码
 
用户可以通过校园通账号，通过发送手机验证码，重新设置新密码在进行登录。<br>
<br><br>
![](https://github.com/linjiaya/ChooseCourse/raw/master/webImages/forgetPsw.gif) 

`其他功能因数据原因无法展示`
