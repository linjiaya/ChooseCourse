// 判断是否有cookie
$(function(){
  $.getJSON('../cookies',function(data){
    if(data.res == '0'){
      alert(data.msg);
      window.location.href='../login.html';
      return;
    }
    if (data.data[0].typeId != '0') {
      $.getJSON('../deleteCookies',function(res){
      })
      window.location.href='../login.html';
      return;
    }
    console.log(data);
    $('header span').attr('data',data.data[0].typeId);
    $('header span label').html(data.data[0].userId);
    $('header span label').attr('data',data.data[0].userId);
    findChoosed()
  });
});

//查找已选课程
function findChoosed(){
   $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'rejectTeacher'
    },
    success:function(res){
     if (res.res == '0') {
      return;
     }
    console.log(res);
    var openCourseValid = [];
    var openCourseNoValid = [];
    var labCourse = [];
    var dirCourse = [];
    for(var i = 0; i < res.data.length; i++){
      switch(res.data[i].status){
        case '0':res.data[i].status = '未审批';break;
        case '1':res.data[i].status = '已同意';break;
        case '2':res.data[i].status = '不同意';break;
      }
      if (res.data[i].type_id == 'openCourse') {
        openCourseValid.push(res.data[i]);
      }
      if (res.data[i].type_id == 'labCourse') {
        labCourse.push(res.data[i]);
      }
      if (res.data[i].type_id == 'dirCourse') {
        dirCourse.push(res.data[i]);
      }
    }
    if (openCourseValid.length > 0 || openCourseNoValid.length > 0) {
      var data1 = {
        isAdmin: true,
        list:openCourseValid
      }
      var html1 = template('openValidTemplate',data1);
      document.getElementById('openValidTable').innerHTML = html1;
      $('#collapseOne').collapse('show');
    }
    if (labCourse.length > 0) {
    var data3 = {
        isAdmin: true,
        list:labCourse
      }
      var html3 = template('labTemplate',data3);
      document.getElementById('labTable').innerHTML = html3;
      $('#collapseTwo').collapse('show');
    }
    if (dirCourse.length > 0) {
      var data4 = {
        isAdmin: true,
        list:dirCourse
      }
      var html4 = template('dirTemplate',data4);
      document.getElementById('dirTable').innerHTML = html4;
      $('#collapseThree').collapse('show');
    }
  }
  });
}
var subjectNum = 0;
//获取所有老师
function agree(id,teacher){
  subjectNum = id;
  $('#myModalLabel span').html(id);
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'getTeacher'
    },
    success:function(res){
      $('#myModal').modal('show');
      console.log(res)
      var data = {
        isAdmin: true,
        list:res.data
      }
      var html = template('teacherTemplate',data);
      document.getElementById('teacherSelect').innerHTML = html;
      $('#teacherSelect').val(teacher);
    }
  })
}

function disagree(id,teacher){
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'refusedApplication',
      'teacherNum':teacher.toString(),
      'subjectNum':id.toString()
    },
    success:function(res){
      $('#myModal').modal('hide');
     console.log(res);
     $('tr[id="'+subjectNum+'"] td:nth-child(9)').html('已同意');
    }
  })
}
// 重新安排老师
$('#closeModal').on('click',function(){
  console.log($('#teacherSelect').val());
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'agreeApplication',
      'teacherNum':$('#teacherSelect').val().toString(),
      'subjectNum':subjectNum.toString()
    },
    success:function(res){
      $('#myModal').modal('hide');
     console.log(res);
     $('tr[id="'+subjectNum+'"] td:nth-child(9)').html('已同意');
    }
  })
})