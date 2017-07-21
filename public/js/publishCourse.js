// 判断是否有cookie
$(function(){
  $.getJSON('../cookies',function(data){
    if(data.res == '0'){
      alert(data.msg);
      window.location.href='../login.html';
      return;
    }
    //不是就清除缓存
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
    courseInform();
  });
});

// 初始页面状态
$(function () { 
	$('#collapseOne').collapse('hide');
	$('#collapseTwo').collapse('hide');
});
// 添加选课按钮 点击事件
$('#addCourse').on('click',function(){
  $('#ensureAdd').show();
	$('#collapseOnePanel').show();
  if ($('#subjectNum').prop('readonly') == 'true') {
    $('#subjectNum').prop('readonly','false');
  }
  $('#collapseOnePanel input').val('');
  $('#collapseOne').collapse('show');
  return false;
});

// 确认添加按钮 点击事件
var listArray = [];
$('#ensureAdd').on('click',function(){
  if (!$('#subject').val()) {
    error('#subject');
    return false;
  }
  if (parseInt($('#startWeek').val()) > parseInt($('#endWeek').val())) {
    error('#endWeek');
    return false;
  }
  if (!$('#place').val()) {
    return false;
  }
  if (!$('#peopleMax').val()) {
    return false;
  }
//添加选课
		$.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'setCourse',
    	'typeId':$('input[type="radio"]:checked').val(),
      'subject':$('#subject').val(),
      'credit':$('#credit').val(),
      'teacher':$('#teacher').val(),
      'startWeek':$('#startWeek').val(),
      'endWeek':$('#endWeek').val(),
      'courseSection':$('#courseSection').val(),
      'courseWeekday':$('#courseWeekday').val(),
      'place':$('#place').val(),
      'peopleMax':$('#peopleMax').val(),
      'checkPeople':'0',
      'targetMajor':'',
      'valid':'1',
      'status':'0'//是否已满
    },
    success:function(response){
      if (response.res == '0') {
        alert(response.msg);
        return;
      }
    	console.log(response);
    // 获取选课列表
    	courseInform();
    }
  });
	return false;	
});

// 模块转换时数据改变 获取该模块选课列表
$('input[type="radio"]').on('click',function(){
	courseInform();
});


var index = 2; //数据注入次数
var arr = [];  //定义数组接收列表
var pageNum;
var pageArr = [];//页数

// 获取选课列表
function courseInform(){
	$.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'courseInform',
    	'typeId':$('input[type="radio"]:checked').val()
    },
    success:function(res){
    	if(res.res == '0'){
        document.getElementById('collapseTwoPanel').innerHTML = '';
    		return;
    	}
	    console.log(res);
      $('#collapseTwo').collapse('show');
      res.data.sort(
       function compareFunction(param1,param2){
          return param2.id - param1.id; 
       });
      arr = res.data;
      var arrs = arr.slice(0,10);
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
			var data = {
				isAdmin: true,
				list:arrs
			}
			var html = template('addCourseList',data);
			document.getElementById('collapseTwoPanel').innerHTML = html;
      $('#collapseOnePanel input').val('');
		}
	});
}


// 编辑选课
function edit(id){
  $('#ensureAdd').hide();
  if ($('#collapseOnePanel').prop('display') == 'none' || $('#collapseOne').css('height') == '0px') {
   $('#collapseOnePanel').show();
   $('#collapseOne').collapse('show');
  };
  $('#subjectNum').val(id);
  $('#subjectNum').prop('readonly','true');
  $('#subject').val($('#'+id+' td:nth-child(2)').text());
  $('#credit').val($('#'+id+' td:nth-child(3)').text());
  $('#teacher').val($('#'+id+' td:nth-child(4)').attr('data'));
  $('#courseWeekday').val($('#'+id+' td:nth-child(8)').text());
  $('#place').val($('#'+id+' td:nth-child(5)').text());
  $('#peopleMax').val($('#'+id+' td:nth-child(9)').text());
  $('#peopleMax').attr('data',$('#'+id+' td:nth-child(9)').attr('data'));

  var courseSection = $('#'+id+' td:nth-child(7)').text().substr(0, $('#'+id+' td:nth-child(7)').text().length-1)
  $('#courseSection').val(courseSection);
  var startWeek = $('#'+id+' td:nth-child(6)').text().substr(0,1)
  $('#startWeek').val(startWeek);
  var endWeek = $('#'+id+' td:nth-child(6)').text().substr(2,3);
  $('#endWeek').val();
}

// 确认修改
$('#ensureUpdate').on('click',function(){
  if (!$('#subjectNum').val()) {
    return false;
  }
  if (!$('#subject').val()) {
    return false;
  }
  if (parseInt($('#startWeek').val()) > parseInt($('#endWeek').val())) {
    error('#endWeek');
    return false;
  }
  if (!$('#place').val()) {
    return false;
  }
  if (!$('#peopleMax').val()) {
    return false;
  }
  //修改选课
    $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'updateCourse',
      'typeId':$('input[type="radio"]:checked').val(),
      'subjectNum':$('#subjectNum').val(),
      'subject':$('#subject').val(),
      'credit':$('#credit').val(),
      'teacher':$('#teacher').val(),
      'startWeek':$('#startWeek').val(),
      'endWeek':$('#endWeek').val(),
      'courseSection':$('#courseSection').val(),
      'courseWeekday':$('#courseWeekday').val(),
      'place':$('#place').val(),
      'peopleMax':$('#peopleMax').val(),
      'checkPeople':$('#peopleMax').attr('data'),
      'targetMajor':'',
      'valid':'1',//1是有效
      'status':'0'//是否已满
    },
    success:function(response){
      if (response.res == '0') {
        alert(response.msg);
        return;
      }
      console.log(response);
    // 获取选课列表
      courseInform();
    }
  });
  return false; 
});

// 删除选课
function Delete(id){
  $.ajax({
   type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'deleteCourse',
      'typeId':$('input[type="radio"]:checked').val(),
      'subjectNum':id
    },
    success:function(response){
      console.log(response);
    // 获取选课列表
      courseInform();
    }
  });
}
/*
$('#collapseOnePanel input').on('keyup',function(){
  errorHide('#'+this.id);
});*/


// 错误显示
function error(id){
  $(id).popover('show');
  $(id).focus();
}
// 错误显示消失
function errorHide(id){
  $(id).popover('destroy');
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
  var html = template('addCourseList',data);
  document.getElementById('collapseTwoPanel').innerHTML = html;
  return page;
}
function last(){
  if (Page == 1) {
    $('#last').addClass('disabled');
    return;
  }
  Page--;
  page(Page);
  return page;
}
function next(){
  if (Page == pageNum) {
    $('#next').addClass('disabled');
    return;
  }
  Page++;
  page(Page);
  return Page;
}

