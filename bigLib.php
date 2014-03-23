<?php
/* BASE WIDGET CLASS ------------------------------------------------------------------------ B */
class dspWidget {
  const CONTENT_LEFT = 100;
  const CONTENT_CENTER = 101;
  const CONTENT_RIGHT = 102;
  
  const DSP_CLASS_INPUT = 200;
  const DSP_CLASS_PROCESSOR = 201;
  const DSP_CLASS_VISUALIZER = 202;

  public function widgetHead($pluginId, $title, $bgClass='defaultWidgetBack', $additionalClasses='') {
    ?>
      <section id="<?php echo $pluginId; ?>" class="widget widgetShadow <?php echo $bgClass.' '.$additionalClasses; ?> roundGentle">
        <img src="gfx/screw.png" style="position: absolute; top: 10px; left: 10px;"><img src="gfx/screw.png" style="position: absolute; top: 10px; right: 10px;">
        <img src="gfx/screw.png" style="position: absolute; bottom: 10px; left: 10px;"><img src="gfx/screw.png" style="position: absolute; bottom: 10px; right: 10px;">
        <div class="widgetTitle"><?php echo $title; ?></div>
    <?php
  }
  
  public function widgetFoot() {
    ?>
      </section>
    <?php
  }
  
  public function widgetContentStart($zone) {
    switch($zone) {
      case self::CONTENT_LEFT: 
        echo '<div class="widgetLeftPane">';
      break;
      case self::CONTENT_CENTER: 
        echo '<div class="widgetCenter">';
      break;
      case self::CONTENT_RIGHT: 
        echo '<div class="widgetRightPane">';
      break;
    }
  }
  
  public function widgetContentEnd($zone) {
    switch($zone) {
      case self::CONTENT_LEFT: 
      case self::CONTENT_CENTER: 
      case self::CONTENT_RIGHT: 
        echo '</div>';
      break;
    }
  }
  
  public function widgetControlButtons() {
    echo '<button class="remove">Remove Widget</button>';
  }
}
/* BASE WIDGET CLASS ------------------------------------------------------------------------ E */
/* CORE PHP FRAMEWORK ----------------------------------------------------------------------- B */
class bigLib {
  private $widgets = array();

  function preLoadWidgets() {
    $plugLocation = 'plugins/';
    if ($dh = opendir($plugLocation)) {
      while (($pluginName = readdir($dh)) !== false) {
        if(is_dir($plugLocation . $pluginName) && $pluginName != '.' && $pluginName != '..') {
          require_once($plugLocation.$pluginName.'/'.$pluginName.'.php');
          $this->widgets[] = new $pluginName();
        }
      }
      closedir($dh);
    }
  }
  
  function generateWidgetStyles() {
    echo file_get_contents('styles/baseWidget.css');
    foreach($this->widgets as $widget) {
      echo "\r\n".$widget->loadStyles();
    }
  }
  
  function generateWidgetScripts() {
    foreach($this->widgets as $widget) {
      echo "\r\n".$widget->loadScripts();
    }
  }
  
  function generateWidgetWireframes() {
    foreach($this->widgets as $widget) {
      echo "\r\n".$widget->generateWireFrame();
    }
  }
  
  function generateWidgetMenuItems($class) {
    foreach($this->widgets as $widget) {
      if($widget->classification() != $class) { continue; }
      echo "<li><a id='action_".$widget->widgetId."' href='#'>".$widget->menuTitle().'</a></li>';
    }
  }
}
/* CORE PHP FRAMEWORK ----------------------------------------------------------------------- E */
?>