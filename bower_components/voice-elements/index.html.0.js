
                window.addEventListener('polymer-ready', function(e) {
                    var form = document.querySelector('#mi-form'),
                        element = document.querySelector('#mi-elemento');

                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        element.speak();
                    });
                });
                