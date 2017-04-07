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
    courseInform('openCourse');
  });
});

var index = 2; //数据注入次数
var arr = [];  //定义数组接收列表
var pageNum;
var pageArr = [];//页数
var is_open = false;
  // 获取选课列表
function courseInform(typeId){
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'getNews',
      'typeId':typeId
    },
    success:function(result){
      arr = [];
      if (result.res == '0') {
        $('#collapseOnePanel').html(result.msg);
        $('#submitDiv').hide();
        document.getElementById('pageNum').innerHTML = '';
        return;
      }
      $.ajax({
      type:'get',
      url:'../ChooseCourse.jsp',
      data:{
        'api':'courseInform',
        'typeId':typeId
      },
      success:function(res){
        if (res.res == '0') {
          document.getElementById('collapseOnePanel').innerHTML = '';
          $('#submitDiv').hide();
          return;
        }
        $('#submitDiv').show();
        for(var i = 0; i < res.data.length; i++){
          if (res.data[i].valid == '1') {
            arr.push(res.data[i]);
          }
          res.data[i].checked = '0';
        }
        console.log(res);
        console.log('valid',arr);
        findChoosed(typeId);
      }
    });
    }
  });
}


//获取已选列表
function findChoosed(typeId){
   $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'courseChoosed',
      'typeId':typeId,
      'stuNum':$('header span label').attr('data')
    },
    success:function(res){
     if (res.res == '0') {
      zhuRu();
      return;
     }
    console.log(res);
     for(var i = 0; i < arr.length; i++){
      for(var j = 0; j < res.data.length; j++){
        if (res.data[j].subject_num == arr[i].id) {
          arr[i].checked = '1';
        }
      }
     }
    zhuRu();
    }
  });
}


// 模块转换时数据改变 获取该模块选课列表
$('#headNav li').on('click',function(){
  courseInform($(this).attr('data'));
});

//排序
$('#search').on('click',function(){
  if ($('#searchCondition').val() == 'section') {//上课节数
    arr.sort(
       function compareFunction(param1,param2){
            return param1.course_section.substr(0,param1.course_section.indexOf('~')) - param2.course_section.substr(0,param2.course_section.indexOf('~')); 
       }
   );
  zhuRu();
  return;
  }
  if ($('#searchCondition').val() == 'teacher') {//上课老师
    arr.sort(
       function compareFunction(param1,param2){
           return param1.teacher_name.localeCompare(param2.teacher_name);
       }
   );
  zhuRu();
  return;
  }
  if ($('#searchCondition').val() == 'credit') {//学分
    arr.sort(
       function compareFunction(param1,param2){
          return param1.credit - param2.credit; 
       }
   );
  zhuRu();
  return;
  }
  if ($('#searchCondition').val() == 'week') {//星期
    for(var i = 0;i < arr.length; i++){
      switch(arr[i].course_weekday){
        case '星期一':arr[i].week = 1;break;
        case '星期二':arr[i].week = 2;break;
        case '星期三':arr[i].week = 3;break;
        case '星期四':arr[i].week = 4;break;
        case '星期五':arr[i].week = 5;break;
        case '星期六':arr[i].week = 6;break;
        case '星期日':arr[i].week = 7;break;
      }
    }
    arr.sort(
       function compareFunction(param1,param2){
          return param1.week - param2.week; 
       }
   );
  zhuRu();
  return;
  }
  if ($('#searchCondition').val() == 'all') {//课程号
    arr.sort(
       function compareFunction(param1,param2){
          return param1.id - param2.id; 
       }
   );
  zhuRu();
  return;
  }
});

// 选择
$('#submit').on('click',function(){
  var subjectNumArr = [];
  for(var i = 0; i < $('.choose:checked').length; i++){
    subjectNumArr.push($('.choose:checked')[i].parentNode.parentNode.id);
  }
  console.log(subjectNumArr);
  if ($('#headNav li.active').attr('data') == 'openCourse') {
    if (!subjectNumArr.length) {alert('请先选择课程！');return;};
    if (subjectNumArr.length > 2) {
      alert('公选课最多选两门哟！');
      return;
    }
  }
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'chooseCourse',
      'stuNum':$('header span label').attr('data'),
      'stuName':$('header span label').html(),
      'subjectNum':subjectNumArr,
      'status':'1',//是否退选
      'typeId':$('#headNav li.active').attr('data'),//选课类型
      'is_open':'1'//是否有效
    },
    success:function(res){
      console.log(res);
      if (res.res == '0') {
        alert(res.msg);
        return;
      }
      alert('选课成功！');
      window.location.reload();
    }
});
});


// 注入
function zhuRu(){
  var arrs = arr.slice(0,10);
  //页数注入
  if (arr.length > 10) {
    pageNum = Math.ceil(arr.length/10);
    pageArr = [];
    for(var i = 1; i <= pageNum;i++){
      pageArr.push(i);
    }
    // console.log(pageNum,pageArr);
    var data = {
      isAdmin: true,
      list:pageArr
    }
    var html2 = template('pageNav',data);
    document.getElementById('pageNum').innerHTML = html2;
  }
  else{
    document.getElementById('pageNum').innerHTML = '';
  }

  // 课程注入
  $('#collapseOne').collapse('show');
  var data = {
    isAdmin: true,
    list:arrs
  }
  var html1 = template('onlineCourse',data);
  document.getElementById('collapseOnePanel').innerHTML = html1;
}

//分页显示
var Page = 1;
function page(num){
  Page = num;
  $('#last').removeClass('disabled');
  $('#next').removeClass('disabled');
  $('.pageli').removeClass('active');
  $('.pageli:nth-of-type('+(num+1)+')').addClass('active');
  var arrs =  arr.slice((num-1)*10,num*10);
  var data = {
    isAdmin: true,
    list:arrs
  }
  var html1 = template('onlineCourse',data);
  document.getElementById('collapseOnePanel').innerHTML = html1;
  return page;
}
function last(){
  if (Page == 1) {
    $('#last').addClass('disabled');
    return;
  }
  Page = Page - 1;
  page(Page);
  return page;
}
function next(){
  if (Page == pageNum) {
    $('#next').addClass('disabled');
    return;
  }
  Page = Page + 1;
  page(Page);
  return Page;
}

// $(function () { $('#collapseOne').collapse('show')});