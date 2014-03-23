<?php
class overdriveProcessor extends dspWidget {
  public $widgetId = 'overdriveProcessor';

  public function menuTitle() {
    return "Overdrive";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/overdrive.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/overdrive.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_PROCESSOR;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'Overdrive'); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <div style="padding-top:24px"></div>
      Drive (<span class="gainIndicator">1</span>):<br>
      <div class="gainSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <button class="overdriveButton">Add To Chain</button><br>
      <?php parent::widgetControlButtons(); ?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <div style="padding-top:24px"></div>
      Limit (<span class="limitIndicator">0.5</span>):<br>
      <div class="limitSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>