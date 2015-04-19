(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel="stylesheet"][href]:not([data-autoreload="false"]'))
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();

require.register("src/game", function(exports, require, module) {
module.exports = function() {
  var fetchQuote, frame, onFrameEnter, onSaveQuote, onSkipQuote, quoteApiUrl, render, saveQuote, saveQuoteUrl, start, states, updateFrame;
  quoteApiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.iheartquotes.com%2Fapi%2Fv1%2Frandom%3Fmax_characters%3D75%26format%3Djson'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  saveQuoteUrl = "http://localhost:8000";
  saveQuote = function(quote) {
    var error, success;
    console.log("Saving \"" + quote + "\"...");
    success = function() {
      console.log("success");
      return updateFrame("quoteSaved", null);
    };
    error = function(xhr) {
      throw new Error(xhr.responseText);
    };
    return Zepto.ajax({
      type: 'POST',
      url: saveQuoteUrl,
      data: {
        quote: quote
      },
      success: success,
      error: error
    });
  };
  states = {
    loading: {
      onEnter: function() {
        return fetchQuote();
      },
      onEvent: function(eventData, scope, trigger) {
        var quote;
        if (trigger === "quoteLoaded") {
          quote = eventData;
          scope.quote = quote;
          return ["editQuote", scope];
        } else {
          return ["loading", scope];
        }
      },
      getRenderData: function(scope) {
        return {
          quote: "",
          feedback: "LOADING...",
          showEditActions: false
        };
      }
    },
    editQuote: {
      onEnter: function() {},
      onEvent: function(eventData, scope, trigger) {
        if (trigger === "saveQuote") {
          scope.quote = eventData;
          return ["saving", scope];
        } else if (trigger === "skipQuote") {
          return ["loading", scope];
        } else {
          return ["editQuote", scope];
        }
      },
      getRenderData: function(scope) {
        return {
          quote: scope.quote,
          feedback: "You can edit this quote, save it, or skip it.",
          showEditActions: true
        };
      }
    },
    saving: {
      onEnter: function(quote) {
        return saveQuote(quote);
      },
      onEvent: function(eventData, scope, trigger) {
        if (trigger === "quoteSaved") {
          scope.quote = void 0;
          return ["loading", scope];
        } else {
          return ["saving", scope];
        }
      },
      getRenderData: function(scope) {
        return {
          quote: scope.quote,
          feedback: "Saving quote...",
          showEditActions: false
        };
      }
    }
  };
  frame = function(seed, trigger, eventData) {
    var newScope, newState, _ref;
    _ref = seed.state.onEvent(eventData, seed.scope, trigger), newState = _ref[0], newScope = _ref[1];
    if (states[newState] !== seed.state) {
      states[newState].onEnter(newScope.quote);
    }
    render(states[newState].getRenderData(newScope), newScope);
    return {
      state: states[newState],
      scope: newScope
    };
  };
  updateFrame = function(trigger, data) {
    var scope, state, _ref;
    this.store = onFrameEnter(this.store, trigger, data);
    _ref = frame({
      state: this.currentState,
      scope: this.store
    }, trigger, data), state = _ref.state, scope = _ref.scope;
    this.currentState = state;
    return this.store = scope;
  };
  onFrameEnter = function(scope, trigger, eventData) {
    return scope;
  };
  fetchQuote = function() {
    return Zepto.get(quoteApiUrl, function(response) {
      var message, parse, quote, source;
      parse = function(str) {
        if (str == null) {
          str = "";
        }
        str = str.trim();
        str = str.replace(/\t/g, "");
        return str;
      };
      quote = JSON.parse(response.query.results.body).quote;
      message = quote.split(/[\n\r]?\s\s--/)[0].trim();
      source = quote.split(/[\n\r]?\s\s--/)[1];
      return updateFrame("quoteLoaded", message);
    });
  };
  onSkipQuote = function(e) {
    e.preventDefault();
    return updateFrame("skipQuote", null);
  };
  onSaveQuote = function(e) {
    var parse, quote;
    e.preventDefault();
    quote = Zepto("#quote").val();
    parse = function(quote) {
      return quote.trim();
    };
    return updateFrame("saveQuote", parse(quote));
  };
  render = function(renderData, rawScope) {
    var $feedback, $quote, $saveQuote, $skipQuote, feedback, quote, showEditActions;
    $quote = Zepto("#quote");
    $feedback = Zepto("#feedback");
    $saveQuote = Zepto("#save-quote");
    $skipQuote = Zepto("#skip-quote");
    quote = renderData.quote, feedback = renderData.feedback, showEditActions = renderData.showEditActions;
    $quote.val(quote);
    $feedback.text(feedback);
    if (showEditActions) {
      return Zepto("#edit-actions").show();
    } else {
      return Zepto("#edit-actions").hide();
    }
  };
  start = function() {
    return Zepto(function($) {
      updateFrame.currentState = states.loading;
      updateFrame.store = {};
      updateFrame = updateFrame.bind(updateFrame);
      $("#save-quote").on("click", onSaveQuote);
      $("#skip-quote").on("click", onSkipQuote);
      return fetchQuote();
    });
  };
  return start();
};

});

