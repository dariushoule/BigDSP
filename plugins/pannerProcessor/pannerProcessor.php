<?php
class pannerProcessor extends dspWidget {
  public $widgetId = 'pannerProcessor';

  public function menuTitle() {
    return "Panner";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/panner.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/panner.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_PROCESSOR;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'Panner'); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <div style="padding: 8px;"></div>
      Z (<span class="zIndicator">0</span>):<br>
      <div class="zSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <button class="panButton">Add To Chain</button><br>
      <?php parent::widgetControlButtons(); ?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <div style="padding: 8px;"></div>
      X (<span class="xIndicator">0</span>):<br>
      <div class="xSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>