// THIS WIDGET IS ONLY SUPPORTED IN CHROME NIGHTLY
var liveInputJS = new function() {
  var liveInputJS = this;
  var instance;
  
  this.instanceCount = 0;
  this.maxInstances = 1; // live inputs cannot be chained yet due to webAudio limitations.
  
  this.rcvInst = null;
  this.liveInputRcvCallback = function(stream) {
    instance = liveInputJS.rcvInst;
    var liveIn = bigAudioJS.audioCTX.createMediaStreamSource(stream);
    var liveGain = bigAudioJS.audioCTX.createGainNode();
    bigLibJS.setState(instance,'liveIn', liveIn);
    bigLibJS.setState(instance,'liveGain', liveGain);
    liveGain.gain.value = parseInt($('#'+instance+' .gainIndicator').html())/100.0;
    liveIn.connect(liveGain);
    liveGain.connect(bigAudioJS.inputMux);
    bigLibJS.setState(instance,'playBackState', 'on');
    $('#'+instance+' .liveInputButton').button("option", { icons: { primary: "ui-icon-pause" } });
    bigLibJS.setState(instance,'liveInputQueued', false);
    $('#'+instance+' .liveInputButton .ui-button-text').text('Remove Mix');
  }
  
  this.disconnect = function(inst) {
    var liveIn = bigLibJS.getState(inst,'liveIn');
    var liveGain = bigLibJS.getState(inst,'liveGain');
    if(liveIn == null || liveGain == null) { return; }
    liveIn.disconnect();
    liveGain.disconnect();
    bigLibJS.setState(inst,'liveIn', null);
    bigLibJS.setState(inst,'liveGain', null);
    bigLibJS.setState(instance,'liveInputQueued', false);
    $('#'+instance+' .liveInputButton').button("option", { icons: { primary: "ui-icon-play" } });
    $('#'+instance+' .liveInputButton .ui-button-text').text('Add To Mix');
  }
  
  this.cleanUpAndRemove = function(inst) {
    liveInputJS.disconnect(inst);
    liveInputJS.instanceCount--;
  }
  
  this.newWidgetInstance = function(inst) {
    if(liveInputJS.instanceCount + 1 > liveInputJS.maxInstances) { 
      return 'Due to technical limitations only '+liveInputJS.instanceCount+' instance(s) of this object can be loaded in the stack.';
    }
    
    if(!Boolean(navigator.getUserMedia)) {
      return 'Hey, so unfortunately a great deal of the cool features implemented'+
                   ' in this demo are quite bleeding edge. As a result the only browser'+
                   ' that can reliably support all of it is google Chrome! You may use the app'+
                   ' with any browser you please, but understand hot-off-the-press features'+
                   ' cannot be supported in any other browser really. Please also note that'+
                   ' live audio input is currently ONLY supported in the chrome nightly build (canary) '+
                   ' with WebAudio getUserMedia enabled in chrome://flags.';
    }
    
    liveInputJS.instanceCount++;
    instance = inst;
    
    $('#'+instance+' .liveInputButton').button({icons:{primary:'ui-icon-play'}}).click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      if(bigLibJS.getState(instance,'playBackState') != 'on') {
        if(bigLibJS.getState(instance,'liveInputQueued')) {
          return;
        } else {
          $('#'+instance+' .liveInputButton .ui-button-text').text('Loading...');
          bigLibJS.setState(instance,'liveInputQueued', true);
        }
        
        liveInputJS.rcvInst = instance;
        navigator.getUserMedia(
          {audio:true},
          liveInputJS.liveInputRcvCallback,
          function(e) {
            bigLibJS.setState(instance,'liveInputQueued', false);
            $('#'+instance+' .liveInputButton').button("option", { icons: { primary: "ui-icon-play" } });
            $('#'+instance+' .liveInputButton').text('Add To Mix');
            bigLibJS.error('Couldn\'t access live audio input!<br>Try the chrome nightly (canary)?');
          }
        );
          
      } else {
        liveInputJS.disconnect(instance);
        bigLibJS.setState(instance,'playBackState', 'off');
        $('#'+instance+' .liveInputButton').button("option", { icons: { primary: "ui-icon-play" } });
      }
    });
    
    $('#'+instance+' .liveGainSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .gainIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'playBackState') == 'on') {
          var gainNode = bigLibJS.getState(instance,'liveGain');
          gainNode.gain.value = parseInt($('#'+instance+' .gainIndicator').html())/100.0;
        }
      },
      value: 80
    });
    
    return true;
  }
  
}