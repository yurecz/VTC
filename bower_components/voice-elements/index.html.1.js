
                window.addEventListener('polymer-ready', function(e) {
                    var form = document.querySelector('#player-form'),
                        input = document.querySelector('#player-input'),
                        element = document.querySelector('#player-element');

                    element.setAttribute('text', input.value);

                    input.addEventListener('input', function(e) {
                        element.setAttribute('text', input.value);
                    });

                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        element.speak();
                    });
                });
                