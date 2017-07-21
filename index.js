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
/*-----------用户登录---------*//*完成*/
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
        res.send(res0);return;
      }
      else{
        res.cookie('loginCookieId',user,{maxAge:day});
        res.cookie('loginCookieName',rows[0].stu_name,{maxAge:day});
        res1.data = rows;//对象
        res.send(res1);return;
      }
      });
      return;
    }
    if (typeId == '2') {
      connection.query('select * FROM teacher where id = '+req.query.user+' and teacher_password = "'+password+'"', function(err, rows, fields) {
      if (err) console.error(err.stack);
      if (rows.length <= 0) {
        res.send(res0);return;
      }
      else{
        res.cookie('loginCookieId',user,{maxAge:day});
        res.cookie('loginCookieName',rows[0].teacher_name,{maxAge:day});
        res1.data = rows;//对象
        res.send(res1);return;
      }
      });
      return;
    }
    if (typeId == '0') {
      connection.query('select * FROM admin where user = "'+req.query.user+'" and password = "'+password+'"', function(err, rows, fields) {
      if (err) console.error(err.stack);
      if (rows.length <= 0) {
        res.send(res0);return;
      }
      else{
        res.cookie('loginCookieId',user,{maxAge:day});
        res1.data = rows;//对象
        res.send(res1);return;
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
      // console.log(user,typeId);
      connection.query('select * FROM student where id = '+req.query.user+'', function(err, rows, fields) {
        if (err) console.error(err.stack);
        // console.log(rows);
        if (rows.length <= 0) {
          res0 = {res:'0',msg:'请正确输入校园通账号'};
          res.send(res0);return;
        }
        else{
          isLegal = true;
          res1 = {res:'1',msg:'查找成功！',data:[{'userNum':rows[0].id,'tel': rows[0].stu_phone}]};
          res.send(res1);return;
        }
      });
      return;
    }
    if (typeId == '2') {
      connection.query('select * FROM teacher where id ='+req.query.user+'', function(err, rows, fields) {
        if (err) console.error(err.stack);
        // console.log(rows);
        if (rows.length <= 0) {
          res0 = {res:'0',msg:'请正确输入校园通账号'};
          res.send(res0);return;
        }
        else{
          res1 = {res:'1',msg:'查找成功！',data:[{'userNum':rows[0].id,'tel': rows[0].teacher_phone}]};
          res.send(res1);return;
        }
      });
      return;
    }
    return;
  }

  /*------ 发送验证码 --------*//*完成*/
  if(req.query.api ==='sendVerification'){
    var res0,res1;
    var isLegal = false;
    var valid_time;
    var verification = '';
    connection.query('select * FROM verification where phone = "'+req.query.phone+'"',function(err, rows, fields){
      if (err) console.error(err.stack);
      // console.log(rows[rows.length-1]);
      // 第一次发送
      if (rows.length == 0) {
         verifi();
        verifi = {'phone':req.query.phone,'verification':verification,'create_time':req.query.time,'valid_time':valid_time,'status':'1'};
        connection.query('insert INTO verification set ?',verifi,function(err,result){
         if (err) console.error(err.stack);
          // console.log('verification insert');
          res1 = {'res':'1','msg':'验证码发送成功！','data':[verification]};
          // console.log('res1',res1);
          res.send(res1);
        });return;
      }
      // 第二次发送
      else{
        // 失效时间内
        if (req.query.time <= rows[rows.length-1].valid_time) {
          res0 = {'res':'0','msg':'2分钟内不能重复发送验证码'};
          res.send(res0);return;
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
            // console.log('res12',res1);
            res.send(res1);
            });
          });
          return;
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


  /*------ 找回密码 --------*//*完成*/
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
        // console.log(rows);
        res.send(res1);return;
        // console.log(newCourse);
        });
      }
      else{
        res.send({'res':'0','msg':'已有该选课！'});return;
      }
    })
    return;
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
    return;
  }

  /*------ 设置无效选课 --------*//*完成*/
  if(req.query.api ==='setNoUseCourse'){
    var subjectNumArr = req.query.subjectNumArr;
    connection.query('UPDATE course SET valid = "0" where id in ('+subjectNumArr+')',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'设置失败！'});return;
      }
      else{
        connection.query('UPDATE choose_detail SET is_open = "0" where id in ('+subjectNumArr+')',function(err,rows,fields){
         res.send({'res':'1','msg':'设置成功！'});
        });
      }
    });
    
    return;
  }

   /*------ 恢复有效选课 --------*//*完成*/
  if(req.query.api ==='updateNoUseCourse'){
    var subjectNumArr = req.query.subjectNumArr;
    connection.query('UPDATE course SET valid = "1" where id in ('+subjectNumArr+')',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'设置失败！'});return;
      }
      else{
        connection.query('UPDATE choose_detail SET is_open = "1" where id in ('+subjectNumArr+')',function(err,rows,fields){
         res.send({'res':'1','msg':'设置成功！'});
        });
      }
    });
    return;
  }

  /*--------- 删除选课 -------------*//*完成*/
  if(req.query.api ==='deleteCourse'){
    var typeId = req.query.typeId;
    var subjectNum = req.query.subjectNum;
    connection.query('delete FROM course where id = '+subjectNum+'',function(err,rows,fields){
      res.send({'res':'1','msg':'删除成功！'});
    });
    return;
  }

  /*----------- 查询选课 --------------*//*完成*/
  if (req.query.api === 'courseInform') {
    var typeId = req.query.typeId;
    var res1;
    var isLegal = false;
    connection.query('select * FROM course where type_id = "'+typeId+'"',function(err,rows,fields){
      if (rows.length <= 0 ) {
        res.send({'res':'0','msg':typeId+'没有课程！'});return;
      }
      else{
      res1 = {'res':'1','msg':typeId+'查询成功！','data':[]};
      res1.data = rows;
      var teacherArr = [];
      for(var i = 0;i < rows.length; i++){
        teacherArr.push(res1.data[i].teacher);
      }
      connection.query('select * FROM teacher where id in ('+teacherArr+')',function(err,result){
        // console.log('老师序号',result);
        for(var i = 0;i < res1.data.length;i++){
        for (var j = 0;j < result.length; j++){
          if (res1.data[i].teacher == result[j].id) {
            res1.data[i].teacher_name = result[j].teacher_name;
          }
        }
        }
      res.send(res1);
      });
      return;
      }
    });
    return;
  }

  /*----------- 在线选课 --------------*/
  if (req.query.api === 'chooseCourse') {
    var choose_detail = '';
    connection.query('select * FROM choose_detail where stu_num = '+req.query.stuNum+' and subject_num in('+req.query.subjectNum+')',function(err,rows,fields){
      console.log(rows);
      if (rows.length > 0) {
        res.send({'res':'0','msg':'已选过该课程！不用重复选择',data:rows});
        return;
      }
      else{
        if (req.query.typeId == "openCourse") {
          connection.query('select * FROM choose_detail where stu_num = '+req.query.stuNum+' and type_id = "openCourse"',function(err,result){
            if (result.length < 2) {
              chooseCourse();
              return;
            }
            else{
              res.send({'res':'0','msg':'您公选课已选课程已满2个，已达上限！暂时不能选择。若需要此课程，请先退选已选课程在进行选择！'})
            }
          })
        }
       else{
        chooseCourse();
       }
      }
    });
    function chooseCourse(){
      connection.query('select * FROM course where id in ('+req.query.subjectNum+')',function(err,result){
        for(var i = 0; i < result.length; i++){
          if (result[i].status == '1') {
            res.send({'res':'0','msg':'该课程已满'});
            return;
          }
          else{
            connection.query('update course set check_people = check_people + 1 where id ='+result[i].id+'',function(err,result){
            });
            connection.query('select * FROM course where id ='+result[i].id+'',function(err,rows,fields){
                // console.log('选课成功后判断是否已选满',rows);
                if (rows[0].check_people == rows[0].people_max) {
                  connection.query('update course set status = "1" where id = '+rows[0].id+'',function(err,result){});
                }
              });
            var newdetail = '('+req.query.stuNum+',"'+req.query.stuName+'",'+req.query.subjectNum[i]+',"'+req.query.status+'","'+req.query.is_open+'","'+req.query.typeId+'"),';
              choose_detail = choose_detail + newdetail;
          }
        }
        choose_detail = choose_detail.substr(0,choose_detail.length-1);
        // console.log(choose_detail);
        connection.query('insert INTO choose_detail (stu_num,stu_name,subject_num,status,is_open,type_id) value '+choose_detail+'',function(err,result){
          res.send({'res':'1','msg':choose_detail});
        });
    });
      return;
    }
    return;
  }

  /*-----------查询该学生各类型已选课程---------*/
  if (req.query.api === 'courseChoosed') {
    connection.query('select * FROM choose_detail where stu_num = '+req.query.stuNum+' and type_id = "'+req.query.typeId+'"',function(err,rows,fields){
      // console.log(req.query.stuNum);
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'该学生尚未选课!'});return;
      }
      else{
        res.send({'res':'1','msg':'查询成功！',data:rows});
      }
    });
    return;
  }

  /*---------查询该学生各类型已选课程查询课程信息----------*/
  if (req.query.api === 'courseChoosedbyStudent') {
    var res1;
    var courseId = [];
    if (req.query.type_id) {
      connection.query('select * FROM choose_detail where stu_num = '+req.query.stuNum+' and type_id = "'+req.query.typeId+'"',function(err,rows,fields){
        // console.log(req.query.stuNum);
        if (rows.length <= 0) {
          res.send({'res':'0','msg':'该学生尚未选课!'});return;
        }
        else{
          for(var i = 0; i < rows.length;i++){
            courseId.push(rows[i].subject_num);
          }
          courseChoosedbytypeId();
        }
      });
      return;
    }
    else{
      connection.query('select * FROM choose_detail where stu_num = '+req.query.stuNum+'',function(err,rows,fields){
        // console.log(req.query.stuNum);
        if (rows.length <= 0) {
          res.send({'res':'0','msg':'该学生尚未选课!'});
        }
        else{
          for(var i = 0; i < rows.length;i++){
            courseId.push(rows[i].subject_num);
          }
          courseChoosedbytypeId();
        }
      });
      return;
    }
    function courseChoosedbytypeId(){
        connection.query('select * FROM course where id in ('+courseId+')',function(err,rows){
          res1 = {'res':'1','msg':'查询成功！','data':[]};
          res1.data = rows;
          var teacherArr = [];
          for(var i = 0;i < rows.length; i++){
            teacherArr.push(res1.data[i].teacher);
          }
          connection.query('select * FROM teacher where id in ('+teacherArr+')',function(err,result){
            // console.log('老师序号',result);
            for(var i = 0;i < res1.data.length;i++){
              for (var j = 0;j < result.length; j++){
                if (res1.data[i].teacher == result[j].id) {
                  res1.data[i].teacher_name = result[j].teacher_name;
                }
              }
            }
            res.send(res1);
          });
        });
      return;
    }
    /*函数结束*/

    return;
  }

  /*-------------- 学生退课 ---------------*/
  if (req.query.api === 'courseDeletebyStudent') {
    //删除选课详情表中内容
    connection.query('delete FROM choose_detail where stu_num = '+req.query.stuNum+' and subject_num in ('+req.query.subjectNumArr+')',function(err,result){
      //更新课程表选课人数
      connection.query('update course set check_people = check_people - 1 where id in ('+req.query.subjectNumArr+')',function(err,result){
        //查询这些课之前已满的，将其设置成未选满
        connection.query('select * FROM course where id  in ('+req.query.subjectNumArr+')',function(err,rows,fields){
          // console.log('选课成功后判断是否已选满',rows);
          var validCourse = [];
          for(var i = 0; i < rows.length; i++){
            if (rows[i].check_people < rows[i].people_max) {
             validCourse.push(rows[i]);
            }
          }
          //设置没有选满
           connection.query('update course set status = "0" where id in ('+validCourse+')',function(err,result){
              res.send({'res':'1','msg':'退课成功！'});
           });
        });
      });
            
    });
    return;
  }

  /*--------------- 获取老师的选课情况 ----------------*/
  if (req.query.api === 'courseInformByteacher') {
    var res1;
    connection.query('select * FROM course where teacher = '+req.query.teacher+' and type_id = "'+req.query.typeId+'"',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'此类选课没有需要授课的课程！'});
        return;
      }
      else{
        res1 = {'res':'1','msg':req.query.typeId+'查询成功！','data':[]};
        res1.data = rows;
        connection.query('select * FROM teacher where id ='+req.query.teacher+'',function(err,result){
          // console.log('老师序号',result);
          if (result.length <= 0) {return;}
          for(var i = 0;i < res1.data.length;i++){
            res1.data[i].teacher_name = result[0].teacher_name;
          }
          res.send(res1);
        });
        return;
      }
    })
    return;
  }

  /*---------------- 老师申请退课 -----------------*/
  if (req.query.api === 'courseDeletebyTeacher') {
    var teacherNum = req.query.teacherNum;
    var subjectNumArr = req.query.subjectNumArr;
    var time = req.query.time;
    var status = req.query.status;
    var reject_detail = '';
    connection.query('select * FROM reject_detail where teacher_num ='+teacherNum+' and subject_num in ('+subjectNumArr+')',function(err,rows,fields){
      if (rows.length > 0) {
        res.send({'res':'0','msg':'已申请过该课程！请不要重复提交申请！'});
        return;
      }
      else{
      for(var i = 0; i < subjectNumArr.length; i++){
        var newdetail = '('+teacherNum+','+subjectNumArr[i]+',"'+time+'","'+req.query.typeId+'","'+status+'"),';
        reject_detail = reject_detail + newdetail;
      }
      reject_detail = reject_detail.substr(0,reject_detail.length-1);
      // console.log(choose_detail);
      connection.query('insert INTO reject_detail (teacher_num,subject_num,time,type_id,status) value '+reject_detail+'',function(err,result){
        res.send({'res':'1','msg':'已提交申请！','data':reject_detail});
      });
      }
    });
    return;
  }

  /*------------------ 获取退课申请表 -------------------------*/
  if (req.query.api === 'rejectTeacher') {
    var res1;
    connection.query('select * FROM reject_detail',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'没有申请内容！'});return;
      }
      else{
        var courseId = [];
        for(var i = 0; i < rows.length; i++){
          courseId.push(rows[i].subject_num);
        }
        res1 = {'res':'1','msg':'查询成功！','data':[]};
        res1.data = rows;
        connection.query('select * FROM course where id in ('+courseId+')',function(err,rows){
          var teacherArr = [];
          for(var i = 0;i < res1.data.length;i++){
            for(var j = 0;j < rows.length; j++){
              if (res1.data[i].subject_num == rows[i].id) {
              res1.data[i].subject_name = rows[j].subject_name;
              res1.data[i].credit = rows[j].credit;
              res1.data[i].start_week = rows[j].start_week;
              res1.data[i].end_week = rows[j].end_week;
              res1.data[i].course_section = rows[j].course_section;
              res1.data[i].course_weekday = rows[j].course_weekday;
              res1.data[i].place = rows[j].place;
              res1.data[i].people_max = rows[j].people_max;
              res1.data[i].check_people = rows[j].check_people;
              res1.data[i].targetMajor = rows[j].targetMajor;
              res1.data[i].valid = rows[j].valid;
              }
            }
            teacherArr.push(res1.data[i].teacher_num);
          }
          connection.query('select * FROM teacher where id in ('+teacherArr+')',function(err,result){
            // console.log('老师序号',result);
            for(var i = 0;i < res1.data.length;i++){
              for (var j = 0;j < result.length; j++){
                if (res1.data[i].teacher_num == result[j].id) {
                  res1.data[i].teacher_name = result[j].teacher_name;
                }
              }
            }
            res.send(res1);
          });
        });
      }
    });
    return;
  }

  /*-------------- 拒绝老师退课申请 -----------------------*/
  if (req.query.api === 'refusedApplication') {
    connection.query('update reject_detail SET status = "2" where teacher_num = '+req.query.teacherNum+' and subject_num = '+req.query.subjectNum+'',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'程序出错啦，没找这条申请哦！'});return;
      }
      else{
        res.send({'res':'1','msg':'拒绝老师退课申请成功！'});
      }
    });
    return;
  }

  /*---------------- 同意老师申请并重新安排老师 ------------------------*/
  if (req.query.api === 'agreeApplication') {
    connection.query('select * FROM reject_detail where subject_num = '+req.query.subjectNum+'',function(err,rows,fields){
      if (rows.length <= 0) {res.send({'res':'0','msg':'该老师已撤回申请！'});return;}
      else{
        console.log(rows);
        connection.query('update reject_detail SET status = "1" where subject_num = '+req.query.subjectNum+'',function(err,rows,fields){
          connection.query('update course SET teacher = '+req.query.teacherNum+' where id = '+req.query.subjectNum+'',function(err,rows,fields){
              res.send({'res':'1','msg':'重新安排老师成功！'});
          })
        })
      }
    })
    return;
  }

  /*-------------------- 根据课程获取学生表------------*/
  if (req.query.api === 'getStudentBycourse') {
    connection.query('select * FROM choose_detail where subject_num = '+req.query.subjectNum+'',function(err,rows,fields){
      console.log(rows);
      if (rows.length <= 0) {res.send({'res':'0','msg':'暂时没有学生选该门课程！'});return;}
      var stuNumArr = [];
      for(var i = 0; i < rows.length; i++){
        stuNumArr.push(rows[i].stu_num);
      }
      connection.query('select * FROM student where id in ('+stuNumArr+')',function(err,result){

        res.send({'res':'1','msg':'查询成功！','data':result});
      })
    })
    return;
  }

  /*---------------- 教师查看退课进度 -------------------*/
  if (req.query.api === 'rejectByTeacher') {
    var res1 = {'res':'1','msg':'查询成功！','data':[]};
    connection.query('select * FROM reject_detail where teacher_num ='+req.query.teacherNum+'',function(err,rows,fields){
      if (rows.length <= 0) {res.send({'res':'0','msg':'您暂时没有退课申请!'});return;}
      else{
        res1.data = rows;
        var subjectNumArr = [];
        for(var i = 0; i < rows.length; i++){
          subjectNumArr.push(rows[i].subject_num);
        }
        connection.query('select * FROM course where id in ('+subjectNumArr+')',function(err,result){
          for(var i = 0; i < res1.data.length; i++){
            for(var j = 0; j < result.length; j++){
              if (res1.data[i].subject_num == result[j].id) {
                res1.data[i].subject_name = result[j].subject_name;
              }
            }
          }
          res.send(res1);
        })
      }
    });
    return;
  }

  /*------------------ 发布公告 -------------------------*/
  if (req.query.api === 'addNews') {
    connection.query('select * FROM news where type_id = "'+req.query.typeId+'"',function(err,rows,fields){
      if (rows.length <= 0) {
        var news = {'type_id':req.query.typeId,'detail':req.query.detail,'time':req.query.time,'is_open':'0','end_option':'0','endTime':'暂无'};
        connection.query('insert INTO news SET ?',news,function(err,result){
          res.send({'res':'1','msg':'添加成功！'});
        });
        return;
      }
      else{
        connection.query('update news SET detail = "'+req.query.detail+'" where type_id ="'+req.query.typeId+'"',function(err,result){
          connection.query('update news SET time = "'+req.query.time+'" where type_id ="'+req.query.typeId+'"',function(err,result){
            res.send({'res':'1','msg':'修改成功'});
          })
        })
        return;
      }
    })
    return;
  }

  /*
  @判断什么时候可以选课，
    *就判断时间大小和is_open为1时可以选课
    *判断is_open为0时不可以选课
  */
  /*---------------  查看公告 ---------------------------*/
  if (req.query.api === 'getNews') {
    connection.query('select * FROM news where type_id ="'+req.query.typeId+'"',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'该部分课程暂时不能选课！'});
        return;
      }
      else{
        var d = new Date();
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
        //得到当前时间
       var currentTime =d.getFullYear()+timeReg(1+d.getMonth())+timeReg(d.getDate());
        // var str = d.getFullYear().toString()+(d.getMonth()+1).toString()+d.getDate().toString();
        var timeArr = rows[0].time.split('-');
        var time = timeArr[0]+timeArr[1]+timeArr[2];
        // console.log('currentTime',currentTime);
        // console.log('time',time);
        var data = rows;
        if (parseInt(time) < parseInt(currentTime)) {//超过开放时间时
          if (rows[0].end_option == '0') {//如果未执行结束选课操作，则需要讲选课开放。
            connection.query('update news set is_open = "1"',function(err,result){
              res.send({'res':'1','msg':'该部分课程选课进行中！','data':data});
            });
            return;
          }
          else{
            res.send({'res':'0','msg':'该部分课程已暂停选课！','data':data});
            return;
          }
        }
        else{
          res.send({'res':'0','msg':'该部分课程未到选课时间，请等候开放！','data':data});
          return;
        }
      }
    })
  }
  /*---------------  结束选课 ---------------------------*/
  if (req.query.api === 'endChoose') {
    connection.query('select * FROM news where type_id = "'+req.query.typeId+'"',function(err,rows,fields){
      if (rows.length <= 0) {
        res.send({'res':'0','msg':'该部分选课暂时未发布选课通知，无法结束选课!'});
        return;
      }
      else{
        connection.query('update news set is_open = "0" where type_id = "'+req.query.typeId+'"',function(err,result){
          connection.query('update news set end_option = "1" where type_id = "'+req.query.typeId+'"',function(err,result){
            connection.query('update news set endTime = "'+req.query.endTime+'" where type_id = "'+req.query.typeId+'"',function(err,result){
              res.send({'res':'1','msg':'该部分选课结束设置成功！'});
            });
          });
        });
      }
    });
    return;
  }

  /*------------------ 获取学生表 -------------------------*/
  if (req.query.api === 'getStudent') {
    connection.query('select * FROM student', function(err, rows, fields) {
      if (err) throw err;
      if (rows.length <= 0) {res.send({'res':'0','msg':'暂时没有学生'}); return;}
      else{
        res.send({'res':'1','msg':'查询成功！','data':rows});
      }
    });   //查询
    return;
  }

  /*------------------ 获取老师表 -------------------------*/
  if (req.query.api === 'getTeacher') {
  connection.query('select * FROM teacher', function(err, rows, fields) {
      if (err) throw err;
      if (rows.length <= 0) {res.send({'res':'0','msg':'暂时没有教师'});return;}
      else{
        res.send({'res':'1','msg':'查询成功！','data':rows});
      }
    });   //查询
    return;
  }
});

