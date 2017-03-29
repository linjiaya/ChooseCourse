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
  });
});

$('#publish').on('click',function(){
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'addNews',
      'typeId':$('input[name="typeCourse"]:checked').val(),
      'detail':'../file/'+$('input[name="typeCourse"]:checked').val()+'.html',
      'time':$('input[type="date"]').val()
    },
    success:function(res){
      console.log(res);
    }
  });
  return false;
})
