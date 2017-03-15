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
			var data = {
				isAdmin: true,
				list:res.data
			}
			var html = template('addCourseList',data);
			document.getElementById('collapseTwoPanel').innerHTML = html;
      $('#collapseOnePanel input').val('');
		}
	});
}
courseInform();

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
      'checkPeople':'',
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
