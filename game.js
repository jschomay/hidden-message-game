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

require.register("src/bundles/starter", function(exports, require, module) {
module.exports = [{ "_id" : { "$oid" : "554fb2980a061f9afcba2b6c" }, "quote" : "Today is the tomorrow you worried about yesterday.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb2c60a061f9afcba2b6d" }, "quote" : "Talk sense to a fool and he calls you foolish.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb40c0a061f9afcba2b6f" }, "quote" : "You teach best what you most need to learn.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb4420a061f9afcba2b70" }, "quote" : "Any simple idea will be worded in the most complicated way.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb46b0a061f9afcba2b71" }, "quote" : "The man who lives in the past, robs the present.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb4880a061f9afcba2b72" }, "quote" : "80% of success is just showing up.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb4ab0a061f9afcba2b73" }, "quote" : "Obstacles are what you see when you take your eyes off your goal.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb52e0a061f9afcba2b74" }, "quote" : "That's one small step for man, one giant leap for mankind.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb64d0a061f9afcba2b75" }, "quote" : "Be the change you wish to see in the world.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb8670a061f9afcba2b76" }, "quote" : "You miss 100% of the shots you don’t take.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fb89e0a061f9afcba2b77" }, "quote" : "Life is what happens to you while you’re busy making other plans.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fba310a061f9afcba2b78" }, "quote" : "My Mama always said, \"Life was like a box of chocolates; you never know what you're gonna get.\"", "bundle" : "starter" },{ "_id" : { "$oid" : "554fba3e0a061f9afcba2b79" }, "quote" : "Happiness isn't having what you want, it's wanting what you have.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fbad40a061f9afcba2b7a" }, "quote" : "If all you have is a hammer, everything looks like a nail.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fbb780a061f9afcba2b7b" }, "quote" : "He who laughs last, laughs longest.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fbba30a061f9afcba2b7c" }, "quote" : "If a tree falls in a forest and no one is around to hear it, does it make a sound?", "bundle" : "starter" },{ "_id" : { "$oid" : "554fbbe40a061f9afcba2b7d" }, "quote" : "Never try to teach a pig to sing; it wastes your time and it annoys the pig.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fbd090a061f9afcba2b7e" }, "quote" : "Two thirds of the people on earth have never seen snow.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fc1230a061f9afcba2b7f" }, "quote" : "Two things are infinite: the universe and human stupidity; and I'm not sure about the the universe.", "bundle" : "starter" },{ "_id" : { "$oid" : "554fc398720a9ad00b7fa94b" }, "quote" : "If you choose not to decide, you still have made a choice.", "bundle" : "starter" }]
;
});

