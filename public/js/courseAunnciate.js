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


$('.print').on('click',function(){
 doPrint();
});

function doPrint() {
   document.getElementById('printID').focus();
   document.getElementById('printID').contentWindow.print();
 }
$(function () { $('#collapseFour').collapse({
  toggle: false
})});
$(function () { $('#collapseTwo').collapse('hide')});
$(function () { $('#collapseThree').collapse('toggle')});
$(function () { $('#collapseOne').collapse('show')});