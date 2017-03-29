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
  });
});
var subjectNum = '';
$(function(){
  var url = window.location.search;
  subjectName = url.substring(url.lastIndexOf('=')+1, url.length);
  subjectNum = url.substring(url.indexOf('=')+1,url.indexOf('&'));
  console.log(subjectNum,subjectName)
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'getStudentBycourse',
      'subjectNum':subjectNum
    },
    success:function(res){
      console.log(res);
      if (res.res == "0") {
        document.getElementById('stuListTable').innerHTML=res.msg;
        $('#print').hide();
        return;
      }
      var data = {
        isAdmin: true,
        list:res.data
      }
      var html = template('stuListTemplate',data);
      document.getElementById('stuListTable').innerHTML = html;
      $('caption span').html(unescape(subjectName));
      $('#print').show();
    }
  })
})

function printDiv(printpage){
    console.log('success');
  var headstr = "<html><head><title></title></head><body>"; 
  var footstr = "</body>"; 
  var newstr = document.all.item(printpage).innerHTML; 
  var oldstr = document.body.innerHTML; 
  document.body.innerHTML = headstr+newstr+footstr; 
  try{
    var RegWsh = new ActiveXObject("WScript.Shell");
    hkey_key="header" ;
    RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
    hkey_key="footer";
    RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"");
  }
  catch(e){}
  window.print(); 
  document.body.innerHTML = oldstr;
}



