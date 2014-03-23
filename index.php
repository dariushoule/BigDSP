<?php 
  require_once('bigLib.php');
  $bigLib = new bigLib();
  $bigLib->preLoadWidgets(); 
?><!DOCTYPE html>
<html>
  <head>
    <title>BigDSP - WebAudio Sound Processing</title>
    <script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.9.1.custom.min.js"></script>
    <script type="text/javascript" src="js/bigAudio.js"></script>
    <script type="text/javascript" src="js/bigDemo.js"></script>
    <link rel="stylesheet" type="text/css" href="styles/jquery-ui-1.9.1.custom.min.css">
    <link rel="stylesheet" type="text/css" href="styles/bigDemo.css">
    <!--[if gte IE 9]>
      <style type="text/css">
        /* IE9 Multi-stop gradient fix */ 
        .gradFix {filter: none;}
      </style>
    <![endif]-->
    <style>
      <?php $bigLib->generateWidgetStyles(); ?>
    </style>
    <script type="text/javascript">
      <?php $bigLib->generateWidgetScripts(); ?>
    </script>
  </head>
  <body class="textureBG">
    <div id="niceErrorDialog" title="Oh shucks, something broke!">
      <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span><span id="errorText"></span></p>
    </div>
    <div id="widgetCloningVat">
      <?php $bigLib->generateWidgetWireframes(); ?>
    </div>
    <div id="contentWrapper">
      <img src="gfx/logo.png" class="">
      <nav id="mainNav">
        <ul>
          <li id="inputsMenu">+ Inputs</li>
          <li id="processorsMenu">+ Processors</li>
          <li id="visualizersMenu">+ Visualizers</li>
        </ul>
      </nav>
      <nav id="inputNav" class="popDownMenu">
        <ul>
          <?php $bigLib->generateWidgetMenuItems(dspWidget::DSP_CLASS_INPUT); ?>
        </ul>
      </nav>
      <nav id="processorsNav" class="popDownMenu">
        <ul>
          <?php $bigLib->generateWidgetMenuItems(dspWidget::DSP_CLASS_PROCESSOR); ?>
        </ul>
      </nav>
      <nav id="visualsNav" class="popDownMenu">
        <ul>
          <?php $bigLib->generateWidgetMenuItems(dspWidget::DSP_CLASS_VISUALIZER); ?>
        </ul>
      </nav>
      <div id="audioRackContainer" class="lightShadow roundGentle">
        <div class="railLeft"></div><div class="railRight"></div>
        <div id="rackEmpty">No audio modules loaded...</div>
      </div>
      <footer id="footer">
        bigDSP is a modular web-audio/canvas based implementation of a digital sound processing chain with visualization tools.<br>
      </footer>
    </div>
  </body>
</html>