// 判断是否有cookie
$(function(){
  $.getJSON('../cookies',function(data){
    if(data.res == '0'){
      alert(data.msg);
      window.location.href='../login.html';
      return;
    }
    if (data.data[0].typeId != '2') {
      $.getJSON('../deleteCookies',function(res){
      })
      window.location.href='../login.html';
      return;
    }
    console.log(data);
    $('header span').attr('data',data.data[0].typeId);
    $('header span label').html(data.data[0].username);
    $('header span label').attr('data',data.data[0].userId);
    courseInformByteacher();
  });
});

var schedule = [];
var DataSource = [];
function courseInformByteacher(){
   $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'courseInformByteacher',
      'typeId':'openCourse',
      'teacher':$('header span label').attr('data')
    },
    success:function(res){
     if (res.res == '0') {
      return;
     }
     console.log(res);
     schedule = res.data;
     $.ajax({
      type:'get',
      url:'../ChooseCourse.jsp',
      data:{
        'api':'courseInformByteacher',
        'typeId':'labCourse',
        'teacher':$('header span label').attr('data')
      },
      success:function(res){
       if (res.res == '0') {
        return;
       }
       console.log(res);
       for(var i = 0; i < res.data.length; i++){
         schedule.push(res.data[i]);
       }
       $.ajax({
        type:'get',
        url:'../ChooseCourse.jsp',
        data:{
          'api':'courseInformByteacher',
          'typeId':'dirCourse',
          'teacher':$('header span label').attr('data')
        },
        success:function(res){
         if (res.res == '0') {
          return;
         }
         console.log(res);
         for(var i = 0; i < res.data.length; i++){
           schedule.push(res.data[i]);
         }
/*－－－－－－－－－－课表数据数组－－－－－－－－－－－*/
         var week = ['星期一','星期二','星期三','星期四','星期五','星期六','星期七'];
        for(var j = 1; j <= 7; j++){
          var weekday = {'weekday':j,'course':[]};
          var Course = weekday.course ;
          for(var i = 0; i < schedule.length; i++){
          if (schedule[i].course_weekday == week[j-1]) {
            if (schedule[i].course_section == '1~2') {
              var course = {"courseName":schedule[i].subject_name,"teacherName":schedule[i].teacher_name,"pointName":1,'place':schedule[i].place};
              Course.push(course);
            }
            if (schedule[i].course_section == '3~4') {
              var course = {"courseName":schedule[i].subject_name,"teacherName":schedule[i].teacher_name,"pointName":2,'place':schedule[i].place};
              Course.push(course);
            }
            if (schedule[i].course_section == '5~6') {
              var course = {"courseName":schedule[i].subject_name,"teacherName":schedule[i].teacher_name,"pointName":3,'place':schedule[i].place};
              Course.push(course);
            }
            if (schedule[i].course_section == '7~8') {
              var course = {"courseName":schedule[i].subject_name,"teacherName":schedule[i].teacher_name,"pointName":4,'place':schedule[i].place};
             Course.push(course);
            }
            if (schedule[i].course_section == '9~10') {
              var course = {"courseName":schedule[i].subject_name,"teacherName":schedule[i].teacher_name,"pointName":5,'place':schedule[i].place};
             Course.push(course);
            }
            if (schedule[i].course_section == '11~12') {
              var course = {"courseName":schedule[i].subject_name,"teacherName":schedule[i].teacher_name,"pointName":6,'place':schedule[i].place};
              Course.push(course);
            }
          }
        }
        console.log(weekday);
        DataSource.push(weekday);
        }
/*－－－－－－－－－－－课表注入－－－－－－－－－－－－－*/
        $.each(DataSource,function(i,n){//遍历数据源 填充课程表信息
          console.log('i:'+i+'n:'+n);
          $.each(n.course,function(j,k){//遍历当前星期(1,2,3,4,5,6)对应的课程信息
          console.log('j:'+j+'k:'+k);
            $("tr[name='point"+k.pointName+"'] td").eq(n.weekday-1).html("<span>"+k.courseName+"<br/><small>"+k.teacherName+"</small></span>"+"<br/><small>"+k.place+"</small></span>");//填充当前老师,课程，听课群组信息
          });
        });
/*－－－－－－－－－－－背景随机颜色－－－－－－－－－－－－*/
        var colorArray = ['bg-warning text-warning','bg-info text-info','bg-success text-success'];
        for(var i = 0;i < $('td').length; i++){
          if ($('td')[i].innerHTML !='' && $($('td')[i]).attr('colspan') != '8') {
            var color = parseInt(Math.random()*3);
            $($('td')[i]).addClass(colorArray[color]);
          }
        }
      }
    });}
  });}
});
}
 

