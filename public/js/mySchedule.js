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