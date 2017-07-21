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
var detail,detailHtml;
$('#inputfile').on('change',function(){
  detail = $('#inputfile').val().substr($('#inputfile').val().lastIndexOf('\\')+1,$('#inputfile').val().length);
  $('.filename').html(detail);
  return false;
})
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
      var file = res.data[0].detail.substr(res.data[0].detail.lastIndexOf('/')+1,res.data[0].detail.length);
      $('#openCourseShow .fileShow').html(file);
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
      var file = res.data[0].detail.substr(res.data[0].detail.lastIndexOf('/')+1,res.data[0].detail.length);
      $('#labCourseShow .fileShow').html(file);
      $('#labCourseShow .timeShow').html(res.data[0].time);
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
      var file = res.data[0].detail.substr(res.data[0].detail.lastIndexOf('/')+1,res.data[0].detail.length);
      $('#dirCourseShow .fileShow').html(file);
      $('#dirCourseShow .timeShow').html(res.data[0].time);
      $('#dirCourseShow .statusShow').html(res.msg);
    }
  });
}
$('#publish').on('click',function(){
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'addNews',
      'typeId':$('input[name="typeCourse"]:checked').val(),
      'detail':'../file/'+detail,
      'time':$('input[type="date"]').val()
    },
    success:function(res){
      console.log(res);
      alert(res.msg);
      var name = $('input[name="typeCourse"]:checked').val();
      // $('#'+name+'Show').css('opacity','1');
      $('#'+name+'Show').fadeIn(800);
      $('#'+name+'Show .fileShow').html(detail);
      $('#'+name+'Show .timeShow').html($('input[type="date"]').val());
      location.reload();
      return false;
    }
  });
  return false;
})
