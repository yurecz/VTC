
        Polymer('voice-player', {
            /* -- Attributes ------------------------------------------------ */
            autoplay: false,
            accent: 'en-US',
            text: 'You are awesome',

            /* -- Lifecycle ------------------------------------------------- */
            created: function() {
                if ('speechSynthesis' in window) {
                    this.speech = new SpeechSynthesisUtterance();
                }
                else {
                    console.error('Your browser does not support the Web Speech API');
                }
            },
            ready: function() {

                // Initialize attributes
                this.textChanged();
                this.accentChanged();

                // Initialize event listeners
                [
                    'start',
                    'end',
                    'error',
                    'pause',
                    'resume'
                ].forEach(this.propagateEvent.bind(this));

                if (this.autoplay) {
                    this.speak();
                }
            },
            accentChanged: function() {
                this.speech.lang = this.accent;
            },
            textChanged: function() {
                this.speech.text = this.text;
            },

            /* -- Methods --------------------------------------------------- */
            speak: function() {
                window.speechSynthesis.speak(this.speech);
            },
            cancel: function() {
                window.speechSynthesis.cancel();
            },
            pause: function() {
                window.speechSynthesis.pause();
            },
            resume: function() {
                window.speechSynthesis.resume();
            },

            /* -- Events ---------------------------------------------------- */
            propagateEvent: function (eventName) {
                this.speech.addEventListener(eventName, this.fire.bind(this, eventName));
            }
        });
    