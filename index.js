var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var cook = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cook());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', function (req, res) {
   res.send('Hello World');
});
app.get('/ChooseCourse.jsp',function (req,res){
  // var reqs =  eval(req.query);
  var callback =  req.query.callback;

/*-----------用户登录---------*/
  if(req.query.api ==='login'){
    var user = req.query.user;
    var password = req.query.password;
    var typeId = req.query.typeId;
    var day = req.query.cookieDay;
    var res1 = {res:'1',msg:'登录成功！',data:[]};//对象
    var res0 = {res:'0',msg:'校园通账号或者密码错误'};

    res.cookie('loginCookietype',typeId,{maxAge:day});
    if (typeId == '1') {
      connection.query('select * FROM student where id = '+req.query.user+' and stu_password = "'+password+'"', function(err, rows, fields) {
      if (err) console.error(err.stack);
      if (rows.length <= 0) {
        res.send(res0);
      }
      else{
        res.cookie('loginCookiename',user,{maxAge:day});
        res1.data = rows;//对象
        res.send(res1);
      }
      });
      return;
    }
    if (typeId == '2') {
      connection.query('select * FROM teacher where id = '+req.query.user+' and teacher_password = "'+password+'"', function(err, rows, fields) {
      if (err) console.error(err.stack);
      if (rows.length <= 0) {
        res.send(res0);
      }
      else{
        res.cookie('loginCookiename',user,{maxAge:day});
        res1.data = rows;//对象
        res.send(res1);
      }
      });
      return;
    }
    if (typeId == '0') {
      connection.query('select * FROM admin where user = "'+req.query.user+'" and password = "'+password+'"', function(err, rows, fields) {
      if (err) console.error(err.stack);
      if (rows.length <= 0) {
        res.send(res0);
      }
      else{
        res.cookie('loginCookiename',user,{maxAge:day});
        res1.data = rows;//对象
        res.send(res1);
      }
      });
      return;
    }
    return;
  }


/*------- 核对校园通账号 ----------*//*完成*/
  if(req.query.api ==='findInformation'){
    var user = req.query.user;
    var typeId = req.query.typeId;
    var res1,res0;
    if (typeId == '1') {
      console.log(user,typeId);
      connection.query('select * FROM student where id = '+req.query.user+'', function(err, rows, fields) {
        if (err) console.error(err.stack);
        console.log(rows);
        if (rows.length <= 0) {
          res0 = {res:'0',msg:'请正确输入校园通账号'};
          res.send(res0);
        }
        else{
          isLegal = true;
          res1 = {res:'1',msg:'查找成功！',data:[{'userNum':rows[0].id,'tel': rows[0].stu_phone}]};
          res.send(res1);
        }
      });
      return;
    }
    if (typeId == '2') {
      connection.query('select * FROM teacher where id ='+req.query.user+'', function(err, rows, fields) {
        if (err) console.error(err.stack);
        console.log(rows);
        if (rows.length <= 0) {
          res0 = {res:'0',msg:'请正确输入校园通账号'};
          res.send(res0);
        }
        else{
          res1 = {res:'1',msg:'查找成功！',data:[{'userNum':rows[0].id,'tel': rows[0].teacher_phone}]};
          res.send(res1);
        }
      });
      return;
    }
  }

  /*------ 发送验证码 --------*//*完成*/
  if(req.query.api ==='sendVerification'){
    var res0,res1;
    var isLegal = false;
    var valid_time;
    var verification = '';
    connection.query('select * FROM verification where phone = "'+req.query.phone+'"',function(err, rows, fields){
      if (err) console.error(err.stack);
      console.log(rows[rows.length-1]);
      // 第一次发送
      if (rows.length == 0) {
         verifi();
        verifi = {'phone':req.query.phone,'verification':verification,'create_time':req.query.time,'valid_time':valid_time,'status':'1'};
        connection.query('insert INTO verification set ?',verifi,function(err,result){
         if (err) console.error(err.stack);
          console.log('verification insert');
          res1 = {'res':'1','msg':'验证码发送成功！','data':[verification]};
          console.log('res1',res1);
          res.send(res1);
        });
      }
      // 第二次发送
      else{
        // 失效时间内
        if (req.query.time <= rows[rows.length-1].valid_time) {
          res0 = {'res':'0','msg':'2分钟内不能重复发送验证码'};
          res.send(res0);
        }
        else{
        // 重新发送
          verifi();
          verifi = {'phone':req.query.phone,'verification':verification,'create_time':req.query.time,'valid_time':valid_time,'status':'1'};
          connection.query('insert INTO verification set ?',verifi,function(err,result){
           if (err) console.error(err.stack);
            connection.query('UPDATE verification set status = "0" where phone = "'+req.query.phone+'" and valid_time = "'+rows[rows.length-1].valid_time+'"',function(err,result){
            console.log('verification insert');
            res1 = {'res':'1','msg':'验证码发送成功！','data':[verification]};
            console.log('res12',res1);
            res.send(res1);
            });
          });
        }
      }
    });
     /*发送验证码函数*/
    function verifi(){
      for(var i = 0;i < 6; i++){
        verification += Math.floor(Math.random()*10).toString();
      }
    //分解时间格式
      var times = req.query.time.toString();
      var year = times.substring(0,4);
      var month = times.substring(4,6);
      var day = times.substring(6,8);
      var hour = times.substring(8,10);
      var minute = times.substring(10,12);
    //设置失效时间
      var ttt=new Date(year,month-1,day,hour,minute).getTime()+1000*60;
      var theday=new Date();
      theday.setTime(ttt);
    //设置时间格式
      var reg;
      function timeReg(arg){
        if (parseInt(arg) < 10) {
          reg = '0' + arg;
        }
        else{
          reg = arg;
        }
        return reg;
      }
      //得到失效时间
     valid_time =theday.getFullYear()+timeReg(1+theday.getMonth())+timeReg(theday.getDate())+timeReg(theday.getHours())+timeReg(theday.getMinutes());
      
      return valid_time;
    }
  /*函数结束*/
    return;
  }


  /*------ 找回密码 --------*/
  if(req.query.api ==='findPassword'){
    var user = req.query.user;
    var typeId = req.query.typeId;
    var password =req.query.password;
    var verification = req.query.verification;
    var phone = req.query.phone;
    var res1,res0;
    var table;
    connection.query('select * FROM verification where phone = "'+phone+'"',function(err, rows, fields){
      if (err) console.error(err.stack);
      console.log(rows[rows.length-1]);
      if (rows[rows.length-1].verification == verification) {
        var password_modify = {'type_id':typeId,'user_num':user,'user_phone':phone,'verification':verification,'new_password':password};
        connection.query('insert INTO password_modify set ?',password_modify,function(err,result){
        });
        if (typeId == '1') {
        connection.query('update student set stu_password = "'+password+'" where id = '+user+'',function(err,result){
          res1 = {res:'1',msg:'设置成功！'};
          res.send(res1);
        });
        return;
        }
        if (typeId == '2') {
        connection.query('update teacher set teacher_password = "'+password+'" where id = '+user+'',function(err,result){
          res1 = {res:'1',msg:'设置成功！'};
          res.send(res1);
        });
        return;
        }
      }
      else{
        res0 = {res:'0',msg:'验证码输入错误！'};
        res.send(res0);
      }
    });
    return;
  }



  /*------ 设置选课 --------*//*完成*/
  if(req.query.api ==='setCourse'){
    var typeId = req.query.typeId;
    var subject = req.query.subject;
    var credit = req.query.credit;
    var teacher = req.query.teacher;
    var startWeek = req.query.startWeek;
    var endWeek = req.query.endWeek;
    var courseSection = req.query.courseSection;
    var courseWeekday = req.query.courseWeekday;
    var place = req.query.place;
    var peopleMax = req.query.peopleMax;
    var checkPeople = req.query.checkPeople;
    var targetMajor = req.query.targetMajor;
    var valid = req.query.valid;
    var status = req.query.status;
    var res0;
    var res1 = {'res':'1','msg':'添加成功！'};
    var newCourse =  {'type_id':typeId,'subject_name':subject,'credit':credit,'teacher':teacher,'start_week':startWeek,'end_week':endWeek,'course_section':courseSection,'course_weekday':courseWeekday,'place':place,'people_max':peopleMax,'check_people':checkPeople,'target_major':targetMajor,'valid':valid,'status':status};
    connection.query('select * FROM course where type_id = "'+typeId+'" and subject_name ="'+subject+'"',function(err,result){
      if (result.length <= 0) {
        connection.query('insert INTO course set ?',newCourse,function(err,rows,fields){
        console.log(rows);
        res.send(res1);
        console.log(newCourse);
        });
      }
      else{
        res.send({'res':'0','msg':'已有该选课！'});
      }
    })
    
}


  /*------ 修改选课 --------*//*完成*/
  if(req.query.api ==='updateCourse'){
    var typeId = req.query.typeId;
    var subjectNum = req.query.subjectNum;
    var subject = req.query.subject;
    var credit = req.query.credit;
    var teacher = req.query.teacher;
    var startWeek = req.query.startWeek;
    var endWeek = req.query.endWeek;
    var courseSection = req.query.courseSection;
    var courseWeekday = req.query.courseWeekday;
    var place = req.query.place;
    var peopleMax = req.query.peopleMax;
    var checkPeople = req.query.checkPeople;
    var targetMajor = req.query.targetMajor;
    var valid = req.query.valid;
    var status = req.query.status;
    var res1 = {'res':'1','msg':'修改成功！'};
    var updateCourse =  {'type_id':typeId,'subject_name':subject,'credit':credit,'teacher':teacher,'start_week':startWeek,'end_week':endWeek,'course_section':courseSection,'course_weekday':courseWeekday,'place':place,'people_max':peopleMax,'check_people':checkPeople,'target_major':targetMajor,'valid':valid,'status':status};
    connection.query('update course set ? where id = '+subjectNum+'',updateCourse,function(err, result) {
      res.send(res1);
    })
  }

  /*------ 设置无效选课 --------*//*完成*/
  if(req.query.api ==='setNoUseCourse'){
    var subjectNumArr = req.query.subjectNumArr;
    connection.query('UPDATE course SET valid = "0" where id in ('+subjectNumArr+')',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'设置失败！'});
      }
      else{
        res.send({'res':'1','msg':'设置成功！'});
      }
    });
  }

   /*------ 恢复有效选课 --------*//*完成*/
  if(req.query.api ==='updateNoUseCourse'){
    var subjectNumArr = req.query.subjectNumArr;
    connection.query('UPDATE course SET valid = "1" where id in ('+subjectNumArr+')',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'设置失败！'});
      }
      else{
        res.send({'res':'1','msg':'设置成功！'});
      }
    });
  }

  /*--------- 删除选课 -------------*//*完成*/
  if(req.query.api ==='deleteCourse'){
    var typeId = req.query.typeId;
    var subjectNum = req.query.subjectNum;
    connection.query('delete FROM course where id = '+subjectNum+'',function(err,rows,fields){
      res.send({'res':'1','msg':'删除成功！'});
    })
  }

  /*----------- 查询选课 --------------*//*完成*/
  if (req.query.api === 'courseInform') {
    var typeId = req.query.typeId;
    var res1;
    var isLegal = false;
    connection.query('select * FROM course where type_id = "'+typeId+'"',function(err,rows,fields){
      if (rows.length <= 0 ) {
        res.send({'res':'0','msg':typeId+'没有课程！'});
      }
      else{
      res1 = {'res':'1','msg':typeId+'查询成功！','data':[]};
      res1.data = rows;
      var teacherArr = [];
      for(var i = 0;i < rows.length; i++){
        teacherArr.push(res1.data[i].teacher);
      }
      connection.query('select * FROM teacher where id in ('+teacherArr+')',function(err,result){
        console.log('老师序号',result);
        for(var i = 0;i < res1.data.length;i++){
        for (var j = 0;j < result.length; j++){
          if (res1.data[i].teacher == result[j].id) {
            res1.data[i].teacher_name = result[j].teacher_name;
          }
        }
        }
      console.log(res1);
      res.send(res1);
      });
      return;
      }
    });
    return;
  }


});

