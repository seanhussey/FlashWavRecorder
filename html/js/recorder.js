
function microphone_recorder_events()
{
  $('#status').text("Microphone recorder event: " + arguments[0]);

  switch(arguments[0]) {
  case "no_microphone_found":
    break;

  case "microphone_user_request":
    Recorder.showPermissionWindow();
    break;

  case "microphone_connected":
    Recorder.defaultSize();
    break;

  case "microphone_not_connected":
    Recorder.defaultSize();
    break;

  case "recording":
    var name = arguments[1];
    Recorder.hide();
    $('#record_button img').attr('src', 'images/stop.png');
    $('#play_button').hide();
    break;

  case "recording_stopped":
    var name = arguments[1];
    var duration = arguments[2];
    Recorder.show();
    $('#record_button img').attr('src', 'images/record.png');
    $('#play_button').show();
    break;

  case "playing":
    var name = arguments[1];
    $('#record_button img').attr('src', 'images/record.png');
    $('#play_button img').attr('src', 'images/stop.png');
    break;

  case "stopped":
    var name = arguments[1];
    $('#record_button img').attr('src', 'images/record.png');
    $('#play_button img').attr('src', 'images/play.png');
    break;

  case "saving":
    var name = arguments[1];
    break;

  case "saved":
    var name = arguments[1];
    var data = $.parseJSON(arguments[2]);
    if(data.saved) {
      $('#upload_status').css({'color': '#0F0'}).text(name + " was saved");
    } else {
      $('#upload_status').css({'color': '#F00'}).text(name + " was not saved");
    }
    break;

  case "save_failed":
    var name = arguments[1];
    var errorMessage = arguments[2];
    break;
  }
}

Recorder = {
  recorder: null,
  recorderOriginalWidth: 0,
  recorderOriginalHeight: 0,
  uploadFormId: null,
  uploadFieldName: null,
  eventHandler: "microphone_recorder_events",

  connect: function(name, attempts) {
    if(navigator.appName.indexOf("Microsoft") != -1) {
      Recorder.recorder = window[name];
    } else {
      Recorder.recorder = document[name];
    }

    if(attempts >= 40) {
      return;
    }

    // flash app needs time to load and initialize
    if(Recorder.recorder && Recorder.recorder.init) {
      Recorder.recorderOriginalWidth = Recorder.recorder.width;
      Recorder.recorderOriginalHeight = Recorder.recorder.height;
      if(Recorder.uploadFormId && $) {
        var frm = $(Recorder.uploadFormId); 
        Recorder.recorder.init(Recorder.eventHandler, frm.attr('action').toString(), Recorder.uploadFieldName, frm.serializeArray());
      } else {
        Recorder.recorder.init(Recorder.eventHandler);
      }
      return;
    }

    setTimeout(function() {Recorder.connect(name, attempts+1);}, 100);
  },

  play: function(name) {
    Recorder.recorder.play(name);
  },

  record: function(name, filename) {
    Recorder.recorder.record(name, filename);
  },

  resize: function(width, height) {
    Recorder.recorder.width = width + "px";
    Recorder.recorder.height = height + "px";
  },

  defaultSize: function(width, height) {
    Recorder.resize(Recorder.recorderOriginalWidth, Recorder.recorderOriginalHeight);
  },

  show: function() {
    Recorder.recorder.show();
  },

  hide: function() {
    Recorder.recorder.hide();
  },

  updateForm: function() {
    var frm = $(Recorder.uploadFormId); 
    Recorder.recorder.update(frm.serializeArray());
  },

  showPermissionWindow: function() {
    Recorder.resize(240, 160);
    // need to wait until app is resized before displaying permissions screen
    setTimeout(function(){Recorder.recorder.permit();}, 1);
  }
}
