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
  var comboToString, decode, decodeChar, decodeKeyStates, fetchQuote, frame, getAllMatches, getValidComboStream, hideLetters, isLetter, isLetterOrSpace, isSpace, onKeyDown, quoteApiUrl, render, resetAllUnsolved, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, shouldReveal, states, updateFrame, updatedecodeKey;
  quoteApiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.iheartquotes.com%2Fapi%2Fv1%2Frandom%3Fmax_characters%3D75%26format%3Djson'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  decodeKeyStates = {
    HIDDEN: 0,
    REVEALED: 1,
    SOLVED: 2
  };
  isLetter = function(char) {
    return /[a-z]/i.test(char);
  };
  isLetterOrSpace = function(char) {
    return /[a-z\s]/i.test(char);
  };
  isSpace = function(char) {
    return /[\s]/i.test(char);
  };
  hideLetters = function(char) {
    if (!isLetter(char)) {
      return decodeKeyStates.SOLVED;
    } else {
      return decodeKeyStates.HIDDEN;
    }
  };
  decodeChar = function(secretChar, decodingStatus) {
    if (shouldReveal(decodingStatus)) {
      return secretChar;
    } else {
      return "_";
    }
  };
  decode = R.compose(R.join(''), R.zipWith(decodeChar));
  sentanceToWords = function(sentance) {
    var breakIntoWords;
    breakIntoWords = function(acc, char, index) {
      var charInfo;
      if (isLetterOrSpace(char)) {
        if (isSpace(char)) {
          acc.push([]);
        } else {
          charInfo = {
            char: char,
            index: index,
            reveal: false
          };
          acc[acc.length - 1].push(charInfo);
        }
      }
      return acc;
    };
    return R.reduceIndexed(breakIntoWords, [[]], sentance);
  };
  shouldReveal = function(decodingStatus) {
    return decodingStatus === decodeKeyStates.REVEALED || decodingStatus === decodeKeyStates.SOLVED;
  };
  comboToString = R.compose(R.join(""), R.map(R.prop("char")));
  setIndexIfNotSolved = function(value, arr, index) {
    if (arr[index] !== decodeKeyStates.SOLVED) {
      arr[index] = value;
    }
    return arr;
  };
  setIndexes = R.curry(function(value, arr, indexes) {
    return R.reduce(R.partial(setIndexIfNotSolved, value), arr, indexes);
  });
  setIndexesToSolved = setIndexes(decodeKeyStates.SOLVED);
  setIndexesToRevealed = setIndexes(decodeKeyStates.REVEALED);
  resetAllUnsolved = function(decodeKey) {
    var nullifyAllNonSolved;
    nullifyAllNonSolved = function(i) {
      if (i === decodeKeyStates.SOLVED) {
        return i;
      } else {
        return decodeKeyStates.HIDDEN;
      }
    };
    return R.map(nullifyAllNonSolved, decodeKey);
  };
  updatedecodeKey = function(comboString, decodeKey, comboGroup) {
    var comboGroupString, indexes, pattern;
    pattern = new RegExp("^" + comboString, "i");
    comboGroupString = comboToString(comboGroup);
    if (pattern.test(comboGroupString)) {
      indexes = R.map(R.prop("index"))(R.take(comboString.length, comboGroup));
      if (comboString.length === comboGroup.length) {
        return setIndexesToSolved(decodeKey, indexes);
      } else {
        return setIndexesToRevealed(decodeKey, indexes);
      }
    } else {
      return decodeKey;
    }
  };
  getAllMatches = function(comboGroups, comboStream, decodeKey) {
    var comboString;
    if (comboStream.length < 1) {
      return decodeKey;
    }
    comboString = comboToString(comboStream);
    decodeKey = R.reduce(R.partial(updatedecodeKey, comboString), decodeKey, comboGroups);
    return getAllMatches(comboGroups, comboStream.slice(1), decodeKey);
  };
  getValidComboStream = function(comboStream, comboGroups) {
    var comboString, isValidCombo, joinAndMatch, pattern;
    if (comboStream.length < 1) {
      return [];
    }
    comboString = comboToString(comboStream);
    pattern = new RegExp("^" + comboString, "i");
    joinAndMatch = R.compose(R.match(pattern), comboToString);
    isValidCombo = R.any(joinAndMatch, comboGroups);
    if (isValidCombo) {
      return comboStream;
    } else {
      return getValidComboStream(comboStream.slice(1), comboGroups);
    }
  };
  states = {
    loading: {
      onEnter: function() {
        return fetchQuote();
      },
      onEvent: function(eventData, scope, trigger) {
        var secretMessage;
        if (trigger === "quoteLoaded") {
          secretMessage = eventData;
          scope.secretMessage = secretMessage;
          scope.comboGroups = sentanceToWords(secretMessage);
          scope.decodeKey = R.map(hideLetters, secretMessage);
          scope.comboStream = [];
          scope.score = R.filter(isLetter, secretMessage).length * 5;
          scope.moves = 0;
          scope.lastInput = null;
          return ["play", scope];
        } else {
          return ["loading", scope];
        }
      },
      getRenderData: function(scope) {
        return {
          secretMessage: "",
          feedback: "LOADING",
          score: "",
          showGameActions: false
        };
      }
    },
    play: {
      onEnter: function() {},
      onEvent: function(eventData, scope) {
        var char, existingSolved, potentialCombo, totalUnsolved;
        if (eventData.keyCode === 191) {
          return ["gaveUp", scope];
        }
        char = String.fromCharCode(eventData.keyCode).toLowerCase();
        if (isLetter(char)) {
          potentialCombo = R.concat(scope.comboStream, [
            {
              char: char
            }
          ]);
          existingSolved = resetAllUnsolved(scope.decodeKey);
          scope.moves += 1;
          scope.score = Math.max(0, scope.score - 1);
          scope.comboStream = getValidComboStream(potentialCombo, scope.comboGroups);
          scope.decodeKey = getAllMatches(scope.comboGroups, scope.comboStream, existingSolved);
          scope.lastInput = char;
        }
        totalUnsolved = R.length(R.filter(R.not(R.eq(decodeKeyStates.SOLVED)))(scope.decodeKey));
        if (totalUnsolved === 0) {
          return ["solved", scope];
        }
        return ["play", scope];
      },
      getRenderData: function(scope) {
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: comboToString(scope.comboStream) || scope.lastInput || "Type letter combos to reveal the hidden message.",
          score: scope.score,
          showGameActions: true
        };
      }
    },
    gaveUp: {
      onEnter: function() {},
      onEvent: function(eventData, scope) {
        scope.secretMessage = void 0;
        scope.comboGroups = void 0;
        scope.decodeKey = void 0;
        scope.comboStream = void 0;
        scope.score = void 0;
        scope.moves = void 0;
        scope.lastInput = void 0;
        return ["loading", scope];
      },
      getRenderData: function(scope) {
        return {
          secretMessage: scope.secretMessage,
          feedback: "You gave up!<br>Press any key to play again.",
          score: 0,
          showGameActions: false
        };
      }
    },
    solved: {
      onEnter: function() {},
      onEvent: function(eventData, scope) {
        scope.secretMessage = void 0;
        scope.comboGroups = void 0;
        scope.decodeKey = void 0;
        scope.comboStream = void 0;
        scope.score = void 0;
        scope.moves = void 0;
        scope.lastInput = void 0;
        return ["loading", scope];
      },
      getRenderData: function(scope) {
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: "SOLVED in " + scope.moves + " moves!<br>Press any key to play again.",
          score: scope.score,
          showGameActions: false
        };
      }
    }
  };
  frame = function(seed, trigger, eventData) {
    var newScope, newState, _ref;
    _ref = seed.state.onEvent(eventData, seed.scope, trigger), newState = _ref[0], newScope = _ref[1];
    if (states[newState] !== seed.state) {
      states[newState].onEnter();
    }
    render(states[newState].getRenderData(newScope));
    return {
      state: states[newState],
      scope: newScope
    };
  };
  updateFrame = function(type, data) {
    var scope, state, _ref;
    _ref = frame({
      state: this.currentState,
      scope: this.store
    }, type, data), state = _ref.state, scope = _ref.scope;
    this.currentState = state;
    return this.store = scope;
  };
  updateFrame.currentState = states.loading;
  updateFrame.store = {};
  updateFrame = updateFrame.bind(updateFrame);
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
      message = quote.split(/[\n\r]?\s\s--/)[0];
      source = quote.split(/[\n\r]?\s\s--/)[1];
      return updateFrame("quoteLoaded", message);
    });
  };
  onKeyDown = function(e) {
    e.preventDefault();
    return updateFrame("keyPress", e);
  };
  render = function(data) {
    var $feedback, $score, $secretMessage, feedback, score, secretMessage, showGameActions;
    $secretMessage = Zepto("#secret-message");
    $feedback = Zepto("#feedback");
    $score = Zepto("#score");
    secretMessage = data.secretMessage, feedback = data.feedback, score = data.score, showGameActions = data.showGameActions;
    $secretMessage.text(secretMessage);
    $feedback.html(feedback);
    $score.text(score);
    if (showGameActions) {
      return Zepto("#give-up").show();
    } else {
      return Zepto("#give-up").hide();
    }
  };
  return Zepto(function($) {
    $(document).on("keydown", onKeyDown);
    fetchQuote();
    return updateFrame("startGame", null);
  });
};

});

