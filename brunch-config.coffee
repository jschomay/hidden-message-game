exports.config =
  # See http://brunch.io/#documentation for docs.
  paths:
    public: './'
    watched: ['src']
  files:
    javascripts:
      joinTo:
        'game.js': /^src/
    stylesheets:
      joinTo: 'css/game.css'
    templates:
      joinTo: 'js/game.js'
  sourceMaps: false
