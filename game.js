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
  var buildSecredMessage, comboToString, decode, decodeKeyStates, fetchQuote, frame, getAllMatches, getRandomElement, getRandomElements, getValidComboStream, hideLetters, isHidden, isLetter, isLetterOrSpace, isSolved, isSpace, isUnsolvedGroup, onGiveUp, onHint, onKeyDown, quoteApiUrl, render, resetDecodeKey, saveIndexes, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, states, updateDecodeKey, updateFrame;
  quoteApiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.iheartquotes.com%2Fapi%2Fv1%2Frandom%3Fmax_characters%3D75%26format%3Djson'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  decodeKeyStates = {
    HIDDEN: 0,
    REVEALED: 1,
    SOLVED: 2,
    HINTED: 3,
    HINTEDFILLED: 4
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
  saveIndexes = R.mapIndexed(function(value, index) {
    return {
      index: index,
      status: value
    };
  });
  getRandomElement = function(arr) {
    var newArray, randomElement, randomI;
    randomI = Math.floor(Math.random() * arr.length);
    randomElement = arr[randomI];
    newArray = R.remove(randomI, 1, arr);
    return [randomElement, newArray];
  };
  getRandomElements = function(arr, num) {
    var recur;
    if (num == null) {
      num = 1;
    }
    if (typeof num !== "number") {
      console.error("expected a number, got", num);
      num = 1;
    }
    recur = function(arr, acc) {
      var newArr, randomElement, _ref;
      _ref = getRandomElement(arr), randomElement = _ref[0], newArr = _ref[1];
      acc.push(randomElement);
      if (acc.length === num) {
        return acc;
      } else {
        return recur(newArr, acc);
      }
    };
    return recur(arr, []);
  };
  hideLetters = function(char) {
    if (!isLetter(char)) {
      return decodeKeyStates.SOLVED;
    } else {
      return decodeKeyStates.HIDDEN;
    }
  };
  isHidden = R.eq(decodeKeyStates.HIDDEN);
  isSolved = R.eq(decodeKeyStates.SOLVED);
  decode = R.zipWith(function(secretChar, decodingStatus) {
    return {
      char: secretChar,
      status: decodingStatus
    };
  });
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
            index: index
          };
          acc[acc.length - 1].push(charInfo);
        }
      }
      return acc;
    };
    return R.reduceIndexed(breakIntoWords, [[]], sentance);
  };
  comboToString = R.compose(R.join(""), R.map(R.prop("char")));
  isUnsolvedGroup = R.curry(function(decodeKey, group) {
    var numSolvedInGroup;
    numSolvedInGroup = function(acc, char) {
      if (decodeKey[char.index] === decodeKeyStates.SOLVED) {
        acc++;
      }
      return acc;
    };
    return (R.reduce(numSolvedInGroup, 0, group)) !== group.length;
  });
  setIndexIfNotSolved = function(value, arr, index) {
    if (typeof value === "function") {
      value = value(arr[index]);
    }
    arr[index] = value;
    return arr;
  };
  setIndexes = R.curry(function(value, arr, indexes) {
    return R.reduce(R.partial(setIndexIfNotSolved, value), arr, indexes);
  });
  setIndexesToSolved = setIndexes(decodeKeyStates.SOLVED);
  setIndexesToRevealed = setIndexes(function(currentStatus) {
    var map;
    map = {};
    map[decodeKeyStates.HIDDEN] = decodeKeyStates.REVEALED;
    map[decodeKeyStates.HINTED] = decodeKeyStates.HINTEDFILLED;
    return map[currentStatus] || currentStatus;
  });
  resetDecodeKey = function(decodeKey) {
    var map, resetTransform;
    map = {};
    map[decodeKeyStates.SOLVED] = decodeKeyStates.SOLVED;
    map[decodeKeyStates.HINTED] = decodeKeyStates.HINTED;
    map[decodeKeyStates.HINTEDFILLED] = decodeKeyStates.HINTED;
    resetTransform = function(currentStatus) {
      return map[currentStatus] || decodeKeyStates.HIDDEN;
    };
    return R.map(resetTransform, decodeKey);
  };
  updateDecodeKey = function(comboString, decodeKey, comboGroup) {
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
  getAllMatches = function(comboGroups, comboString, decodeKey) {
    if (comboString.length < 1) {
      return decodeKey;
    }
    decodeKey = R.reduce(R.partial(updateDecodeKey, comboString), decodeKey, comboGroups);
    return getAllMatches(comboGroups, comboString.slice(1), decodeKey);
  };
  getValidComboStream = function(comboString, comboGroups) {
    var isValidCombo, joinAndMatch, pattern;
    if (comboString.length < 1) {
      return [];
    }
    pattern = new RegExp("^" + comboString, "i");
    joinAndMatch = R.compose(R.match(pattern), comboToString);
    isValidCombo = R.any(joinAndMatch, comboGroups);
    if (isValidCombo) {
      return comboString;
    } else {
      return getValidComboStream(comboString.slice(1), comboGroups);
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
          scope.comboString = "";
          scope.score = R.filter(isLetter, secretMessage).length * 5;
          scope.moves = 0;
          scope.hints = 0;
          scope.lastCombo = null;
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
          showPlayActions: false
        };
      }
    },
    play: {
      onEnter: function() {},
      onEvent: function(eventData, scope, trigger) {
        var char, elementsToReveal, existingSolved, hiddenChars, hintAllowance, indexedDecodeKey, indexesToReaveal, oneOrOneTenth, potentialCombo, totalSolved, unsolvedComboGroups;
        if (trigger === "giveUp") {
          return ["gaveUp", scope];
        }
        if (trigger === "hint") {
          oneOrOneTenth = function(items) {
            return Math.ceil(items / 10);
          };
          indexedDecodeKey = saveIndexes(scope.decodeKey);
          hiddenChars = R.filter(R.compose(isHidden, R.prop("status")))(indexedDecodeKey);
          if (hiddenChars.length === 0) {
            return ["play", scope];
          }
          hintAllowance = oneOrOneTenth(hiddenChars.length);
          elementsToReveal = getRandomElements(hiddenChars, hintAllowance);
          indexesToReaveal = R.map(R.prop("index"), elementsToReveal);
          scope.decodeKey = setIndexes(decodeKeyStates.HINTED, scope.decodeKey, indexesToReaveal);
          scope.hints += 1;
          scope.score = Math.floor(scope.score / 2);
        }
        if (trigger === "keyPress") {
          char = String.fromCharCode(eventData.keyCode).toLowerCase();
          if (isLetter(char)) {
            potentialCombo = scope.comboString + char;
            existingSolved = resetDecodeKey(scope.decodeKey);
            unsolvedComboGroups = R.filter(isUnsolvedGroup(scope.decodeKey), scope.comboGroups);
            scope.moves += 1;
            scope.score = Math.max(0, scope.score - 1);
            scope.comboString = getValidComboStream(potentialCombo, unsolvedComboGroups);
            scope.decodeKey = getAllMatches(scope.comboGroups, scope.comboString, existingSolved);
            scope.lastCombo = potentialCombo;
          }
          totalSolved = R.length(R.filter(isSolved)(scope.decodeKey));
          if (totalSolved === scope.secretMessage.length) {
            return ["solved", scope];
          }
        }
        return ["play", scope];
      },
      getRenderData: function(scope) {
        var comboString;
        comboString = scope.comboString.length ? scope.comboString : null;
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: comboString || scope.lastCombo || "Type letter combos to reveal the hidden message.",
          match: scope.lastCombo ? !!scope.comboString.length > 0 : null,
          score: scope.score,
          showPlayActions: true
        };
      }
    },
    gaveUp: {
      onEnter: function() {},
      onEvent: function(eventData, scope) {
        scope.secretMessage = void 0;
        scope.comboGroups = void 0;
        scope.decodeKey = void 0;
        scope.comboString = void 0;
        scope.score = void 0;
        scope.moves = void 0;
        scope.hints = void 0;
        scope.lastCombo = void 0;
        return ["loading", scope];
      },
      getRenderData: function(scope) {
        return {
          secretMessage: decode(scope.secretMessage, R.map(R.always(decodeKeyStates.SOLVED), scope.decodeKey)),
          feedback: "You gave up!<br>Press any key to play again.",
          score: 0,
          showPlayActions: false
        };
      }
    },
    solved: {
      onEnter: function() {},
      onEvent: function(eventData, scope) {
        scope.secretMessage = void 0;
        scope.comboGroups = void 0;
        scope.decodeKey = void 0;
        scope.comboString = void 0;
        scope.score = void 0;
        scope.moves = void 0;
        scope.hints = void 0;
        scope.lastCombo = void 0;
        return ["loading", scope];
      },
      getRenderData: function(scope) {
        var hints;
        hints = scope.hints > 1 ? scope.hints : "no";
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: "SOLVED in " + scope.moves + " moves (with " + hints + " hints)!<br>Press any key to play again.",
          score: scope.score,
          showPlayActions: false
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
  updateFrame = function(trigger, data) {
    var scope, state, _ref;
    _ref = frame({
      state: this.currentState,
      scope: this.store
    }, trigger, data), state = _ref.state, scope = _ref.scope;
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
  onGiveUp = function(e) {
    e.preventDefault();
    return updateFrame("giveUp", null);
  };
  onHint = function(e) {
    e.preventDefault();
    return updateFrame("hint", null);
  };
  buildSecredMessage = function(secretMessage) {
    var buildMarkup, statusMap;
    statusMap = R.invertObj(decodeKeyStates);
    buildMarkup = function(acc, letter) {
      var newLine, status, text;
      if (isSpace(letter.char)) {
        newLine = "";
        if (/[\n\r]/.test(letter.char)) {
          newLine = "<br>";
        }
        return acc + ("</span>" + newLine + "<span class='word'>");
      } else {
        text = letter.char;
        if (letter.status === decodeKeyStates.HIDDEN) {
          text = " ";
        }
        status = statusMap[letter.status].toLowerCase();
        return acc + ("<span class='letter " + status + "'>" + text + "</span>");
      }
    };
    return (R.reduce(buildMarkup, "<span class='word'>", secretMessage)) + "</span>";
  };
  render = function(data) {
    var $feedback, $score, $secretMessage, feedback, match, score, secretMessage, showPlayActions;
    $secretMessage = Zepto("#secret-message");
    $feedback = Zepto("#feedback");
    $score = Zepto("#score");
    secretMessage = data.secretMessage, feedback = data.feedback, score = data.score, showPlayActions = data.showPlayActions, match = data.match;
    $secretMessage.html(buildSecredMessage(secretMessage));
    $feedback.html(feedback);
    $score.text(score);
    $feedback.removeClass("no-match");
    $feedback.removeClass("match");
    if (match === true) {
      $feedback.addClass("match");
    }
    if (match === false) {
      $feedback.addClass("no-match");
    }
    if (showPlayActions) {
      return Zepto("#play-actions").show();
    } else {
      return Zepto("#play-actions").hide();
    }
  };
  return Zepto(function($) {
    $(document).on("keydown", onKeyDown);
    $("#give-up-button").on("click", onGiveUp);
    $("#hint-button").on("click", onHint);
    fetchQuote();
    return updateFrame("startGame", null);
  });
};

});

