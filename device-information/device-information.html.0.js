
          Polymer({
            ready: function () {
              var that = this;
              chrome.runtime.getPlatformInfo(function(info) {
                that.info = info;
              });

            },
            appname: chrome.runtime.getManifest().name
          });

