var fileInputJS = new function() {
  var fileInputJS = this;
  var instance;
  var fileInputQueued;
  var mediaDownloading = false;
  var widgetLoading = false;
  
  this.selectDefault = function(inst) {
    $('#'+inst+' .sampleLibrary ul li:first').click();
  }
  
  this.downloadMediaList = function(inst) {
    mediaDownloading = true;
    $('#'+inst+' .mediaInfo').hide();
    $('#'+inst+' .sampleLibrary').hide();
    
    $.get('plugins/fileInput/ajaxFileInput.php', {action: 'mediaList'}, function(data) {
      $('#'+inst+' .mediaInfo').html(data);
      
      $('#'+inst+' .sampleLibrary ul').html('');
      $('#'+inst+' .mediaMetaNode .title').each(function(index) {
          $('#'+inst+' .sampleLibrary ul').append(
            '<li class="selectable">'+
              $(this).html()+
              '<span class="ui-icon ui-icon-trash trashFile" style="float:right;"></span>'+
            '</li>'
          );
      });
      
      $('#'+inst+' .sampleLibrary ul li').click(function(){
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .sampleLibrary ul li').addClass('selectable');
        $(this).removeClass('selectable');
        var title = $(this).text();
        
        $('#'+instance+' .mediaMetaNode').hide();
        $('#'+instance+' .mediaMetaNode .title').each(function(index) {
          if($(this).text() == title) {
            $('#'+instance+' .mediaMetaNode').hide();
            $(this).parent().fadeIn(400);
            bigLibJS.setState(instance,'fileInput', $(this).parent().children('.fileName').text());
          }
        });
      });
      
      $('#'+inst+' .mediaInfo').fadeIn(400);
      $('#'+inst+' .sampleLibrary').fadeIn(400, function(){
        $('#'+inst+' .sampleLibrary ul li:first').click();
      });
      
      $('#'+inst+' .sampleLibrary ul li span.trashFile').click(function(){
        instance = bigLibJS.widgetGetInstance(this);
        var title = $(this).parent().text();
        $('#'+instance+' .mediaMetaNode .title').each(function(index) {
          if($(this).text() == title) {
            var mediaFile = $(this).siblings('.fileName').text();
            var mediaExt = mediaFile.split('.')[1];
            mediaFile = mediaFile.split('.')[0];
            $.get('plugins/fileInput/ajaxFileInput.php', {action: 'removeMedia', media:mediaFile, ext: mediaExt}, function(data) {
              if(data != 'OK') {
                bigLibJS.error('Can\'t delete the file! Error: '+data);
              } else {
                fileInputJS.downloadMediaList(instance);
              }
            }); 
          }
        }); 
      });
      
      mediaDownloading = false;
    });
  }
  
  this.disconnect = function(inst) {
    var fileIn = bigLibJS.getState(inst,'fileIn');
    var fileGain = bigLibJS.getState(inst,'fileGain');
    if(fileIn == null || fileGain == null) { return; }
    fileIn.disconnect();
    fileGain.disconnect();
    bigLibJS.setState(inst,'fileIn', null);
    bigLibJS.setState(inst,'fileGain', null);
    fileInputQueued = false;
    $('#'+instance+' .fileInputButton').button("option", { icons: { primary: "ui-icon-play" } });
    $('#'+instance+' .fileInputButton .ui-button-text').text('Add To Mix');
  }
  
  this.cleanUpAndRemove = function(inst) {
    fileInputJS.disconnect(inst);
  }
  
  this.playQueuedFile = function(inst, buffer) {
    if(inst == null) { // load failed, bail.
      fileInputQueued = false;
      $('#'+instance+' .fileInputButton').button("option", { icons: { primary: "ui-icon-play" } });
      $('#'+instance+' .fileInputButton .ui-button-text').text('Add To Mix');
      return;
    }
    
    instance = inst;
    
    var fileIn = bigAudioJS.audioCTX.createBufferSource(); 
    fileIn.buffer = buffer;
    var fileGain = bigAudioJS.audioCTX.createGainNode();
    bigLibJS.setState(instance,'fileIn', fileIn);
    bigLibJS.setState(instance,'fileGain', fileGain);
    fileGain.gain.value = parseInt($('#'+instance+' .gainIndicator').html())/100.0;
    fileIn.connect(fileGain);
    fileGain.connect(bigAudioJS.inputMux);
    fileIn.noteOn(0);
    
    bigLibJS.setState(instance,'playBackState', 'on');
    $('#'+instance+' .fileInputButton').button("option", { icons: { primary: "ui-icon-pause" } });
    $('#'+instance+' .fileInputButton .ui-button-text').text('Remove Mix');
    fileInputQueued = false;
  }
  
  this.newWidgetInstance = function(inst) {
    if(mediaDownloading || widgetLoading || fileInputQueued) {
      return "Another file input has the stack locked, please try again when it is done loading.";
    }
    
    widgetLoading = true;
    instance = inst;
    
    fileInputJS.downloadMediaList(inst);
    
    $('#'+instance+' .fileInputButton').button({icons:{primary:'ui-icon-play'}}).click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      
      if($('#'+inst+' .sampleLibrary ul li').length <= 0) {
        bigLibJS.error('No file to add to mix!');
        return;
      }
      
      if(bigLibJS.getState(instance,'playBackState') != 'on') {
        if(fileInputQueued) {
          bigLibJS.error('Another file is already in the playback queue, try again in a moment.');
          return;
        } else {
          $('#'+instance+' .fileInputButton .ui-button-text').text('Loading...');
          fileInputQueued = true;
        }
        
        bigAudioJS.cacheFile('plugins/fileInput/uploads/'+bigLibJS.getState(instance,'fileInput'), fileInputJS.playQueuedFile, instance);
      } else {
        fileInputJS.disconnect(instance);
        bigLibJS.setState(instance,'playBackState', 'off');
        $('#'+instance+' .fileInputButton').button("option", { icons: { primary: "ui-icon-play" } });
      }
    });
    
    $('#'+instance+' .refreshFiles').click(function(){
      instance = bigLibJS.widgetGetInstance(this);
      fileInputJS.downloadMediaList(instance);
    });
    
    $('#'+instance+' .fileGainSlider').slider({
      change: function( event, ui ) {
        instance = bigLibJS.widgetGetInstance(this);
        $('#'+instance+' .gainIndicator').html(ui.value);
        if(bigLibJS.getState(instance,'playBackState') == 'on') {
          var gainNode = bigLibJS.getState(instance,'fileGain');
          gainNode.gain.value = parseInt($('#'+instance+' .gainIndicator').html())/100.0;
        }
      },
      value: 80
    });
    
    widgetLoading = false;
    return true;
  }
  
}