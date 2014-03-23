<!DOCTYPE html>
<html>
  <head>
    <title>BigDSP - Sound Uploader!</title>
    <script type="text/javascript" src="../../js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="../../js/jquery-ui-1.9.1.custom.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../../styles/jquery-ui-1.9.1.custom.min.css">
    <link rel="stylesheet" type="text/css" href="plupload/jquery.ui.plupload/css/jquery.ui.plupload.css">
    <link rel="stylesheet" type="text/css" href="../../styles/bigDemo.css">
    <script type="text/javascript" src="plupload/plupload.full.js"></script>
    <script type="text/javascript" src="plupload/jquery.ui.plupload/jquery.ui.plupload.js"></script>
    <script type="text/javascript">
      $(document).ready(function(){
        $("#uploader").plupload({
          runtimes : 'flash,silverlight,html5',
          url : 'uploadRcv.php',
          max_file_size : '10mb',
          chunk_size : '1mb',
          unique_names : true,
          filters : [
            {title : "Web-Audio Supported Media", extensions : "m4a,aac,mp3,wav,ogg,webm"},
          ],
          flash_swf_url : 'plupload/plupload.flash.swf',
          silverlight_xap_url : 'plupload/plupload.silverlight.xap'
      });

      $('form').submit(function(e) {
        var uploader = $('#uploader').plupload('getUploader');
          if (uploader.files.length > 0) {
            uploader.bind('StateChanged', function() {
              if (uploader.files.length === (uploader.total.uploaded + uploader.total.failed)) {
                alert('Files successfully added to sample library!');
              }
            });
            uploader.start();
          } else {
            alert('You must at least upload one file.');
          }
          return false;
        });
      });
    </script>
    <!--[if gte IE 9]>
      <style type="text/css">
        /* IE9 Multi-stop gradient fix */ 
        .gradFix {filter: none;}
      </style>
    <![endif]-->
  </head>
  <body class="textureBG">
    <div id="contentWrapper">
      <img src="../../gfx/logo.png" class="">
      <nav id="mainNav">
        <ul>
          <li id="inputsMenu" style="cursor: default;">File Uploader</li>
        </ul>
      </nav>
      <div id="uploader">
        <p>Your browser doesn't have Flash, Silverlight or HTML5 support.</p>
      </div>
      <footer id="footer">
        bigDSP is a modular web-audio/canvas based implementation of a digital sound processing chain with visualization tools.<br>
      </footer>
    </div>
  </body>
</html>