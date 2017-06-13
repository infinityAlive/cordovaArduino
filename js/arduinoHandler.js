var arduinoHandler = {
  LED_OFF: 'OFF',

  initialize: function () {
    this.drawRainbowLED();
    this.makePalette();
    this.blendColor();
    this.lightDiyLED();
  },

  drawRainbowLED: function () {
    $('#rainbowLED').on('click', function () {
      var confirmConnected = function () {
        var ledLights = [];

        $('.switchLED').each(function () {
          if ($(this).is(':checked')) {
            ledLights.push($(this).val());
          }
        });

        if (ledLights.length > 0) {
          output.normalMessage('稍待一會兒，彩虹快出現囉 !!! 顏色依序是 ' + ledLights);
          // 傳送資料至 Arduino
          ledLights.forEach(function (ledLight) {
            bluetoothSerial.write(ledLight);
          });
        } else {
          output.normalMessage('彩虹消失中...');
          bluetoothSerial.write(arduinoHandler.LED_OFF);
        }
      };

      setTimeout(function () {
        bluetoothSerial.isConnected(confirmConnected, arduinoHandler.connectUnavailable);
      }, 1000)
    });
  },

  // 選擇調色盤 LED 數量
  makePalette: function () {
    $('#selectLEDcount').on('change', function () {
      var ledCount = $(this).val();
      var ledRangeForRGB_0 = $('#ledRangeForRGB_0');
      var clone_ledRangeForRGB;

      ledRangeForRGB_0.nextAll('div[name=ledRangeForRGB]').remove();

      for (var i = 0; i < ledCount; i++) {
        clone_ledRangeForRGB = ledRangeForRGB_0.clone();
        clone_ledRangeForRGB.prop('id', 'ledRangeForRGB_' + (i + 1));
        clone_ledRangeForRGB.find('span').text(i + 1);
        clone_ledRangeForRGB.show();
        clone_ledRangeForRGB.find('input[name=rgbValue]').each(function () {
          var target = $(this);
          var rgbName = target.prop('placeholder');
          clone_ledRangeForRGB.find('input[name=RED], input[name=GREEN], input[name=BLUE]').each(
            function () {
              if (rgbName === $(this).prop('name')) {
                target.val($(this).val());
              }
            }
          );
        });
        $('div[name=ledRangeForRGB]:last').after(clone_ledRangeForRGB);
      }
      $('#paletteLED').show();
    })
  },

  blendColor: function () {
    var displayColor = function (ledRangeForRGB) {
      var red = ledRangeForRGB.find('input[type=range][name=RED]').val();
      var green = ledRangeForRGB.find('input[type=range][name=GREEN]').val();
      var blue = ledRangeForRGB.find('input[type=range][name=BLUE]').val();
      var rgbColor = red + ',' + green + ',' + blue;
      var blend = ledRangeForRGB.find('input[name=blend]');

      blend.removeAttr('placeholder').css(
        {
          'background-color': 'rgb(' + rgbColor + ')'
        }
      );

      blend.val(rgbColor);
    };

    $('#timeInterval').text($('#timer').val());

    $('#colorfulLED').on('change', 'input[name=RED], input[name=GREEN], input[name=BLUE]',
      function () {
        var rgbName = $(this).prop('name');
        var rgbValue = $(this).val();
        var ledRangeForRGB = $(this).parents('div[name=ledRangeForRGB]');

        ledRangeForRGB.find('input[name=rgbValue]').each(function () {
          if (rgbName === $(this).prop('placeholder')) {
            $(this).val(rgbValue);
          }
        });

        displayColor(ledRangeForRGB);
      });

    $('#colorfulLED').on('change', 'input[name=rgbValue]', function () {
      var rgbName = $(this).prop('placeholder');
      var rgbValue = $(this).val();
      var ledRangeForRGB = $(this).parents('div[name=ledRangeForRGB]');

      ledRangeForRGB.find('input[name=RED], input[name=GREEN], input[name=BLUE]').each(function () {
        if (rgbName === $(this).prop('name')) {
          $(this).val(rgbValue);
        }
      });

      displayColor(ledRangeForRGB);
    });

    $('#timer').on('change', function () {
      $('#timeInterval').text($(this).val());
    });
  },

  lightDiyLED: function () {
    $('#paletteLEDsubmit').on('click', function () {
      var paletteLEDs = [];
      var paletteLEDsData;
      var confirmConnected = function () {
        output.normalMessage('調色盤燈光啟動囉！');

        if (paletteLEDs.length > 0) {
          bluetoothSerial.write(paletteLEDsData);
        } else {
          bluetoothSerial.write(arduinoHandler.LED_OFF);
        }
      };

      // 依序組合時間間隔和各組 RGB 值
      paletteLEDs.push($('#timeInterval').text());
      $('div[name=ledRangeForRGB]').each(function () {
        if ($(this).prop('id') !== 'ledRangeForRGB_0') {
          paletteLEDs.push($(this).find('input[name=blend]').val());
        }
      });
      paletteLEDsData = paletteLEDs.join(';');

      setTimeout(function () {
        bluetoothSerial.isConnected(confirmConnected, arduinoHandler.connectUnavailable);
      }, 500);
    });

    $('#paletteLEDoff').on('click', function () {
      output.normalMessage('洗洗睡！');

      setTimeout(function () {
        bluetoothSerial.isConnected(function () {
          bluetoothSerial.write(arduinoHandler.LED_OFF);
        }, arduinoHandler.connectUnavailable);
      }, 1000);
    });
  },

  connectUnavailable: function () {
    output.warningState('藍牙未連結 或 藍牙斷了...');
    output.clearMessage();
    $('#bluetoothList').empty();
    $('#scanBlueTooth').show();
  },
};
//arduinoHandler.initialize();
