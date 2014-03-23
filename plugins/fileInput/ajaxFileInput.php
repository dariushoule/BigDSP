<?php
  
  if($_GET['action']=='mediaList') {
    require_once('getid3/getid3.php');
    
    $usedFileNames = Array();
    
    $getID3 = new getID3();
    
    $mediaDir = 'uploads/';
    if ($dh = opendir($mediaDir)) {
      while (($fileName = readdir($dh)) !== false) {
        if(!is_dir($fileName)) {
          $meta = $getID3->analyze($mediaDir.$fileName);
          getid3_lib::CopyTagsToComments($meta);
          
          echo '<div class="mediaMetaNode">';
            echo '<div class="fileName">';
              echo $fileName;
            echo '</div>';
            
            echo '<div class="artist">';
              echo '<span style="font-weight: normal;">Artist:</span> '.((!empty($meta['comments_html']['artist']))?implode('<br>', $meta['comments_html']['artist']):'No Artist.');
            echo '</div>';
            
            echo '<div class="album">';
              echo '<span style="font-weight: normal;">Album:</span> '.((!empty($meta['comments_html']['album']))?implode('<br>', $meta['comments_html']['album']):'No Album.');
            echo '</div>';
            
            echo '<div class="duration">';
              echo '<span style="font-weight: normal;">Duration:</span> '.$meta['playtime_string'];
            echo '</div>';
            
            echo '<div class="bitRate">';
              echo '<span style="font-weight: normal;">Bitrate:</span> '.round($meta['audio']['bitrate']/1000.0,3).' kbps ('.$meta['audio']['bitrate_mode'].')';
            echo '</div>';
            
            echo '<div class="sampleRate">';
              echo '<span style="font-weight: normal;">Sample Rate:</span> '.round($meta['audio']['sample_rate']/1000.0,3).' kHz';
            echo '</div>';
            
            echo '<div class="title" style="display: none;">'; 
              $title = (!empty($meta['comments_html']['title']))?implode('<br>', $meta['comments_html']['title']):$fileName;
              if(isset($usedFileNames[$title])) {
                $usedFileNames[$title]++;
                $title .= ' ('.$usedFileNames[$title].')';
              } else {
                $usedFileNames[$title] = 0;
              }
              echo $title;
            echo '</div>';
            
            echo '<div class="format">';
              echo '<span style="font-weight: normal;">Format:</span> '.$meta['fileformat'].((!empty($meta['audio']['encoder']))?' - '.$meta['audio']['encoder']:'');
            echo '</div>';
            
            echo '<div class="codec">';
              echo '<span style="font-weight: normal;">Codec:</span> '.((!empty($meta['audio']['encoder']))?$meta['audio']['encoder']:'Unknown');
            echo '</div>';
            
            echo '<div class="size">';
              echo '<span style="font-weight: normal;">Size:</span> '.round(($meta['filesize']/1024.0)/1024.0,3).' MB';
            echo '</div>';
            
            echo '<div class="channels">';
              echo '<span style="font-weight: normal;">Channels:</span> '.$meta['audio']['channels'].' : '.$meta['audio']['channelmode'];
            echo '</div>';
          echo '</div>';
        }
      }
      closedir($dh);
    }
  } else if($_GET['action']=='removeMedia') {
    if(empty($_GET['media']) || !ctype_alnum($_GET['action']) || empty($_GET['ext']) || !ctype_alnum($_GET['ext'])) {
      die('Error [400]: Illegal filename characters.');
    }
    unlink('uploads/'.$_GET['media'].'.'.$_GET['ext']);
    echo 'OK';
  } else {
    echo "Error [400]: malformed request.";
  }
?>
