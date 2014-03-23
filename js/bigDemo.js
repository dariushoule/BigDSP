// GLOBAL STATES  ------------------------------------------------------------ B
var widgetReservervationNumber = new Object();
var widgetStack = new Array();
var volatileStates = new Object();
// GLOBAL STATES  ------------------------------------------------------------ E
// RUNONCE --------------------------------------------------------------------B
$(document).ready(function(){
  var menuAnimating = false;
  $('body').click(function(){
    if(menuAnimating) return;
    $('.popDownMenu > ul').fadeOut(200);
  });

  $('#inputNav > ul').menu().hide();
  $('#inputsMenu').click(function(){
    if($('#inputNav > ul').is(':visible')) {
      $('#inputNav > ul').fadeOut(200);
      return;
    }
    menuAnimating = true;
    $('#visualsNav > ul, #processorsNav > ul').fadeOut(200, function(){ 
      $('#inputNav > ul').fadeIn(200, function (){
        menuAnimating = false;
      }); 
    });
  });
  
  $('#processorsNav > ul').menu().hide();
  $('#processorsMenu').click(function(){
    if($('#processorsNav > ul').is(':visible')) {
      $('#processorsNav > ul').fadeOut(200);
      return;
    }
    menuAnimating = true;
    $('#visualsNav > ul, #inputNav > ul').fadeOut(200, function(){ 
      $('#processorsNav > ul').fadeIn(200, function (){
        menuAnimating = false;
      }); 
    });
  });
  
  $('#visualsNav > ul').menu().hide();
  $('#visualizersMenu').click(function(){
    if($('#visualsNav > ul').is(':visible')) {
      $('#visualsNav > ul').fadeOut(200);
      return;
    }
    menuAnimating = true;
    $('#processorsNav > ul, #inputNav > ul').fadeOut(200, function(){ 
      $('#visualsNav > ul').fadeIn(200, function (){
        menuAnimating = false;
      }); 
    });
  });
  
  $("#niceErrorDialog").dialog({
      modal: true,
      autoOpen: false,
      buttons: {
        Ok: function() {
          $(this).dialog("close");
        }
      }
  });
  
  if(!Boolean(window.chrome)) {
    bigLibJS.error('Hey, so unfortunately a great deal of the cool features implemented'+
                   ' in this demo are quite bleeding edge. As a result the only browser'+
                   ' that can reliably support all of it is google Chrome! You may enter the app'+
                   ' using any browser you please, but understand hot-off-the-press features'+
                   ' cannot be supported in any other browser really. Please also note that'+
                   ' live audio input is currently ONLY supported in the chrome nightly build (canary) '+
                   ' with WebAudio getUserMedia enabled in chrome://flags.');
  }
  
  $('li > a').click(function(){
    var widgetId = $(this).attr('id');
    if(widgetId.indexOf('action_') == -1) { return; } 
    else { widgetId = widgetId.split('_')[1]; }
    
    $('#rackEmpty').hide();
    
    if(typeof widgetReservervationNumber[widgetId] === "undefined") {
      widgetReservervationNumber[widgetId] = 1;
    } else {
      widgetReservervationNumber[widgetId]++;
    }
    
    var widgetClone = $('#'+widgetId).clone().hide();
    var instId = widgetId+'-inst-'+widgetReservervationNumber[widgetId];
    $(widgetClone).attr('id',instId);
    
    var heightDelta = 20;
    var animDelta = ($('#'+widgetId).height()+heightDelta)+"px";
    if(widgetStack.length == 0) {
      animDelta = ((2*heightDelta) + ($('#'+widgetId).height() - $('#audioRackContainer').height()))+"px";
    }
    widgetStack.push(instId);
    
    $("#audioRackContainer").animate({height: "+="+animDelta},500, function(){
      $("#audioRackContainer").append(widgetClone);
      var loadResult = eval(widgetId+'JS.newWidgetInstance("'+instId+'");');
      bigLibJS.widgetRunonce(instId);
      if(loadResult != true) {
        $('#'+instId+' .remove').click();
        bigLibJS.error(loadResult);
      } else {
        $("#"+instId).fadeIn(500);
      }
    });
  });
});
// RUNONCE ------------------------------------------------------------------------------- E