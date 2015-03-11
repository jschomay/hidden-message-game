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
  var comboGroups, comboStream, comboToString, decodeChar, decodeMessage, decoder, decoderStates, getAllMatches, getDecodeState, getValidComboStream, isLetter, isLetterOrSpace, isSpace, onKeyDown, render, resetDecoder, secretMessage, sentanceToWords, setIndex, setIndexes, setIndexesToRevealed, setIndexesToSolved, shouldReveal, updateDecoder;
  secretMessage = "It's a small world, but I wouldn't want to have to paint it.";
  decoderStates = {
    HIDDEN: 0,
    REVEALED: 1,
    SOLVED: 2
  };
  comboStream = [];
  render = void 0;
  decoder = void 0;
  isLetter = function(char) {
    return /[a-z]/i.test(char);
  };
  isLetterOrSpace = function(char) {
    return /[a-z\s]/i.test(char);
  };
  isSpace = function(char) {
    return /[\s]/i.test(char);
  };
  getDecodeState = function(char) {
    if (!isLetter(char)) {
      return decoderStates.SOLVED;
    } else {
      return decoderStates.HIDDEN;
    }
  };
  decodeChar = function(secretChar, decodingStatus) {
    if (shouldReveal(decodingStatus)) {
      return secretChar;
    } else {
      return "_";
    }
  };
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
  decodeMessage = R.compose(R.join(''), R.zipWith(decodeChar, secretMessage));
  comboGroups = sentanceToWords(secretMessage);
  shouldReveal = function(decodingStatus) {
    return decodingStatus === decoderStates.REVEALED || decodingStatus === decoderStates.SOLVED;
  };
  comboToString = R.compose(R.join(""), R.map(R.prop("char")));
  setIndex = function(value, arr, index) {
    if (arr[index] !== decoderStates.SOLVED) {
      arr[index] = value;
    }
    return arr;
  };
  setIndexes = R.curry(function(value, arr, indexes) {
    return R.reduce(R.partial(setIndex, value), arr, indexes);
  });
  setIndexesToSolved = setIndexes(decoderStates.SOLVED);
  setIndexesToRevealed = setIndexes(decoderStates.REVEALED);
  resetDecoder = function(decoder) {
    var nullifyAllNonSolved;
    nullifyAllNonSolved = function(i) {
      if (i === decoderStates.SOLVED) {
        return i;
      } else {
        return decoderStates.HIDDEN;
      }
    };
    return R.map(nullifyAllNonSolved, decoder);
  };
  updateDecoder = function(comboString, decoder, comboGroup) {
    var comboGroupString, indexes, pattern, setDecoderIndexesToRevealed, setDecoderIndexesToSolved;
    setDecoderIndexesToSolved = setIndexesToSolved(decoder);
    setDecoderIndexesToRevealed = setIndexesToRevealed(decoder);
    pattern = new RegExp("^" + comboString, "i");
    comboGroupString = comboToString(comboGroup);
    if (pattern.test(comboGroupString)) {
      indexes = R.map(R.prop("index"))(R.take(comboString.length, comboGroup));
      if (comboString.length === comboGroup.length) {
        return setDecoderIndexesToSolved(indexes);
      } else {
        return setDecoderIndexesToRevealed(indexes);
      }
    } else {
      return decoder;
    }
  };
  getAllMatches = function(comboGroups, comboStream, decoder) {
    var comboString;
    if (comboStream.length < 1) {
      return decoder;
    }
    comboString = comboToString(comboStream);
    decoder = R.reduce(R.partial(updateDecoder, comboString), decoder, comboGroups);
    return getAllMatches(comboGroups, comboStream.slice(1), decoder);
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
  onKeyDown = function(e) {
    var char, key, potentialCombo, totalUnsolved;
    key = e.keyCode;
    if (e.keyCode === 27) {
      render(decodeMessage(R.map(R.always(decoderStates.SOLVED), decoder)), "You gave up!");
    }
    char = String.fromCharCode(key).toLowerCase();
    if (isLetter(char)) {
      decoder = resetDecoder(decoder);
      potentialCombo = R.concat(comboStream, [
        {
          char: char
        }
      ]);
      comboStream = getValidComboStream(potentialCombo, comboGroups);
      console.log('comboStream:', comboToString(comboStream));
      decoder = getAllMatches(comboGroups, comboStream, decoder);
      console.log('decoder:', decoder);
      render(decodeMessage(decoder), comboToString(comboStream) || char);
      totalUnsolved = R.length(R.filter(R.not(R.eq(decoderStates.SOLVED)))(decoder));
      if (totalUnsolved === 0) {
        return render(decodeMessage(decoder), "You win!");
      }
    }
  };
  return document.onreadystatechange = function() {
    var $feedback, $secretMessage;
    if (document.readyState === "complete") {
      decoder = R.map(getDecodeState, secretMessage);
      $secretMessage = document.getElementById("secret-message");
      $feedback = document.getElementById("feedback");
      render = function(secretMessage, feedback) {
        $secretMessage.innerText = secretMessage;
        return $feedback.innerText = feedback;
      };
      render(decodeMessage(decoder), "Type letter combos to reveal the hidden message.");
      return document.addEventListener("keydown", onKeyDown);
    }
  };
};
});

;
//# sourceMappingURL=game.js.map