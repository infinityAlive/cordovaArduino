var app = {
  unpairDevices: {},

  initialize: function () {
    //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    $(document).on('deviceready', this.deviceReady);

    $('.navbar-nav a').on('click', function () {
      $('#navigateFunction').trigger('click');
    });
  },

  deviceReady: function () {
    arduinoHandler.initialize();
    $('#scanBlueTooth').on('touchstart', function () {
      app.scan();
    });
  },

  scan: function () {
    var intervalId;

    var listDevice = function () {
      clearInterval(intervalId);
      $('#scanBlueTooth').hide();

      output.successState('藍牙蓄勢待發、磨刀霍霍 ing');
      output.normalMessage('掃描藍牙設備中...稍待一下喔');
      bluetoothSerial.discoverUnpaired(unpairScanSuccess, app.errorHandle);
    };

    var disabledDevice = function () {
      output.warningState('藍牙沒有開啟喔 !!!');
    };

    var unpairScanSuccess = function (unpairDevices) {
      var differDevices = {};

      unpairDevices.forEach(function (unpairDevice) {
        var unpairDeviceName = unpairDevice.name;
        if (!unpairDeviceName || unpairDeviceName === '') {
          unpairDeviceName = unpairDevice.id;
        }
        differDevices[unpairDeviceName] = unpairDevice;
      });

      app.unpairDevices = Object.values(differDevices);
      showDevice(app.unpairDevices);
      bluetoothSerial.list(pairScanSuccess, app.errorHandle);

      $('#bluetoothList').off('click', 'tr .btn-success');
      $('#bluetoothList').on('click', 'tr .btn-success', function () {
        manageConnect.initialConnect($(this));
      });

      $('#bluetoothList').off('click', 'tr .btn-primary');
      $('#bluetoothList').on('click', 'tr .btn-primary', function () {
        manageConnect.bluetoothDisconnect();
      });

      setTimeout(output.clearMessage, 60000);
    };

    var pairScanSuccess = function (pairDevices) {
      var differDevices = {};

      // 周圍查無藍牙裝置
      if (app.unpairDevices.length === 0 && pairDevices === 0) {
        output.warningState('周圍沒有藍牙...sad');
        $('#scanBlueTooth').show();
      }

      pairDevices.forEach(function (pairDevice) {
        var isSame = false;
        var pairDeviceName = pairDevice.name;
        if (!pairDeviceName || pairDeviceName === '') {
          pairDeviceName = pairDevice.id;
        }

        app.unpairDevices.forEach(function (unpairDevice) {
          var unpairDeviceName = unpairDevice.name;
          if (!unpairDeviceName || unpairDeviceName === '') {
            unpairDeviceName = unpairDevice.id;
          }

          if (pairDeviceName === unpairDeviceName) {
            isSame = true;
          }
        });

        if (isSame === false) {
          differDevices[pairDeviceName] = pairDevice;
        }
      });

      showDevice(Object.values(differDevices));
      output.clearMessage();
    };

    var showDevice = function (devices) {
      var html = '';
      devices.forEach(function (device) {
        var name = device.name;
        if (!name || name === '') {
          name = device.id;
        }
        html += '<tr>';
        html += '<td>' + name + '</td>';
        html += '<td>';
        html += '<button id="' + device.id + '"' +
          'name="' + name + '"' +
          'class="btn btn-success btn-xs">連線</button>';
        html += '</td>';
        html += '<td>';
        html += '<button class="btn btn-primary btn-xs">中斷</button>';
        html += '</td>';
        html += '</tr>';
      });

      $('#bluetoothList').append(html);
    };

    var isEnabled = function () {
      bluetoothSerial.isEnabled(listDevice, disabledDevice);
    };

    $('#bluetoothList').empty();
    isEnabled();
    intervalId = setInterval(isEnabled, 10000);
  },

  errorHandle: function (error) {
    var errorMessage = JSON.stringify(error);

    output.clearMessage();
    output.warningState(errorMessage);
    $('#bluetoothList').empty();
    $('#scanBlueTooth').show();
  },
};

app.initialize();