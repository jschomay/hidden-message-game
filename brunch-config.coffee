exports.config =
  # See http://brunch.io/#documentation for docs.
  paths:
    public: './'
    watched: ['src', 'vendor']
  files:
    javascripts:
      joinTo:
        'game.js': /^src/
        'vendor.js': /^vendor/
    stylesheets:
      joinTo: 'css/game.css'
    templates:
      joinTo: 'js/game.js'
  sourceMaps: false
