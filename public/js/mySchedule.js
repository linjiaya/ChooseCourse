// 判断是否有cookie
$(function(){
  $.getJSON('../cookies',function(data){
    if(data.res == '0'){
      alert(data.msg);
      window.location.href='../login.html';
      return;
    }
    if (data.data[0].typeId != '1') {
      $.getJSON('../deleteCookies',function(res){
      })
      window.location.href='../login.html';
      return;
    }
    console.log(data);
    $('header span').attr('data',data.data[0].typeId);
    $('header span label').html(data.data[0].username);
    $('header span label').attr('data',data.data[0].userId);
  });
});

//课表随机背景色
var colorArray = ['yellow','blue','green'];
$(function(){
  console.log($('td').length);
  for(var i = 0;i < $('td').length; i++){
    if ($('td')[i].innerHTML !='' && $($('td')[i]).attr('colspan') != '8') {
      console.log($('td')[i].innerHTML);
      var color = parseInt(Math.random()*3);
      $($('td')[i]).addClass(colorArray[color]);
    }
  }
})