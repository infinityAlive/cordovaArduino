var manageConnect = {
  initialConnect: function (target) {
    var tr = target.parents('tr');
    var deviceId = target.prop('id');
    var deviceName = target.prop('name');

    var successConnect = function () {
      var html = '';
      output.clearMessage();
      output.successState(deviceName + ' 藍牙成功連結囉');

      $('#bluetoothList').empty();
      html += '<tr>';
      html += '<td>';
      html += '<button id="' + deviceId + '" ' +
        'name="' + deviceName + '"' +
        'class="btn btn-primary btn-xs">揮揮衣袖 離開藍牙</button>';
      html += '</td>';
      html += '</tr>';
      $('#bluetoothList').append(html);

      $('#' + deviceId).off('click');
      $('#' + deviceId).on('click', function () {
        manageConnect.bluetoothDisconnect(deviceName);
      });
    };

    output.normalMessage(deviceId + ' 藍牙開始咀嚼中...');

    // 把其他藍牙設備清除
    tr.prevAll().remove();
    tr.nextAll().remove();
    bluetoothSerial.connect(deviceId, successConnect, app.errorHandle);
  },

  bluetoothDisconnect: function (deviceName) {
    var onDisconnect = function () {
      output.warningState('藍牙設備連線 say goodbye');

      // 清除所有藍牙資訊與狀態
      bluetoothSerial.clear(function () {
        output.clearMessage();
      }, app.errorHandle);
      bluetoothSerial.clearDeviceDiscoveredListener();
    };

    output.normalMessage(deviceName + ' 藍牙連線取消中...');
    bluetoothSerial.disconnect(onDisconnect, app.errorHandle);

    $('#bluetoothList').empty();
    $('#scanBlueTooth').show();
  },
};