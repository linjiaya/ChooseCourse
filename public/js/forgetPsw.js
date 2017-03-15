//第一部分，确认校园通账号
$('#part1 .submit').on('click',function(){
  if (!$('#user').val()) {
    error('#user');
    return;
  }
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'findInformation',
      'user':   $('#user').val(),
      'typeId': $("input[name='typeId']:checked").val()
    },
    success:function(response){
      console.log(response);
      if (response.res == '0') {
        error('#user');
        return;
      }
      $('#tel').val(response.data[0].tel);
      $('.line:first .green').css('width','100%');
      setTimeout(function(){
        $('.line:first + .step').addClass('active');
      },500);
      $('#part1').hide();
      $('#part2').fadeIn(500);
    }
  });
  
});

//第二部分 设置新密码
$('#part2 .submit').on('click',function(){
  // 密码
  if (!(/^1[34578]\d{9}$/.test($('#tel').val()))) {
    error('#tel');
    return;
  }
  // 验证码
  if (!(/^\d{6}$/.test($('#verification').val()))) {
    error('#verification');
    return;
  }
  // 新密码
  if (!(/^[a-zA-Z0-9]{6,20}$/.test($('#newPsw').val()))) {
    error('#newPsw');
    return;
  }
  // 确认密码
  if ($('#checkPsw').val() != $('#newPsw').val()) {
    error('#checkPsw');
    return;
  }
  $.ajax({
  type:'get',
  url:'../ChooseCourse.jsp',
  data:{
    'api':          'findPassword',
    'user':         $('#user').val(),
    'typeId':       $("input[name='typeId']:checked").val(),
    'verification': $('#verification').val(),
    'phone':        $('#tel').val(),
    'password':     $('#newPsw').val()
  },
  success:function(response){
    console.log(response);
    if (response.res == '0') {
      error('#verification');
      return;
    }
    $('.line:last .green').css('width','100%');
    setTimeout(function(){
      $('.line:last + .step').addClass('active');
    },500);
    $('#part2').hide();
    $('#part3').fadeIn(500);
  }
});
  
});
//输入框效果
$('input').on('keyup',function(){
  errorHide('#'+this.id);
  $('#'+this.parentNode.id).removeClass('has-error');
  $('#'+this.parentNode.id).addClass('has-success');
})
function error(id){
  $(id).popover('show');
  $('#'+$(id)[0].parentNode.id).addClass('has-error')
  $(id).focus();
}
function errorHide(id){
  $(id).popover('destroy');
}


//倒计时
var countdown = 120;//发送密码倒计时120秒
function countdownTime() {//倒计时效果
  if (countdown == 0) {
    $('#sendCaptcha').attr("disabled",false);//可以获取
    $('#sendCaptcha').text("获取验证码");
    countdown = 120;
    return;
  } else {
    $('#sendCaptcha').attr("disabled", true);//禁止获取
    $('#sendCaptcha').text("重新发送(" + countdown + ")");
    countdown--;
  }
  setTimeout(function() {
    countdownTime();
  }, 2000)
};

//发送验证码
$('#sendCaptcha').on('click',function(){
 
  var theday = new Date();
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
  var time = theday.getFullYear()+timeReg(theday.getMonth()+1)+timeReg(theday.getDate())+timeReg(theday.getHours())+timeReg(theday.getMinutes());
  // console.log(theday.getFullYear());
  // console.log(timeReg(theday.getMonth()+1));
  // console.log(theday.getDate());
  // console.log(theday.getHours());
  // console.log(theday.getMinutes());
  // console.log(time);
  $.ajax({
  type:'get',
  url:'../ChooseCourse.jsp',
  data:{
    'api':'sendVerification',
    'phone':$('#tel').val(),
    'time':time
    },
    success:function(data){
      if (data.res == '0') {
        alert(data.msg);
        return;
      }
      countdownTime();
      $('#verification').val(data.data);
    }
  });
})