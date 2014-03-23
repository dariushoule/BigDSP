// GLOBAL STATES  ------------------------------------------------------------ B

var audioCache = new Object();
$(window).load(function() { bigAudioJS.runOnce(); }); // MUST BE EXECUTED ON WINDOW LOAD
var dspChainHead = null;

// GLOBAL STATES  ------------------------------------------------------------ E
// AUDIO LIBRARY --------------------------------------------------------------B

var bigAudioJS = new function() {
  var bigAudioJS = this;
  
  this.audioCTX = null;
  this.getUserMedia = null;
  this.inputMux = null;
  this.analyser = null;
  this.visualizerCallbacks = new Array();
  
  this.analyze = function() {
    requestAnimFrame(bigAudioJS.analyze);
    if(bigAudioJS.visualizerCallbacks.length <= 0) { return; }
  
    var freqBins = new Uint8Array(bigAudioJS.analyser.frequencyBinCount);
    bigAudioJS.analyser.getByteFrequencyData(freqBins);
    
    for(var i = 0; i < bigAudioJS.visualizerCallbacks.length; i++) {
      bigAudioJS.visualizerCallbacks[i](freqBins);
    }
  }
  
  this.runOnce = function() {
    try {
      // gotta deal with browser prefixes for hot off the press features.
      // pretty sure I made up 'mozAudioContext' but I bet you a shiny nickel it'll exist soon
      bigAudioJS.audioCTX = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
      
      bigAudioJS.inputMux = bigAudioJS.audioCTX.createGainNode();
      bigAudioJS.analyser = bigAudioJS.audioCTX.createAnalyser();
      bigAudioJS.inputMux.gain.value = 1;
      bigAudioJS.inputMux.connect(bigAudioJS.analyser);
      bigAudioJS.analyser.connect(bigAudioJS.audioCTX.destination);
      dspChainHead = bigAudioJS.inputMux;
      dspChainHead.next = bigAudioJS.analyser;
      dspChainHead.next.next = bigAudioJS.audioCTX.destination;
      bigAudioJS.analyser.outputMux = true;
      
      // requestAnim shim layer by Paul Irish
      window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(callback, element){
                  window.setTimeout(callback, 1000 / 60);
                };
      })();
      
      bigAudioJS.analyze();
      
      // shim for live input support.
      navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia); 
    } catch (e) {
      navigator.getUserMedia = null;
    }
  }
  
  this.addSignalProcessor = function(newNode) {
    var seekNode = dspChainHead;
    var saveNode;
    
    while(typeof seekNode.next.outputMux === "undefined") { seekNode = seekNode.next; } 
    
    seekNode.disconnect(seekNode.next);
    
    saveNode = seekNode.next;
    seekNode.next = newNode;
    newNode.next = saveNode;
    
    seekNode.connect(newNode);
    newNode.connect(newNode.next);
  }
  
  this.removeSignalProcessor = function(killNode) {
    var seekNode = dspChainHead;
    
    while(seekNode.next != killNode) { seekNode = seekNode.next; } 
    
    seekNode.disconnect(killNode);
    seekNode.connect(killNode.next);
    seekNode.next = killNode.next;
  }
  
  this.cacheFile = function(file, callback, inst) {
    if(typeof audioCache[file.replace('.','dot')] !== "undefined") {
      callback(inst, audioCache[file.replace('.','dot')]);
      return;
    }
    
    var request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      bigAudioJS.audioCTX.decodeAudioData(request.response, function(buffer) {
        audioCache[file.replace('.','dot')] = buffer;
        callback(inst, audioCache[file.replace('.','dot')]);
      }, function(){
        bigLibJS.error('Error: Couldn\'t decode audio file.');
        callback(null);
      });
    }
    request.onreadystatechange = function() {
      if (request.readyState != 4)  { return; }
      if (request.status != 200)  {
          bigLibJS.error('Couldn\'t cache audio file. Error: '+request.responseText);
          callback(null);
          return;
      } 
    };
    request.send();
  }
  
  this.getCacheFile = function(file) {
    return audioCache[file.replace('.','dot')];
  }
}

// AUDIO LIBRARY --------------------------------------------------------------E
// UTILITY LIBRARY ----------------------------------------------------------- B
var bigLibJS = new function() {
  var bigLibJS = this;
  
  this.error = function(text) {
    if (typeof console !== "undefined") {
      console.log(text);
    }
    
    $('#errorText').html(text);
    $("#niceErrorDialog").dialog("open");
  }
  
  this.getState = function(instance, field) {
    if (typeof volatileStates[instance]  === "undefined" || typeof volatileStates[instance].data[field] === "undefined") {
      return null;
    } else {
      return volatileStates[instance].data[field];
    }
  }
  
  this.setState = function(instance, field, value) {
    if (typeof volatileStates[instance] === "undefined" || typeof volatileStates[instance].data === "undefined") {
      volatileStates[instance] = new Object();
      volatileStates[instance].data = new Object();
    } 
    
    volatileStates[instance].data[field] = value;
  }
  
  this.widgetRunonce = function(instId) {
    
    $('#'+instId+' .remove').button({icons:{primary:'ui-icon-trash'}}).click(function() {
      var widgetInstance = $(this).parent().parent();
      var widgetId = widgetInstance.attr('id').split('-inst-')[0];
      eval(widgetId+'JS.cleanUpAndRemove("'+widgetInstance.attr('id')+'");');
      var index = $("section.widget:visible").index(widgetInstance);
      widgetStack.splice(index,1);
      widgetInstance.slideUp(500,function() {
        widgetInstance.remove();
        var heightDelta = 20;
        var animDelta = ($('#'+widgetId).height()+heightDelta)+"px";
        $("#audioRackContainer").animate({height: "-="+animDelta},500);
      });
    });
  }
  
  this.widgetGetInstance = function(context) {
    return $(context).parents('section.widget').attr('id');
  }
}
// UTILITY LIBRARY ------------------------------------------------------------E
