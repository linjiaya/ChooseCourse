// 判断是否有cookie，有就直接跳转
$(function(){
  $.getJSON('cookies',function(data){
    if(data.res == '0'){
      return;
    }
    if (data.data[0].typeId == '1') {window.location.href= 'student/courseAnnunciate.html';}
    if (data.data[0].typeId == '2') {window.location.href = 'teacher/courseAnnunciate.html';}
    if (data.data[0].typeId == '0') {window.location.href = 'admin/publishAunnciate.html';}
  });
});

$('#submit').on('click',function(){
  submit();
});

// 登录
function submit() {
  var cookieDay = 1000*60*3;//三分钟
  if ($('#user').val().length > 5 || $('#user').val().length <= 0) {
    error('#user');
    return;
  }
  if (!$('#password').val()) {
    error('#password');
    return;
  }
  if ($('#remember').prop('checked')) {
    cookieDay = 1000*60*60*24*3;//3天
  };
  $.ajax({
  type:'get',
  url:'../ChooseCourse.jsp',
  data:{
    'api':'login',
    'user':     $('#user').val(),
    'password': $('#password').val(),
    'typeId':   $("#typeId").val(),
    'cookieDay':      cookieDay
  },
  success:function(response){
    console.log(response);
    if (response.res == '0') {
      alert(response.msg);
      return;
    }
    if (response.data[0].stu_name) {
      window.location.href = 'student/courseAnnunciate.html';
      return;
    }
    if (response.data[0].teacher_name) {
      window.location.href = 'teacher/courseAnnunciate.html';
      return;
    }
    if (response.data[0].user) {
      window.location.href = 'admin/publishAunnciate.html';
      return;
    }
    
    }
  });
  // $.ajax({
  //   type:'get',
  //   url:'http://192.168.31.238:8080/linjia/user/login',
  //   cache: false,
  //   crossDomain: true,
  //   async: true,
  //   contentType: 'application/json;charset=utf8',
  //   dataType: 'jsonp',
  //   jsonp: 'callback',
  //   timeout: 10000,
  //   data:{
  //     'id':'admin02',
  //     'password':'qwerty',
  //     'type':'3'
  //   },
  //   success:function(response){
  //     console.log(response);
  //   }

  // });
}

// 键盘输入时输入框颜色提醒
$('input').on('keyup',function(){
  errorHide('#'+this.id);
  $('#'+this.parentNode.id).removeClass('has-error');
  $('#'+this.parentNode.id).addClass('has-success');
  if ($('#user').val().length > 5 || $('#user').val().length <= 0) {
    $('#userP').removeClass('has-success');
    $('#userP').addClass('has-error');
  }
  if ($('#password').val().length < 6 || $('#password').val().length > 20) {
    $('#pswP').removeClass('has-success');
    $('#pswP').addClass('has-error');
  }
})

// 错误显示
function error(id){
  $(id).popover('show');
  $('#'+$(id)[0].parentNode.id).addClass('has-error')
  $(id).focus();
}
// 错误显示消失
function errorHide(id){
  $(id).popover('destroy');
}
