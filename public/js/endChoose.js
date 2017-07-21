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
    news();
  });
});
function news(){
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'getNews',
      'typeId':'openCourse'
    },
    success:function(res){
      console.log(res);
      if (!res.data) {
        return;
      }
      $('#openCourseShow').fadeIn(800);
      $('#openCourseShow .endShow').html(res.data[0].endTime);
      $('#openCourseShow .timeShow').html(res.data[0].time);
      $('#openCourseShow .statusShow').html(res.msg);
    }
  });
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'getNews',
      'typeId':'labCourse'
    },
    success:function(res){
      console.log(res);
      if (!res.data) {
        return;
      }
      $('#labCourseShow').fadeIn(800);
      $('#labCourseShow .timeShow').html(res.data[0].time);
      $('#labCourseShow .endShow').html(res.data[0].endTime);
      $('#labCourseShow .statusShow').html(res.msg);
    }
  });
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'getNews',
      'typeId':'dirCourse'
    },
    success:function(res){
      console.log(res);
      if (!res.data) {
        return;
      }
      $('#dirCourseShow').fadeIn(800);
      $('#dirCourseShow .timeShow').html(res.data[0].time);
      $('#dirCourseShow .endShow').html(res.data[0].endTime);
      $('#dirCourseShow .statusShow').html(res.msg);
    }
  });
}
$('#end').on('click',function(){
  var day = new Date();
  var time = day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'endChoose',
      'typeId':$('input[type="radio"]:checked').val(),
      'endTime':time
    },
    success:function(response){
      console.log(response);
      var name = $('input[name="typeCourse"]:checked').val();
      // $('#'+name+'Show').css('opacity','1');
      $('#'+name+'Show').fadeIn(800);
      location.reload();
      // $('#'+name+'Show .timeShow').html($('input[type="date"]').val());
    }
  })

  return false;
});