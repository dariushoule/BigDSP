var toneInputJS = new function() {
  var toneInputJS = this;
  var instance;
  
  this.disconnect = function(inst) {
    var toneIn = bigLibJS.getState(inst,'toneIn');
    var toneGain = bigLibJS.getState(inst,'toneGain');
    if(toneIn == null || toneGain == null) { return; }
    toneIn.disconnect();
    toneGain.disconnect();
    bigLibJS.setState(inst,'toneIn', null);
    bigLibJS.setState(inst,'toneGain', null);
    $('#'+instance+' .toneInputButton').button("option", { icons: { primary: "ui-icon-play" } });
    $('#'+instance+' .toneInputButton .ui-button-text').text('Add To Mix');
  }
  
  this.cleanUpAndRemove = function(inst) {
    toneInputJS.disconnect(inst);
  }
  
  this.generateWaveform = function(audioEvent) {
    var outputArray = audioEvent.outputBuffer.getChannelData(0);
    var outputSpace = outputArray.length;
    for (var i = 0; i < outputSpace; ++i) {
      var sample;
      
      if(this.shape == 'sin') {
        sample = Math.sin(this.waveWritePtr);
      } else if (this.shape == 'saw') {
        sample = 0.2*((this.waveWritePtr % (2.0*Math.PI)) - Math.PI);
      } else if (this.shape == 'triangle') {
        sample = 0.8*Math.abs((this.waveWritePtr % (2.0*Math.PI)) - Math.PI);
      } else if (this.shape == 'trianglequad') {
        sample = 0.4*Math.pow(Math.abs((this.waveWritePtr % (2.0*Math.PI)) - Math.PI),2.0);
      } else if (this.shape == 'square') {
        sample = 0.3*((this.waveWritePtr % (2.0*Math.PI)) < Math.PI ? Math.PI : 0);
      }
      
      outputArray[i] = sample;
      this.waveWritePtr += this.sinWaveIncrement;
      if (this.waveWritePtr > 2.0*Math.PI) {
        this.waveWritePtr -= 2.0*Math.PI;
      }
    }
  }
  
  this.newWidgetInstance = function(inst) {
    instance = inst;
    
    $('#'+instance+' .toneInputButton').button({icons:{primary:'ui-icon-play'}}).click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      if(bigLibJS.getState(instance,'playBackState') != 'on') {
        if(isNaN(parseFloat($('#'+instance+' .frequency').val()))) {
          bigLibJS.error('Bad value in frequency input, please correct it.');
        }
        
        var toneIn = bigAudioJS.audioCTX.createJavaScriptNode(2048, 0, 1);
        var toneGain = bigAudioJS.audioCTX.createGainNode();
        bigLibJS.setState(instance,'toneIn', toneIn);
        bigLibJS.setState(instance,'toneGain', toneGain);
        toneIn.waveWritePtr = 0.0;
        toneIn.frequency = parseFloat($('#'+instance+' .frequency').val());
        toneIn.sinWaveIncrement = 2*Math.PI*toneIn.frequency/44100.0;
        toneIn.shape = $('#'+instance+' input[name=waveShape]:checked').val();
        toneIn.onaudioprocess = toneInputJS.generateWaveform;
        toneGain.gain.value = parseInt($('#'+instance+' .gainIndicator').html())/100.0;
        toneIn.connect(toneGain);
        toneGain.connect(bigAudioJS.inputMux);
        bigLibJS.setState(instance,'playBackState', 'on');
        $('#'+instance+' .toneInputButton').button("option", { icons: { primary: "ui-icon-pause" } });
        $('#'+instance+' .toneInputButton .ui-button-text').text('Remove Mix');
          
      } else {
        toneInputJS.disconnect(instance);
        bigLibJS.setState(instance,'playBackState', 'off');
        $('#'+instance+' .toneInputButton').button("option", { icons: { primary: "ui-icon-play" } });
      }
    });
    
    $('#'+instance+' input[name=waveShape]').click(function(){
      var toneIn = bigLibJS.getState(instance,'toneIn');
      if(typeof toneIn !== 'undefined' && toneIn != null) {
        toneIn.shape = $('#'+instance+' input[name=waveShape]:checked').val();
      }
    });
    
    $('#'+instance+' .toneGainSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .gainIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'playBackState') == 'on') {
          var gainNode = bigLibJS.getState(instance,'toneGain');
          gainNode.gain.value = parseInt($('#'+instance+' .gainIndicator').html())/100.0;
        }
      },
      value: 80
    });
    
    return true;
  }
  
}