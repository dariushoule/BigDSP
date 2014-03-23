<?php
class liveInput extends dspWidget {
  public $widgetId = 'liveInput';

  public function menuTitle() {
    return "Live Input (Experimental)";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/live.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/live.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_INPUT;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'Live Input'); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <div style="padding-top: 32px;">
        For live audio inputs use the chrome nightly build with Web Audio getUserMedia enabled in <a href="chrome://flags">chrome://flags</a>.<br>
      </div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <button class="liveInputButton" class="stateOff">Add To Mix</button><br>
      <?php parent::widgetControlButtons(); ?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <div class="spacer" style="height: 30px;"></div>
      Gain (<span class="gainIndicator">80</span>%):<br>
      <div class="liveGainSlider" style="margin: 8px 0;"></div>
      <?php
      /*Vu Meter:<br>
      <div class="liveVUMeterLeft" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" style="margin: 8px 0;">
        <div class="vuTrim">
          <div class="vuGradient" style="width: 300px; height: 10px;"></div>
        </div>
      </div>
      <div class="liveVUMeterRight" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" style="margin: 8px 0;">
        <div class="vuTrim">
          <div class="vuGradient" style="width: 300px; height: 10px;"></div>
        </div>
      </div>*/?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>