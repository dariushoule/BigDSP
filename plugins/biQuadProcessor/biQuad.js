var biQuadProcessorJS = new function() {
  var biQuadProcessorJS = this;
  var instance;
  
  this.disconnect = function(inst) {
    var biQuadNode = bigLibJS.getState(inst,'biQuadNode');
    if(biQuadNode == null) { return; }
    bigAudioJS.removeSignalProcessor(biQuadNode);
    bigLibJS.setState(inst,'biQuadNode', null);
    $('#'+instance+' .biQuadButton').button("option", { icons: { primary: "ui-icon-play" } });
    $('#'+instance+' .biQuadButton .ui-button-text').text('Add To Chain');
  }
  
  this.cleanUpAndRemove = function(inst) {
    biQuadProcessorJS.disconnect(inst);
  }
  
  this.newWidgetInstance = function(inst) {
    instance = inst;
    
    $('#'+instance+' .biQuadButton').button({icons:{primary:'ui-icon-play'}}).click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      if(bigLibJS.getState(instance,'chainState') != 'on') {
        if(isNaN(parseFloat($('#'+instance+' .frequency').val()))) {
          bigLibJS.error('Bad value in frequency input, please correct it.');
        }
        
        var biQuadNode = bigAudioJS.audioCTX.createBiquadFilter();
        biQuadNode.type = parseInt($('#'+instance+' input[name=filter]:checked').val());
        biQuadNode.frequency.value = parseFloat($('#'+instance+' .frequency').val());
        biQuadNode.gain.value = parseFloat($('#'+instance+' .bqGainSlider').slider("option", "value"));
        biQuadNode.Q.value = parseFloat($('#'+instance+' .bqQSlider').slider("option", "value"));
        bigLibJS.setState(instance,'biQuadNode', biQuadNode);
      
        bigAudioJS.addSignalProcessor(biQuadNode);
        bigLibJS.setState(instance,'chainState', 'on');
        
        $('#'+instance+' .biQuadButton').button("option", { icons: { primary: "ui-icon-pause" } });
        $('#'+instance+' .biQuadButton .ui-button-text').text('Remove');
          
      } else {
        biQuadProcessorJS.disconnect(instance);
        bigLibJS.setState(instance,'chainState', 'off');
      }
    });
    
    $('#'+instance+' input[name=filter]').click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      var biQuadNode = bigLibJS.getState(instance,'biQuadNode');
      var type = parseInt($('#'+instance+' input[name=filter]:checked').val());
      
      switch(type) {
        case 0: 
        case 3:
          $('#'+instance+' .frequency').val("440");
          break;
        case 1: 
        case 4:
          $('#'+instance+' .frequency').val("1760");
          break;
        case 2: 
        case 5:
          $('#'+instance+' .frequency').val("980");
          break;
      }
      
      if(type > 2) {
        $('#'+instance+' .bqGainSlider').slider("option", "disabled", false);
      } else {
        $('#'+instance+' .bqGainSlider').slider("option", "disabled", true);
      }

      if(typeof biQuadNode !== 'undefined' && biQuadNode != null) {
        biQuadNode.type = type;
      }
    });
    
    $('#'+instance+' .bqGainSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .gainIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'chainState') == 'on') {
          var biQuadNode = bigLibJS.getState(instance,'biQuadNode');
          biQuadNode.gain.value = parseInt(ui.value);
        }
      },
      value: 0,
      range: "min",
      min: -40,
      max: 40,
      disabled: true
    });
    
    $('#'+instance+' .bqQSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .QIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'chainState') == 'on') {
          var biQuadNode = bigLibJS.getState(instance,'biQuadNode');
          biQuadNode.Q.value = parseInt(ui.value);
        }
      },
      value: 1,
      range: "min",
      min: 1,
      max: 1000
    });
    
    $('#'+instance+' input[name=filter]:first').click();
    return true;
  }
  
}