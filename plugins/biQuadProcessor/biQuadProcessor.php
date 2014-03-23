<?php
class biQuadProcessor extends dspWidget {
  public $widgetId = 'biQuadProcessor';

  public function menuTitle() {
    return "Biquad Filter";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/biQuad.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/biQuad.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_PROCESSOR;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'Biquad Filter', 'defaultWidgetBack', 'biQuadCustomWidget'); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <div style="padding-top: 8px;text-align:center;">
        <strong>Filter Type</strong>
        <form class="spacer filterSelect" style="margin-top: 4px;">
          <table style="margin: 0 auto;">
            <tr>
              <td>Low Pass:</td><td><input name="filter" type="radio" value="0" checked="checked"></td>
            </tr>
            <tr>
              <td>High Pass:</td><td><input name="filter" type="radio" value="1"></td>
            </tr>
            <tr>
              <td>Band Pass:</td><td><input name="filter" type="radio" value="2"></td>
            </tr>
            <tr>
              <td style="padding-right: 20px;">Low Shelf:</td><td><input name="filter" type="radio" value="3"></td>
            </tr>
            <tr>
              <td>High Shelf:</td><td><input name="filter" type="radio" value="4"></td>
            </tr>
            <tr>
              <td>Peaking:</td><td><input name="filter" type="radio" value="5"></td>
            </tr>
          </table>
        </form>
      </div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <button class="biQuadButton">Add To Chain</button><br>
      <?php parent::widgetControlButtons(); ?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <div style="padding-top:12px"></div>
      Frequency: <input class="frequency" type="text" size="6"> Hz
      <div style="padding-top:8px"></div>
      Q-Factor (<span class="QIndicator">1</span>qf):<br>
      <div class="bqQSlider" style="margin: 8px 0;"></div>
      <br>
      Gain (+<span class="gainIndicator">0</span>db):<br>
      <div class="bqGainSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>