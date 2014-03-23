<?php
class graphVisualizer extends dspWidget {
  public $widgetId = 'graphVisualizer';

  public function menuTitle() {
    return "Graph";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/graph.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/graph.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_VISUALIZER;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'VISUALIZER'); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <canvas width='300' height='110' class="lightShadow"></canvas>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <?php parent::widgetControlButtons(); ?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <div class="spacer" style="height: 30px;"></div>
      Vu Meter:<br>
      <div class="liveVUMeter ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" style="margin: 8px 0;">
        <div class="vuTrim">
          <div class="vuGradient" style="width: 300px; height: 10px;"></div>
        </div>
      </div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>