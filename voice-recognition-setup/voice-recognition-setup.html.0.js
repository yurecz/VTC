          Polymer('voice-recognition-setup',{
            voiceProvider: null,
            realStop: false,
            active: false,
            textI: "",
            textF:"",
            errorCode:"",
            errorMessage: "",
            attached: function () {
              var that = this;
              this.voiceProvider = document.querySelector('#recognition-element');

                  if (this.voiceProvider) {
                    this.voiceProvider.recognition.lang = "ru-RU";
                    this.voiceProvider.recognition.interimResults = true;
                    this.voiceProvider.recognition.continuous = true;

                    this.voiceProvider.recognition.addEventListener('error', this.errorRecognition.bind(this) );

                    this.voiceProvider.recognition.addEventListener('start', this.startRecognition.bind(this) );

                    this.voiceProvider.recognition.addEventListener('end', this.endRecognition.bind(this) );

                    this.voiceProvider.recognition.addEventListener('result', this.resultRecognition.bind(this) );

                    try {
                      this.voiceProvider.recognition.start();
                    } catch(err) {
                      this.active = true;
                    }

                  }
            },
            toggleActivate:function(){
              if (!this.active){
                this.realStop = true;
                this.voiceProvider.recognition.abort();
              } else {
                this.voiceProvider.recognition.start();
              }
            },
            startRecognition:function(e){
              this.active = e.returnValue;
            },
            endRecognition:function(e){
              if (!this.realStop){
                this.voiceProvider.recognition.start();
              } else {
                this.active = false;
                this.realStop = false;
              }
            },
            resultRecognition:function(e){
                      for (var i = e.resultIndex; i < e.results.length; ++i) {
                        if (e.results[i].isFinal) {
                          this.textF = "";
                          this.textF += e.results[i][0].transcript;
                        } else {
                          this.textI = "";
                          this.textI += e.results[i][0].transcript;
                        }
                      }
            },
            errorRecognition:function(e){
              if (e.error != "no-speech"){
                this.errorCode = e.error;
                this.errorMessage = e.message;
                this.active = false;
              } else {
                this.voiceProvider.recognition.star();
              }
            }
          });