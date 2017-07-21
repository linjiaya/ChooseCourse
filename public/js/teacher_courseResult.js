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
    courseInformByteacher('openCourse');
  });
});

//查找需要授课的课程
function courseInformByteacher(typeId){
   $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'courseInformByteacher',
      'typeId':typeId,
      'teacher':$('header span label').attr('data')
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
      if (res.data[i].type_id == 'openCourse') {
        if (res.data[i].valid == '1') {
          openCourseValid.push(res.data[i]);
        }
        if (res.data[i].valid == '0') {
          openCourseNoValid.push(res.data[i]);
        }
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
    if (openCourseNoValid.length > 0) {
      var data2 = {
        isAdmin: true,
        list:openCourseNoValid
      }
      var html2 = template('openNoValidTemplate',data2);
      document.getElementById('openNoValidTable').innerHTML = html2;
      $('#collapseTwo').collapse('show');
    }
  
    if (labCourse.length > 0) {
    var data3 = {
        isAdmin: true,
        list:labCourse
      }
      var html3 = template('labTemplate',data3);
      document.getElementById('labTable').innerHTML = html3;
      $('#collapseThree').collapse('show');
    }
    if (dirCourse.length > 0) {
      var data4 = {
        isAdmin: true,
        list:dirCourse
      }
      var html4 = template('dirTemplate',data4);
      document.getElementById('dirTable').innerHTML = html4;
      $('#collapseFour').collapse('show');
    }
  }
  });
}

// 模块转换时数据改变 获取该模块选课列表
$('#headNav li').on('click',function(){
  courseInformByteacher($(this).attr('data'));
});

/*------------------------------- 退课部分 --------------------------------------*/
$('#collapseOne button').on('click',function(){
  Delete('openCourse');
});
$('#collapseTwo button').on('click',function(){
  Delete('openCourseNo');
});
$('#collapseThree button').on('click',function(){
  Delete('labCourse');
});
$('#collapseFour button').on('click',function(){
  Delete('dirCourse');
});
function Delete(name){
  var subjectNumArr = [];
  var typeId = name;
  for(var i = 0; i < $('input[name="'+name+'"]:checked').length; i++){
    subjectNumArr.push($('input[name="'+name+'"]:checked')[i].value);
  }
  if (name == 'openCourseNo') {
    typeId = 'openCourse';
  }
  
  console.log('subjectNumArr',subjectNumArr);
  if (subjectNumArr.length <= 0) {
    alert('您尚未选择课程！');
    return;
  }
  var day = new Date();
  var time = day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
  console.log(time);console.log('typeId',typeId);
 $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'courseDeletebyTeacher',
      'teacherNum':$('header span label').attr('data'),
      'subjectNumArr':subjectNumArr,
      'time':time,
      'typeId':typeId,
      'status':'0'
    },
    success:function(res){
      console.log(res);
      // window.location.reload();
      alert(res.msg);
    }
  });
}
/*--------------------- 跳转学生名单 ----------------------------*/
function goList(subjectNum,subjectName){
  window.location.href = 'peopleList.html?subjectNum='+subjectNum+'&subjectName='+escape(subjectName);
}