require.register("src/game", function(exports, require, module) {
var getNextQuoteIndex, quoteBundles;

quoteBundles = [require("./bundles/starter")];

getNextQuoteIndex = function(currentBundleIndex, currentQuoteIndex) {
  if (currentQuoteIndex === quoteBundles[currentBundleIndex].length - 1) {
    return {
      quoteIndex: 0,
      bundleIndex: quoteBundles[currentBundleIndex + 1] ? currentBundleIndex + 1 : 0
    };
  } else {
    return {
      quoteIndex: currentQuoteIndex + 1,
      bundleIndex: currentBundleIndex
    };
  }
};

module.exports = function() {
  var CONSTANTS, SOUNDS, VOLUMES, buildSecredMessage, comboToString, decode, decodeKeyStates, fadeDownMusic, fadeInMusic, fadeUpMusic, fetchQuote, frame, getAllMatches, getLastFreeHintScore, getMusic, getNextFreeHintScore, getRandomElement, getRandomElements, getSFX, getUserData, getValidComboStream, hideLetters, isHidden, isLetter, isLetterOrSpace, isSolved, isSpace, isUnsolvedGroup, loadSounds, numFreeHintsEarned, numSoundsLoaded, onCancelBuyHints, onFrameEnter, onGiveUp, onHint, onKeyDown, onMuteMusic, onMuteSFX, pauseMusic, pauseSFX, playMusic, playSFX, playSound, preload, render, resetDecodeKey, saveIndexes, saveUserData, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, startGame, states, updateDecodeKey, updateFrame, updateLoadProgress;
  CONSTANTS = {
    startingHints: 5,
    hintSetback: 20,
    pointsForFreeHint: 150
  };
  SOUNDS = {};
  VOLUMES = {
    backgroundMusic: 0.1,
    keyPressHit: 0.9
  };
  playSound = function(key) {
    return SOUNDS[key].play();
  };
  getMusic = function() {
    return SOUNDS["backgroundMusic"];
  };
  getSFX = function() {
    return R.omit(["backgroundMusic"], SOUNDS);
  };
  playMusic = function() {
    return getMusic().play();
  };
  pauseMusic = function() {
    return getMusic().pause();
  };
  playSFX = function() {
    return R.forEach((function(sound) {
      return sound[1].volume(VOLUMES[sound[0]] || 1);
    }), R.toPairs(getSFX()));
  };
  pauseSFX = function() {
    return R.forEach((function(sound) {
      return sound.volume(0);
    }), R.values(getSFX()));
  };
  fadeInMusic = function() {
    return getMusic().fadeIn(VOLUMES.backgroundMusic, 2000);
  };
  fadeDownMusic = function() {
    var volume;
    volume = getMusic()._volume;
    return getMusic().fade(volume, VOLUMES.backgroundMusic * 1 / 10, 700);
  };
  fadeUpMusic = function() {
    var volume;
    volume = getMusic()._volume;
    return getMusic().fade(volume, VOLUMES.backgroundMusic, 1500);
  };
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
  getLastFreeHintScore = function(totalScore) {
    return Math.floor(totalScore / CONSTANTS.pointsForFreeHint) * CONSTANTS.pointsForFreeHint;
  };
  getNextFreeHintScore = R.compose(R.add(CONSTANTS.pointsForFreeHint), getLastFreeHintScore);
  numFreeHintsEarned = function(currentTotalScore, roundScore) {
    var previousTarget, previousTotalScore;
    previousTotalScore = currentTotalScore - roundScore;
    previousTarget = getNextFreeHintScore(previousTotalScore);
    return Math.ceil(Math.max(0, roundScore - (previousTarget - previousTotalScore)) / CONSTANTS.pointsForFreeHint);
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
      onEnter: function(scope, userData) {
        fadeUpMusic();
        return fetchQuote(userData);
      },
      onEvent: function(eventData, scope, trigger, userData) {
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
          return ["play", scope, userData];
        } else {
          return ["loading", scope, userData];
        }
      },
      getRenderData: function(scope) {
        return {
          secretMessage: [],
          feedback: "LOADING...",
          score: "",
          showPlayActions: false
        };
      }
    },
    play: {
      onEnter: function() {
        return fadeUpMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var char, elementsToReveal, existingSolved, hiddenChars, hintAllowance, indexedDecodeKey, indexesToReaveal, isMatch, newUnsolvedComboGroups, nextQuote, oneOrOneTenth, playKeySounds, potentialCombo, totalSolved, unsolvedComboGroups, wordComplete;
        if (trigger === "giveUp") {
          playSound("giveUp");
          nextQuote = getNextQuoteIndex(userData.currentBundleIndex, userData.currentQuoteIndex);
          userData.currentBundleIndex = nextQuote.bundleIndex;
          userData.currentQuoteIndex = nextQuote.quoteIndex;
          userData.totalScore -= scope.score;
          userData.totalSkipped += 1;
          saveUserData(userData);
          return ["gaveUp", scope, userData];
        }
        if (trigger === "hint") {
          if (userData.hintsRemaining <= 0) {
            return ["outOfHints", scope, userData];
          }
          oneOrOneTenth = function(items) {
            return Math.ceil(items / 10);
          };
          indexedDecodeKey = saveIndexes(scope.decodeKey);
          hiddenChars = R.filter(R.compose(isHidden, R.prop("status")))(indexedDecodeKey);
          if (hiddenChars.length === 0) {
            return ["play", scope, userData];
          }
          hintAllowance = oneOrOneTenth(hiddenChars.length);
          elementsToReveal = getRandomElements(hiddenChars, hintAllowance);
          indexesToReaveal = R.map(R.prop("index"), elementsToReveal);
          scope.decodeKey = setIndexes(decodeKeyStates.HINTED, scope.decodeKey, indexesToReaveal);
          scope.hints += 1;
          scope.score -= CONSTANTS.hintSetback;
          userData.hintsRemaining -= 1;
          saveUserData(userData);
          playKeySounds = function(repeatTimes, playCount) {
            if (playCount == null) {
              playCount = 1;
            }
            playSound("keyPressMiss");
            if (playCount < repeatTimes) {
              return setTimeout((function() {
                return playKeySounds(repeatTimes, playCount + 1);
              }), 120);
            }
          };
          playKeySounds(hintAllowance);
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
            if (scope.comboCompleted === true) {
              scope.lastCombo = char;
            } else {
              scope.lastCombo = potentialCombo;
            }
            newUnsolvedComboGroups = R.filter(isUnsolvedGroup(scope.decodeKey), scope.comboGroups);
            scope.comboCompleted = unsolvedComboGroups.length > newUnsolvedComboGroups.length;
            isMatch = !!scope.comboString.length;
            wordComplete = scope.comboCompleted === true;
            if (wordComplete) {
              playSound("keyPressHit");
            } else if (isMatch) {
              playSound("keyPressHit");
            } else {
              playSound("keyPressMiss");
            }
          }
          totalSolved = R.length(R.filter(isSolved)(scope.decodeKey));
          if (totalSolved === scope.secretMessage.length) {
            playSound("solved");
            userData.totalSolved += 1;
            userData.totalScore += scope.score;
            userData.hintsRemaining += numFreeHintsEarned(userData.totalScore, scope.score);
            nextQuote = getNextQuoteIndex(userData.currentBundleIndex, userData.currentQuoteIndex);
            userData.currentBundleIndex = nextQuote.bundleIndex;
            userData.currentQuoteIndex = nextQuote.quoteIndex;
            saveUserData(userData);
            return ["solved", scope, userData];
          }
        }
        return ["play", scope, userData];
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
      onEnter: function() {
        return fadeDownMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "keyPress" && eventData.keyCode === 32) {
          scope.secretMessage = void 0;
          scope.comboGroups = void 0;
          scope.decodeKey = void 0;
          scope.comboString = void 0;
          scope.score = void 0;
          scope.moves = void 0;
          scope.hints = void 0;
          scope.lastCombo = void 0;
          return ["loading", scope, userData];
        } else {
          return ["gaveUp", scope, userData];
        }
      },
      getRenderData: function(scope) {
        return {
          secretMessage: decode(scope.secretMessage, R.map(R.always(decodeKeyStates.SOLVED), scope.decodeKey)),
          feedback: "You gave up!<br>Press 'Space bar' to play again.",
          score: 0,
          showPlayActions: false
        };
      }
    },
    solved: {
      onEnter: function() {
        return fadeDownMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (eventData.keyCode === 32) {
          scope.secretMessage = void 0;
          scope.comboGroups = void 0;
          scope.decodeKey = void 0;
          scope.comboString = void 0;
          scope.score = void 0;
          scope.moves = void 0;
          scope.hints = void 0;
          scope.lastCombo = void 0;
          return ["loading", scope, userData];
        } else {
          return ["solved", scope, userData];
        }
      },
      getRenderData: function(scope) {
        var hints;
        hints = scope.hints > 1 ? scope.hints : "no";
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: "SOLVED in " + scope.moves + " moves (with " + hints + " hints)!<br>Press 'Space bar' to play again.",
          score: scope.score,
          showPlayActions: false
        };
      }
    },
    outOfHints: {
      onEnter: function() {
        return fadeDownMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "cancelBuyHints") {
          return ["play", scope, userData];
        }
        return ["outOfHints", scope, userData];
      },
      getRenderData: function(scope) {
        var comboString;
        comboString = scope.comboString.length ? scope.comboString : null;
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: comboString || scope.lastCombo || "Type letter combos to reveal the hidden message.",
          match: scope.lastCombo ? !!scope.comboString.length > 0 : null,
          score: scope.score,
          showPlayActions: true,
          buyHints: true
        };
      }
    }
  };
  frame = function(seed, trigger, eventData) {
    var newScope, newState, newUserData, _ref;
    _ref = seed.state.onEvent(eventData, seed.scope, trigger, seed.userData), newState = _ref[0], newScope = _ref[1], newUserData = _ref[2];
    if (states[newState] !== seed.state) {
      states[newState].onEnter(newScope, newUserData);
    }
    render(states[newState].getRenderData(newScope), newScope, newUserData);
    return {
      state: states[newState],
      scope: newScope,
      userData: newUserData
    };
  };
  updateFrame = function(trigger, data) {
    var scope, state, userData, _ref;
    this.store = onFrameEnter(this.store, trigger, data);
    _ref = frame({
      state: this.currentState,
      scope: this.store,
      userData: this.userData
    }, trigger, data), state = _ref.state, scope = _ref.scope, userData = _ref.userData;
    this.currentState = state;
    this.store = scope;
    return this.userData = userData;
  };
  onFrameEnter = function(scope, trigger, eventData) {
    if (trigger === "toggleMuteMusic") {
      if (scope.musicIsPaused) {
        playMusic();
      } else {
        pauseMusic();
      }
      scope.musicIsPaused = !scope.musicIsPaused;
    }
    if (trigger === "toggleMuteSFX") {
      if (scope.SFXIsPaused) {
        playSFX();
      } else {
        pauseSFX();
      }
      scope.SFXIsPaused = !scope.SFXIsPaused;
    }
    return scope;
  };
  fetchQuote = function(_arg) {
    var currentBundleIndex, currentQuoteIndex, message;
    currentBundleIndex = _arg.currentBundleIndex, currentQuoteIndex = _arg.currentQuoteIndex;
    message = quoteBundles[currentBundleIndex][currentQuoteIndex].quote;
    return setTimeout(function() {
      return updateFrame("quoteLoaded", message);
    }, 0);
  };
  onKeyDown = function(e) {
    if (e.keyCode === 8) {
      e.preventDefault();
    }
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
  onMuteMusic = function(e) {
    e.preventDefault();
    return updateFrame("toggleMuteMusic", null);
  };
  onMuteSFX = function(e) {
    e.preventDefault();
    return updateFrame("toggleMuteSFX", null);
  };
  onCancelBuyHints = function(e) {
    e.preventDefault();
    return updateFrame("cancelBuyHints", null);
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
  render = function(renderData, rawScope, userData) {
    var $feedback, $muteMusic, $muteSFX, $score, $secretMessage, buyHints, feedback, match, score, secretMessage, showPlayActions;
    $secretMessage = Zepto("#secret-message");
    $feedback = Zepto("#feedback");
    $score = Zepto("#score");
    $muteMusic = Zepto("#mute-music-button");
    $muteSFX = Zepto("#mute-sfx-button");
    secretMessage = renderData.secretMessage, feedback = renderData.feedback, score = renderData.score, showPlayActions = renderData.showPlayActions, match = renderData.match, buyHints = renderData.buyHints;
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
      Zepto("#play-actions").show();
    } else {
      Zepto("#play-actions").hide();
    }
    Zepto("#hint-button .hints-remaining").text(userData.hintsRemaining);
    $muteMusic.removeClass("muted");
    $muteSFX.removeClass("muted");
    if (rawScope.musicIsPaused) {
      $muteMusic.addClass("muted");
    }
    if (rawScope.SFXIsPaused) {
      $muteSFX.addClass("muted");
    }
    if (buyHints) {
      Zepto("#buy-hints").show();
      Zepto("#next-free-hint").text(getNextFreeHintScore(userData.totalScore));
      Zepto("#points-to-go").text(getNextFreeHintScore(userData.totalScore) - userData.totalScore);
    } else {
      Zepto("#buy-hints").hide();
    }
    Zepto("#user-info").show();
    Zepto("#total-solved").text(userData.totalSolved);
    Zepto("#total-skipped").text(userData.totalSkipped);
    return Zepto("#total-score").text(userData.totalScore);
  };
  numSoundsLoaded = function(soundsLoaded) {
    return R.length(R.filter(R.compose(R.identity, R.prop("_loaded")), R.values(soundsLoaded)));
  };
  updateLoadProgress = function(soundsToLoad, soundsLoaded) {
    if (numSoundsLoaded(soundsLoaded) === soundsToLoad) {
      return startGame();
    }
  };
  loadSounds = function(sounds) {
    var formats, getFormats, initializeSounds, totalSounds;
    totalSounds = R.length(R.keys(sounds));
    formats = [".ogg", ".m4a", ".wav"];
    getFormats = function(filePath) {
      return R.map(R.concat(filePath), formats);
    };
    initializeSounds = function(acc, sound) {
      var getConfig;
      getConfig = function() {
        if (typeof sound[1] === "string") {
          return {
            urls: getFormats(sound[1]),
            onload: function() {
              return updateLoadProgress(totalSounds, acc);
            }
          };
        } else {
          return R.merge(sound[1][1], {
            urls: getFormats(sound[1][0]),
            onload: function() {
              return updateLoadProgress(totalSounds, acc);
            }
          });
        }
      };
      acc[sound[0]] = new Howl(getConfig());
      return acc;
    };
    return R.reduce(initializeSounds, SOUNDS, R.toPairs(sounds));
  };
  preload = function() {
    return loadSounds({
      keyPressMiss: "assets/key-press-miss",
      keyPressHit: [
        "assets/key-press-hit", {
          volume: VOLUMES.keyPressHit
        }
      ],
      giveUp: "assets/give-up",
      solved: "assets/solved",
      backgroundMusic: [
        "assets/background-music", {
          volume: VOLUMES.backgroundMusic,
          onend: function() {
            return this.play();
          }
        }
      ]
    });
  };
  startGame = function() {
    return Zepto(function($) {
      var userData;
      fadeInMusic();
      updateFrame.currentState = states.loading;
      updateFrame.store = {};
      userData = getUserData();
      updateFrame.userData = userData;
      updateFrame = updateFrame.bind(updateFrame);
      $(document).on("keydown", onKeyDown);
      $("#give-up-button").on("click", onGiveUp);
      $("#hint-button").on("click", onHint);
      $("#mute-music-button").on("click", onMuteMusic);
      $("#mute-sfx-button").on("click", onMuteSFX);
      $("#cancel-buy-hints").on("click", onCancelBuyHints);
      return fetchQuote(userData);
    });
  };
  getUserData = function() {
    var currentPlayer, currentPlayerDefaults;
    currentPlayerDefaults = {
      hintsRemaining: CONSTANTS.startingHints,
      totalScore: 0,
      totalSolved: 0,
      totalSkipped: 0,
      currentBundleIndex: 0,
      currentQuoteIndex: 0
    };
    currentPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    if (!currentPlayer) {
      saveUserData(currentPlayerDefaults);
    }
    return R.merge(currentPlayerDefaults, currentPlayer);
  };
  saveUserData = function(userData) {
    return localStorage.setItem("currentPlayer", JSON.stringify(userData));
  };
  return preload();
};

});

