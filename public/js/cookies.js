$('.safeExit').on('click',function(){
  $.getJSON('../deleteCookies',function(res){
  })
  window.location.href='../login.html';
})