app.get('/cookies',function (req,res){ 
  var isLegal=true;
  var res1;
  if (req.cookies.loginCookietype && req.cookies.loginCookieId) {
    isLegal=true;
    res1 = {'res':'1','msg':'最近有登录，为您跳转！',data:[{'typeId':req.cookies.loginCookietype,'userId':req.cookies.loginCookieId,'username':req.cookies.loginCookieName}]};
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
//清除缓存
app.get('/deleteCookies',function (req,res){ 
  res.cookie('loginCookietype','',{maxAge:0});
  res.cookie('loginCookieId','',{maxAge:0});
  res.cookie('loginCookieName','',{maxAge:0});
  res.send('ok');
});

var mysql= require('mysql');
var connection = mysql.createConnection({
  host     : '60.205.210.86',
  user     : 'root',
  password : 'fallen',
  database : 'ChooseCourse'
});
connection.connect();  //链接数据库

// connection.query('UPDATE news SET is_open = "1" where id in (1)',function(err,rows,fields){
//   if (err) throw err;

//   console.log('The solution is: ', rows);
// })

// var user  = {'stu_name': '胡玲','stu_password':'444444','stu_sex':'女','stu_collage':'外国语学院','stu_grad':'2012','stu_major':'商务英语','stu_phone':'13444444444'};
// connection.query('insert INTO student set ?', user, function(err, result) {
//   if (err) throw err;
//   console.log('insert lisi');     
// });

connection.query('select * FROM news', function(err, rows, fields) {
  if (err) throw err;

  console.log('学生表: ', rows);
});   //查询
// connection.query('select * FROM reject_detail', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('教师表: ', rows);
// });   //查询
// connection.query('delete FROM reject_detail where id in (1)', function(err, rows, fields) {
//   if (err) throw err;

//   console.log(rows);
// });   //删除

// connection.query('select * FROM password_modify', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('修改密码表: ', rows);
// });   //查询

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