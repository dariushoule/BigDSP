/*
 * The wave shape used is based on the code demonstrated at Google I/O 2012. 
 * http://webaudio-io2012.appspot.com/
 */

var overdriveProcessorJS = new function() {
  var overdriveProcessorJS = this;
  var instance;
  
  this.disconnect = function(inst) {
    var driveNode = bigLibJS.getState(inst,'driveNode');
    var limitNode = bigLibJS.getState(inst,'limitNode');
    var waveShaper = bigLibJS.getState(inst,'waveShaper');
    if(driveNode == null || limitNode == null || waveShaper == null) { return; }
    bigAudioJS.removeSignalProcessor(driveNode);
    bigAudioJS.removeSignalProcessor(waveShaper);
    bigAudioJS.removeSignalProcessor(limitNode);
    bigLibJS.setState(inst,'driveNode', null);
    bigLibJS.setState(inst,'limitNode', null);
    bigLibJS.setState(inst,'waveShaper', null);
    $('#'+instance+' .overdriveButton').button("option", { icons: { primary: "ui-icon-play" } });
    $('#'+instance+' .overdriveButton .ui-button-text').text('Add To Chain');
  }
  
  this.cleanUpAndRemove = function(inst) {
    overdriveProcessorJS.disconnect(inst);
  }
  
  this.threshold = Math.pow(10.0, 0.05 * -27); 
  this.headroom = Math.pow(10.0, 0.05 * 21); 

  this.e4 = function(x, k) {
      return 1.0 - Math.exp(-k * x);
  }

  this.shape = function(x) {
      var linearThreshold = overdriveProcessorJS.threshold;
      var linearHeadroom = overdriveProcessorJS.headroom;

      var maximum = 1.05 * linearHeadroom * linearThreshold;
      var kk = (maximum - linearThreshold);

      var sign = x < 0 ? -1 : +1;
      var absx = Math.abs(x);

      var shapedInput = absx < linearThreshold ? absx : linearThreshold + kk * overdriveProcessorJS.e4(absx - linearThreshold, 1.0 / kk);
      shapedInput *= sign;

      return shapedInput;
  }
  
  this.newWidgetInstance = function(inst) {
    instance = inst;
    
    $('#'+instance+' .overdriveButton').button({icons:{primary:'ui-icon-play'}}).click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      if(bigLibJS.getState(instance,'chainState') != 'on') {
        
        var driveNode = bigAudioJS.audioCTX.createGainNode();
        var waveShaper = bigAudioJS.audioCTX.createWaveShaper();
        var limitNode = bigAudioJS.audioCTX.createGainNode();
        bigLibJS.setState(instance,'driveNode', driveNode);
        bigLibJS.setState(instance,'waveShaper', waveShaper);
        bigLibJS.setState(instance,'limitNode', limitNode);
        driveNode.gain.value = parseFloat($('#'+instance+' .gainSlider').slider("option", "value"));
        limitNode.gain.value = parseFloat($('#'+instance+' .limitSlider').slider("option", "value"));
        
        var curve = new Float32Array(65536); 
        var n = 65536;
        var n2 = n / 2;
        var x = 0;

        for (var i = 0; i < n2; ++i) {
            x = i / n2;
            x = overdriveProcessorJS.shape(x);

            curve[n2 + i] = x;
            curve[n2 - i - 1] = -x;
        }
        waveShaper.curve = curve;
      
        bigAudioJS.addSignalProcessor(driveNode);
        bigAudioJS.addSignalProcessor(waveShaper);
        bigAudioJS.addSignalProcessor(limitNode);
        bigLibJS.setState(instance,'chainState', 'on');
        
        $('#'+instance+' .overdriveButton').button("option", { icons: { primary: "ui-icon-pause" } });
        $('#'+instance+' .overdriveButton .ui-button-text').text('Remove');
          
      } else {
        overdriveProcessorJS.disconnect(instance);
        bigLibJS.setState(instance,'chainState', 'off');
      }
    });
    
    $('#'+instance+' .gainSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .gainIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'chainState') == 'on') {
          var driveNode = bigLibJS.getState(instance,'driveNode');
          driveNode.gain.value = parseFloat(ui.value);
        }
      },
      value: 1,
      range: "min",
      min: 0,
      max: 10,
      step: 0.1
    });
    
    $('#'+instance+' .limitSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .limitIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'chainState') == 'on') {
          var limitNode = bigLibJS.getState(instance,'limitNode');
          limitNode.gain.value = parseFloat(ui.value);
        }
      },
      value: 0.5,
      range: "min",
      min: 0,
      max: 1,
      step: 0.1
    });

    return true;
  }
  
}