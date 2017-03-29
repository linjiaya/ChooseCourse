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


$(function () { 
	$('#collapseTwo').collapse('hide');
	$('#collapseThree').collapse('hide');
	$('#collapseOne').collapse('hide');
});


var courseList = [];
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
    	if(res.res == '0'){
        document.getElementById('collapseOnePanel').innerHTML = '';
        document.getElementById('collapseTwoPanel').innerHTML = '';
        document.getElementById('collapseThreePanel').innerHTML = '';
    		return;
    	}
	    console.log(res);
     		courseList = res.data;
     		if (typeId == 'openCourse') {
     			var validList = []; 
					var noValidList = [];
          var successNoValidList = [];
					for(var i = 0; i < courseList.length; i++){
						if (parseInt(courseList[i].check_people) >= (1/3)*(parseInt(courseList[i].people_max))) {
							validList.push(courseList[i]);
						}
						if (parseInt(courseList[i].check_people) < (1/3)*(parseInt(courseList[i].people_max)) && courseList[i].valid == '1') {
							noValidList.push(courseList[i]);
						}
            if (courseList[i].valid == '0') {
              successNoValidList.push(courseList[i]);
            }
					}
					if (validList.length > 0) {
						$('#collapseOne').collapse('show');
						var data = {
							isAdmin: true,
							list:validList
						}
						var html1 = template('validCourseList',data);
						document.getElementById('collapseOnePanel').innerHTML = html1;
					}
					if (noValidList.length > 0) {
						$('#collapseTwo').collapse('show');
						var data = {
							isAdmin: true,
							list:noValidList
						}
						var html2 = template('noValidCourseList',data);
						document.getElementById('collapseTwoPanel').innerHTML = html2;
					}
          if (successNoValidList.length > 0) {
            $('#collapseTwo').collapse('show');
            var data = {
              isAdmin: true,
              list:successNoValidList
            }
            var html3 = template('noValidCourseListSuccess',data);
            document.getElementById('successNoValidList').innerHTML = html3;
          }
     		}
     		else{
     			$('#collapseThree').collapse('show');
					var data = {
						isAdmin: true,
						list:courseList
					}
					var html4 = template('CourseList',data);
					document.getElementById('collapseThreePanel').innerHTML = html4;
     		}
      
		}
	});
}
courseInform('openCourse');

// 模块转换时数据改变 获取该模块选课列表
$('#headNav li').on('click',function(){
	courseInform($(this).attr('data'));
});

// 全选 取消全选
function allChecked(forLabel,name){
	if ($('#'+forLabel+'').prop('checked') == true) {
		$('input[name="'+name+'"]').prop('checked',true);
		$('label[for="'+forLabel+'"').text('取消全选');
	}
	if ($('#'+forLabel+'').prop('checked') == false){
		$('input[name="'+name+'"]').prop('checked',false);
		$('label[for="'+forLabel+'"').text('全选');
	}
}

//设置无效选课
function setNoUseCourse(){
	var subjectNumArr = [];
	for(var i = 0; i < $('input[name="openCourse"]:checked').length; i++){
		subjectNumArr.push($('input[name="openCourse"]:checked')[i].parentNode.parentNode.id);
	}
  if(subjectNumArr.length <= 0){
    alert('请选择后设置！');
    return;
  }
	$.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'setNoUseCourse',
    	'subjectNumArr':subjectNumArr.toString()
    },
    success:function(res){
    	console.log(res);
      courseInform('openCourse');
      window.location.reload();
    }
	})
	alert(subjectNumArr);
}

function updateNoUseCourse(){
  var subjectNumArr = [];
  for(var i = 0; i < $('input[name="noValidCourse"]:checked').length; i++){
    subjectNumArr.push($('input[name="noValidCourse"]:checked')[i].parentNode.parentNode.id);
  }
  if(subjectNumArr.length <= 0){
    alert('请选择后设置！');
    return;
  }
  $.ajax({
    type:'get',
    url:'../ChooseCourse.jsp',
    data:{
      'api':'updateNoUseCourse',
      'subjectNumArr':subjectNumArr.toString()
    },
    success:function(res){
      console.log(res);
      courseInform('openCourse');
      window.location.reload();
    }
  })
}