app.get('/cookies',function (req,res){ 
  var isLegal=true;
  var res1;
  if (req.cookies.loginCookietype && req.cookies.loginCookiename) {
    isLegal=true;
    res1 = {'res':'1','msg':'最近有登录，为您跳转！',data:[{'typeId':req.cookies.loginCookietype,'username':req.cookies.loginCookiename}]};
  }
  else{
    isLegal=false;
  }
  if (isLegal) {
    res.send(res1);
      }
    else{
    res.send({'res':'0','msg':'身份已过期，请重新登录！'});
    }
});

var mysql= require('mysql');
var connection = mysql.createConnection({
  host     : '60.205.210.86',
  user     : 'root',
  password : 'fallen',
  database : 'ChooseCourse'
});
connection.connect();  //链接数据库
// connection.query('UPDATE course SET type_id = "dirCourse" where id = 10008',function(err,rows,fields){
//   if (err) throw err;

//   console.log('The solution is: ', rows);
// })
// connection.query('select * FROM student where id = 10000', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('学生表: ', rows);
// });   //查询
// connection.query('select * FROM teacher', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('教师表: ', rows);
// });   //查询
// connection.query('select * FROM admin', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('管理员表: ', rows);
// });   //查询
// connection.query('select * FROM password_modify', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('修改密码表: ', rows);
// });   //查询
// var user  = {'userName': '胡辉','userPhone':'15862472342','userAddress':'苏州市','userPassword':'123456'};
// connection.query('insert INTO user set ?', user, function(err, result) {
//   if (err) throw err;
//   console.log('insert lisi');     
// });
// console.log(query.sql);  //增加
// connection.query('update users set age="20" where username="张三"',function(err, result) {
//     if (err) throw err;

//     console.log('updated zhangsan\'s age to 20');
//     console.log(result);
//     console.log('\n');
// }); //修改

// connection.query('delete from  users where username="李四"', function(err, result) {
//     if (err) throw err;

//     console.log('deleted lisi');
//     console.log(result);
//     console.log('\n');
// }); //删除

var server = app.listen(5555, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("林佳的服务器诶 地址为 http://%s:%s", host, port);
})