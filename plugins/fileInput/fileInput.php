<?php
class fileInput extends dspWidget {
  public $widgetId = 'fileInput';

  public function menuTitle() {
    return "File Based Input";
  }
  
  public function loadStyles() {
    return file_get_contents(dirname(__FILE__).'/file.css');
  }
  
  public function loadScripts() {
    return file_get_contents(dirname(__FILE__).'/file.js');
  }
  
  public function classification() {
    return dspWidget::DSP_CLASS_INPUT;
  }
  
  public function generateWireFrame() { ?>
    <?php parent::widgetHead($this->widgetId, 'File Input', 'defaultWidgetBack', 'fileInCustomWidget'); ?>
    <img src="gfx/spinner.gif" style="position: absolute;left: 130px;top: 90px;">
    <img src="gfx/spinner.gif" style="position: absolute;right: 130px;top: 90px;">
    <?php parent::widgetContentStart(dspWidget::CONTENT_LEFT); ?>
      <div class="sampleLibrary whiteVertGrad gradFix lightShadow">
        <ul>
          <li>No files loaded...</li>
        </ul>
      </div>
      <div class="sampleControls">
        <div class="controlPane" style="float:left;">
          <a href="plugins/fileInput/upload.php" target="blank"><span class="ui-icon ui-icon-plus" style="float:left;"></span> &nbsp;Add</a>
        </div>
        <div class="controlPane" style="float:right;width: 70px;">
          <a class="refreshFiles" style="cursor: pointer;"><span class="ui-icon ui-icon-refresh" style="float:left;"></span> &nbsp;Refresh</a>
        </div>
      </div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_LEFT); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_CENTER); ?>
      <button class="fileInputButton" class="stateOff">Add To Mix</button><br>
      <?php parent::widgetControlButtons(); ?>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_CENTER); ?>
    <?php parent::widgetContentStart(dspWidget::CONTENT_RIGHT); ?>
      <div class="mediaInfo whiteVertGrad gradFix roundGentle lightShadow">
        File not loaded...
      </div>
      Gain (<span class="gainIndicator">80</span>%):<br>
      <div class="fileGainSlider" style="margin: 8px 0;"></div>
    <?php parent::widgetContentEnd(dspWidget::CONTENT_RIGHT); ?>
    <?php parent::widgetFoot();?>
    <?php
  }
}
?>