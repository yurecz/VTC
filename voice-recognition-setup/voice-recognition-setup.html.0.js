          Polymer({
            ready: function () {
              var that = this;
              var element = window.parent.document.querySelector('#recognition-element');

                  if (element) {
                    element.recognition.lang = "ru-RU";
                    element.recognition.interimResults = false;

                    element.addEventListener('error', function(e) {
                      that.error = "type:" + e.detail.error+",text:" + e.detail.message;
                      that.active = false;
                    });

                    element.addEventListener('start', function(e) {
                      that.active = e.returnValue;
                    });

                    element.addEventListener('stop', function(e) {
                      element.start();
                    });

                    element.recognition.addEventListener('result', function(e) {
                      for (var i = e.resultIndex; i < e.results.length; ++i) {
                        that.text += e.results[i][0].transcript;
                        e.result = that.text;
                      }
                    });

                    try {
                      element.start();
                    } catch(err) {
                      that.active = true;
                    }

                  }
            },
            active: false,
            text: ""
          });