// THIS WIDGET IS ONLY SUPPORTED IN CHROME NIGHTLY
var graphVisualizerJS = new function() {
  var graphVisualizerJS = this;
  var instance;
  
  this.instanceCount = 0;
  this.maxInstances = 1; 
  this.canvas = null;
  this.ctx = null;

  this.cleanUpAndRemove = function(inst) {
    graphVisualizerJS.instanceCount--;
    for(var i = 0; i < bigAudioJS.visualizerCallbacks.length; i++) {
      if(bigAudioJS.visualizerCallbacks[i] == graphVisualizerJS.updateVisualizer) {
        bigAudioJS.visualizerCallbacks.splice(i,1);
      }
    }
  }
  
  this.updateVisualizer = function(fData) {
    var canvas = $('#'+instance+' canvas')[0];
    var analysisDomain = fData.length - 300; // cut off unhearable freq's
    var reductionFactor = 3;
    var magnitude;
    var barW = Math.round(300 / (analysisDomain/reductionFactor));
    var maxF = 0;
    
    graphVisualizerJS.ctx.clearRect(0, 0, 300, 110);
    
    var barPtr = 0;
    for (var i = 0; i+reductionFactor < analysisDomain; i+=reductionFactor) {
      magnitude = 0;
      for(var j = 0; j < reductionFactor; j++) { magnitude += fData[i+j]; } 
      magnitude /= reductionFactor;
      
      graphVisualizerJS.ctx.fillRect(barPtr, 110, barW, -Math.round(110*(magnitude/256)));
      barPtr+=barW;
    }
    
    magnitude = 0;
    for(var i = 0; i < analysisDomain; i++) {
      magnitude += fData[i];
    }
    
    magnitude = Math.round(300*((magnitude / analysisDomain)/256));
    $('#'+instance+' .liveVUMeter .vuTrim').width(magnitude);
  }
  
  this.newWidgetInstance = function(inst) {
    if(graphVisualizerJS.instanceCount + 1 > graphVisualizerJS.maxInstances) { 
      return 'Due to technical limitations only '+graphVisualizerJS.instanceCount+' instance(s) of this object can be loaded in the stack.';
    }
    
    graphVisualizerJS.instanceCount++;
    instance = inst;
    
    graphVisualizerJS.canvas = $('#'+instance+' canvas')[0];
    graphVisualizerJS.ctx = graphVisualizerJS.canvas.getContext('2d');
    graphVisualizerJS.ctx.fillStyle = "white";
   
    bigAudioJS.visualizerCallbacks.push(graphVisualizerJS.updateVisualizer);
    
    return true;
  }
  
}