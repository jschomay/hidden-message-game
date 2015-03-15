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
  var comboGroups, comboStream, comboToString, decode, decodeChar, decodeKey, decodeKeyStates, getAllMatches, getValidComboStream, hideLetters, initializeGame, isLetter, isLetterOrSpace, isSpace, moves, onKeyDown, resetAllUnsolved, score, secretMessage, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, shouldReveal, updatedecodeKey;
  decodeKeyStates = {
    HIDDEN: 0,
    REVEALED: 1,
    SOLVED: 2
  };
  secretMessage = void 0;
  comboGroups = void 0;
  decodeKey = void 0;
  comboStream = void 0;
  score = void 0;
  moves = void 0;
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
  onKeyDown = function($, render, e) {
    var char, key, potentialCombo, totalUnsolved;
    key = e.keyCode;
    if (e.keyCode === 191) {
      $(document).off('keydown');
      $(document).on('keydown', function() {
        return initializeGame($, render);
      });
      render(secretMessage, "You gave up!<br>Press any key to play again.", 0);
    }
    char = String.fromCharCode(key).toLowerCase();
    if (isLetter(char)) {
      moves++;
      score = Math.max(0, score - 1);
      potentialCombo = R.concat(comboStream, [
        {
          char: char
        }
      ]);
      comboStream = getValidComboStream(potentialCombo, comboGroups);
      decodeKey = resetAllUnsolved(decodeKey);
      decodeKey = getAllMatches(comboGroups, comboStream, decodeKey);
      console.log('comboStream:', comboToString(comboStream));
      console.log('decodeKey:', decodeKey);
      render(decode(secretMessage, decodeKey), comboToString(comboStream) || char, score);
      totalUnsolved = R.length(R.filter(R.not(R.eq(decodeKeyStates.SOLVED)))(decodeKey));
      if (totalUnsolved === 0) {
        $(document).off('keydown');
        $(document).on('keydown', function() {
          return initializeGame($, render);
        });
        return render(decode(secretMessage, decodeKey), "SOLVED in " + moves + " moves!<br>Press any key to play again.", score);
      }
    }
  };
  initializeGame = function($, render) {
    $(document).off('keydown');
    secretMessage = "Here, there, and everywhere.";
    comboGroups = sentanceToWords(secretMessage);
    decodeKey = R.map(hideLetters, secretMessage);
    comboStream = [];
    score = R.filter(isLetter, secretMessage).length * 5;
    moves = 0;
    render(decode(secretMessage, decodeKey), "Type letter combos to reveal the hidden message.", score);
    return $(document).on("keydown", R.partial(onKeyDown, $, render));
  };
  return Zepto(function($) {
    var $feedback, $score, $secretMessage, render;
    $secretMessage = $("#secret-message");
    $feedback = $("#feedback");
    $score = $("#score");
    render = function(secretMessage, feedback, score) {
      $secretMessage.text(secretMessage);
      $feedback.html(feedback);
      return $score.text(score);
    };
    return initializeGame($, render);
  });
};
});

;
//# sourceMappingURL=game.js.map