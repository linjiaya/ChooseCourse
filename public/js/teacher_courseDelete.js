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
    rejectByTeacher();
  });
});

//查找已选课程
function rejectByTeacher(){
   $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'rejectByTeacher',
      'teacherNum':$('header span label').attr('data')
    },
    success:function(res){
     if (res.res == '0') {
      return;
     }
    console.log(res);
    var openCourseValid = [];
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
    if (openCourseValid.length > 0) {
      var data1 = {
        isAdmin: true,
        list:openCourseValid
      }
      var html1 = template('openValidTemplate',data1);
      document.getElementById('openValidTable').innerHTML = html1;
      $('#collapseOne').collapse('show');
    }
    else{
      document.getElementById('openValidTable').innerHTML = '您暂时没有公选课的退课';
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
    else{
      document.getElementById('labTable').innerHTML = '您暂时没有实验课的退课';
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
    else{
      document.getElementById('dirTable').innerHTML = '您暂时没有方向课的退课';
    }
  }
  });
}