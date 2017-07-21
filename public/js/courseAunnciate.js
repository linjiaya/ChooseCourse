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
    getNews('openCourse');
  });
});

//打印按钮
$('.print').on('click',function(){
 doPrint();
});
function doPrint() {
   document.getElementById('printID').focus();
   document.getElementById('printID').contentWindow.print();
 }

//查看公告
function getNews(typeId){
  $.ajax({
    type:'get',
    url:'../chooseCourse.jsp',
    data:{
      'api':'getNews',
      'typeId':typeId
    },
    success:function(res){
      if (res.res == '0') {
        $('.annouceImg p').css('text-align','center');
        $('.annouceImg p').html(res.msg);
        $('iframe').prop('src','');
        $('iframe').css('height','50px');
        $('.print').hide();
        $('.orangeTime').parent().hide();
        return;
      }
      $('.annouceImg p').html('');
      $('iframe').prop('src',res.data[0].detail);
      $('iframe').css('height','700px');
      var time = res.data[0].time.split('-');
      $('.orangeTime').parent().show();
      $('.orangeTime').html(time[0]+'年'+time[1]+'月'+time[2]+'日');
      $('.print').show();
    }
  })
}
// 模块转换时数据改变 获取该模块选课列表
$('#headNav li').on('click',function(){
  getNews($(this).attr('data'));
});


$(function () { $('#collapseFour').collapse({
  toggle: false
})});
$(function () { $('#collapseTwo').collapse('hide')});
$(function () { $('#collapseThree').collapse('toggle')});
$(function () { $('#collapseOne').collapse('show')});