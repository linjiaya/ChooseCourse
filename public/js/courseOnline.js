var index = 2; //数据注入次数
var arr = [];  //定义数组接收新闻列表
var pageNum;
var pageArr = [];//页数
  // 获取选课列表
function courseInform(typeId){
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
      }
      console.log(res);
      arr = res.data;
      zhuRu();
    }
  });
}
courseInform('openCourse');

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
  console.log($('.choose:checked').val());
//   $.ajax({
//     type:'get',
//     url:'../ChooseCourse.jsp',
//     data:{
//       'api':'chooseCourse',
//       'subjectNum':$('.choose:checked').val()
//     },
//     success:function(res){

//     }
// });
})

// 注入
function zhuRu(){
  var arrs = arr.slice(0,5);
  if (arr.length > 5) {
    pageNum = parseInt(arr.length/5)+1;
    pageArr = [];
    for(var i = 1; i <= pageNum;i++){
      pageArr.push(i);
    }
    console.log(pageNum,pageArr);
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
  var arrs =  arr.slice((num-1)*5,num*5);
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

$(function () { $('#collapseOne').collapse('show')});