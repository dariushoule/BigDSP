var pannerProcessorJS = new function() {
  var pannerProcessorJS = this;
  var instance;
  
  this.disconnect = function(inst) {
    var pannerNode = bigLibJS.getState(inst,'pannerNode');
    if(pannerNode == null) { return; }
    bigAudioJS.removeSignalProcessor(pannerNode);
    bigLibJS.setState(inst,'pannerNode', null);
    $('#'+instance+' .panButton').button("option", { icons: { primary: "ui-icon-play" } });
    $('#'+instance+' .panButton .ui-button-text').text('Add To Chain');
  }
  
  this.cleanUpAndRemove = function(inst) {
    pannerProcessorJS.disconnect(inst);
  }
  
  this.newWidgetInstance = function(inst) {
    instance = inst;
    
    $('#'+instance+' .panButton').button({icons:{primary:'ui-icon-play'}}).click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      if(bigLibJS.getState(instance,'chainState') != 'on') {

        var pannerNode = bigAudioJS.audioCTX.createPanner();
        bigLibJS.setState(instance,'pannerNode', pannerNode);
      
        bigAudioJS.addSignalProcessor(pannerNode);
        bigLibJS.setState(instance,'chainState', 'on');
        
        $('#'+instance+' .panButton').button("option", { icons: { primary: "ui-icon-pause" } });
        $('#'+instance+' .panButton .ui-button-text').text('Remove');
          
      } else {
        pannerProcessorJS.disconnect(instance);
        bigLibJS.setState(instance,'chainState', 'off');
      }
    });
    
    $('#'+instance+' .xSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .xIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'chainState') == 'on') {
          var pannerNode = bigLibJS.getState(instance,'pannerNode');
          pannerNode.setPosition(parseFloat(ui.value),1.0,parseFloat($('#'+instance+' .zSlider').slider("option", "value")));
        }
      },
      value: 0,
      range: "min",
      min: -1,
      max: 1,
      step: 0.01
    });
    
    $('#'+instance+' .zSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .zIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'chainState') == 'on') {
          var pannerNode = bigLibJS.getState(instance,'pannerNode');
          pannerNode.setPosition(parseFloat($('#'+instance+' .xSlider').slider("option", "value")),1.0,parseFloat(ui.value));
        }
      },
      value: 0,
      range: "min",
      min: -1,
      max: 1,
      step: 0.01
    });
    
    return true;
  }
  
}