<?php
class toneInput extends dspWidget {
  public $widgetId = 'toneInput';

  public function menuTitle() {
    return "Tone Generator";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/tone.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/tone.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_INPUT;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'Tone Gen', 'defaultWidgetBack', 'toneGeneratorCustomWidget'); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <div style="padding-top: 8px;text-align:center;">
        <strong>Wave Shape</strong>
        <form class="spacer waveSelect" style="margin-top: 4px;">
          <table style="margin: 0 auto;">
            <tr>
              <td>Sin:</td><td><input name="waveShape" type="radio" value="sin" checked="checked"></td>
            </tr>
            <tr>
              <td>Saw:</td><td><input name="waveShape" type="radio" value="saw"></td>
            </tr>
            <tr>
              <td>Triangle:</td><td><input name="waveShape" type="radio" value="triangle"></td>
            </tr>
            <tr>
              <td style="padding-right: 10px;">Curved Triangle:</td><td><input name="waveShape" type="radio" value="trianglequad"></td>
            </tr>
            <tr>
              <td>Square:</td><td><input name="waveShape" type="radio" value="square"></td>
            </tr>
          </table>
        </form>
      </div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <button class="toneInputButton" class="stateOff">Add To Mix</button><br>
      <?php parent::widgetControlButtons(); ?>
      <div style="margin-top:35px;">For a cool effect try mixing three tone generators with the following frequencies: 261.6, 329.6, 392.0.</div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <form class="spacer" style="height: 50px;">
        Tone Frequency: <input class="frequency" type="text" size="6" value="440"> Hz
      </form>
      Gain (<span class="gainIndicator">80</span>%):<br>
      <div class="toneGainSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>