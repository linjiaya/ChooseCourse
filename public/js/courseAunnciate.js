$('#print').on('click',function(){
 
});

$('.panel-title a').on('click',function(){
  $('.panel-title a[aria-expanded="false"] span').removeClass('glyphicon-chevron-down');
  $('.panel-title a[aria-expanded="false"] span').addClass('glyphicon-chevron-up');
  $('.panel-title a[aria-expanded="true"] span').removeClass('glyphicon-chevron-up');
  $('.panel-title a[aria-expanded="true"] span').addClass('glyphicon-chevron-down');

});


$(function () { $('#collapseFour').collapse({
  toggle: false
})});
$(function () { $('#collapseTwo').collapse('hide')});
$(function () { $('#collapseThree').collapse('toggle')});
$(function () { $('#collapseOne').collapse('show')});