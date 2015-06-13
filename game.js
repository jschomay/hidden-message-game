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

require.register("src/bundles", function(exports, require, module) {
var getNextQuoteIndex, quoteBundles, updateProgressPerBundle;

quoteBundles = [require("./bundles/starter")];

updateProgressPerBundle = function(progressPerBundle, currentBundleIndex, currentQuoteIndex) {
  var initedPreviousBundles;
  if (!progressPerBundle) {
    initedPreviousBundles = R.times(R.always(0), currentBundleIndex);
    return R.append(currentQuoteIndex, initedPreviousBundles);
  } else if (currentBundleIndex === progressPerBundle.length - 1) {
    if (currentQuoteIndex > R.last(progressPerBundle)) {
      return R.append(currentQuoteIndex, R.slice(0, -1, progressPerBundle));
    } else {
      return progressPerBundle;
    }
  } else if (currentBundleIndex > progressPerBundle.length - 1) {
    return R.append(currentQuoteIndex, progressPerBundle);
  } else {
    return progressPerBundle;
  }
};

getNextQuoteIndex = function(lastSolvedBundleIndex, lastSolvedQuoteIndex) {
  if (lastSolvedQuoteIndex == null) {
    return {
      quoteIndex: 0,
      bundleIndex: 0
    };
  } else if (lastSolvedQuoteIndex === quoteBundles[lastSolvedBundleIndex].length - 1) {
    return {
      quoteIndex: 0,
      bundleIndex: quoteBundles[lastSolvedBundleIndex + 1] ? lastSolvedBundleIndex + 1 : 0
    };
  } else {
    return {
      quoteIndex: lastSolvedQuoteIndex + 1,
      bundleIndex: lastSolvedBundleIndex
    };
  }
};

module.exports = {
  quoteBundles: quoteBundles,
  updateProgressPerBundle: updateProgressPerBundle,
  getNextQuoteIndex: getNextQuoteIndex
};

});

require.register("src/bundles/starter", function(exports, require, module) {
module.exports = [
    {
        "_id": {
            "$oid": "554fba3e0a061f9afcba2b79"
        },
        "quote": "Happiness isn't having what you want, it's wanting what you have.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fbb780a061f9afcba2b7b"
        },
        "quote": "He who laughs last, laughs longest.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb2980a061f9afcba2b6c"
        },
        "quote": "Today is the tomorrow you worried about yesterday.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb52e0a061f9afcba2b74"
        },
        "quote": "That's one small step for man, one giant leap for mankind.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb2c60a061f9afcba2b6d"
        },
        "quote": "Talk sense to a fool and he calls you foolish.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb4880a061f9afcba2b72"
        },
        "quote": "80% of success is just showing up.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fc398720a9ad00b7fa94b"
        },
        "quote": "If you choose not to decide, you still have made a choice.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fbba30a061f9afcba2b7c"
        },
        "quote": "If a tree falls in a forest and no one is around to hear it, does it make a sound?",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb46b0a061f9afcba2b71"
        },
        "quote": "Do not underestimate the power of the Force.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb64d0a061f9afcba2b75"
        },
        "quote": "Be the change you wish to see in the world.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb8670a061f9afcba2b76"
        },
        "quote": "You miss 100% of the shots you don’t take.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb89e0a061f9afcba2b77"
        },
        "quote": "Life is what happens to you while you’re busy making other plans.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb40c0a061f9afcba2b6f"
        },
        "quote": "You teach best what you most need to learn.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fbad40a061f9afcba2b7a"
        },
        "quote": "If all you have is a hammer, everything looks like a nail.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb4ab0a061f9afcba2b73"
        },
        "quote": "Obstacles are what you see when you take your eyes off your goal.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fbbe40a061f9afcba2b7d"
        },
        "quote": "Never try to teach a pig to sing; it wastes your time and it annoys the pig.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fc1230a061f9afcba2b7f"
        },
        "quote": "Two things are infinite: the universe and human stupidity; and I'm not sure about the the universe.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb4420a061f9afcba2b70"
        },
        "quote": "You're almost to the end of the starter pack!  Good job, keep going.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fbd090a061f9afcba2b7e"
        },
        "quote": "Did you know: Two thirds of the people on earth have never seen snow?",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fba310a061f9afcba2b78"
        },
        "quote": "My Mama always said, \"Life was like a box of chocolates; you never know what you're gonna get.\"",
        "bundle": "starter"
    }
]
;
});

require.register("src/game", function(exports, require, module) {
var getNextQuoteIndex, quoteBundles, updateProgressPerBundle, _ref;

_ref = require("./bundles"), quoteBundles = _ref.quoteBundles, getNextQuoteIndex = _ref.getNextQuoteIndex, updateProgressPerBundle = _ref.updateProgressPerBundle;

module.exports = function() {
  var CONSTANTS, SOUNDS, VOLUMES, buildSecretMessage, comboToString, decode, decodeKeyStates, fadeDownMusic, fadeInMusic, fadeUpMusic, fetchQuote, frame, getAllMatches, getLastFreeHintScore, getMusic, getNextFreeHintScore, getRandomElement, getRandomElements, getSFX, getUserData, getValidComboStream, hideLetters, isHidden, isLetter, isLetterOrSpace, isSolved, isSpace, isUnsolvedGroup, loadSounds, numFreeHintsEarned, numSoundsLoaded, onCancel, onConfirm, onFrameEnter, onGiveUp, onHelp, onHint, onKeyDown, onMuteMusic, onMuteSFX, pauseMusic, pauseSFX, playMusic, playSFX, playSound, preload, render, resetDecodeKey, saveIndexes, saveUserData, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, setStateClass, startGame, startOwlBlink, states, updateDecodeKey, updateFrame, updateLoadProgress;
  CONSTANTS = {
    startingHints: 5,
    hintSetback: 20,
    pointsForFreeHint: 150,
    pointsPerLetter: 5
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
      var newArr, randomElement, _ref1;
      _ref1 = getRandomElement(arr), randomElement = _ref1[0], newArr = _ref1[1];
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
    start: {
      onEnter: function() {
        return setStateClass("start");
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "start") {
          return ["loading", scope, userData];
        } else {
          return ["start", scope, userData];
        }
      },
      getRenderData: function() {
        return {
          secretMessage: [],
          feedback: "LOADING...",
          score: "",
          showPlayActions: false
        };
      }
    },
    loading: {
      onEnter: function(scope, userData) {
        setStateClass("start");
        fadeUpMusic();
        return fetchQuote(userData);
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var secretMessage;
        if (trigger === "quoteLoaded") {
          secretMessage = eventData.message;
          scope.secretMessage = secretMessage;
          scope.currentBundleIndex = eventData.bundleIndex;
          scope.currentQuoteIndex = eventData.quoteIndex;
          scope.comboGroups = sentanceToWords(secretMessage);
          scope.decodeKey = R.map(hideLetters, secretMessage);
          scope.comboString = "";
          scope.score = R.filter(isLetter, secretMessage).length * CONSTANTS.pointsPerLetter;
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
        setStateClass("play");
        return fadeUpMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var char, elementsToReveal, existingSolved, hiddenChars, hintAllowance, indexedDecodeKey, indexesToReaveal, isMatch, newUnsolvedComboGroups, oneOrOneTenth, playKeySounds, potentialCombo, totalSolved, unsolvedComboGroups, wordComplete;
        if (trigger === "giveUp") {
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
            userData.totalScore += scope.score;
            userData.hintsRemaining += numFreeHintsEarned(userData.totalScore, scope.score);
            userData.lastSolvedBundleIndex = scope.currentBundleIndex;
            userData.lastSolvedQuoteIndex = scope.currentQuoteIndex;
            userData.progressPerBundle = updateProgressPerBundle(userData.progressPerBundle, scope.currentBundleIndex, scope.currentQuoteIndex);
            saveUserData(userData);
            return ["solved", scope, userData];
          }
        }
        return ["play", scope, userData];
      },
      getRenderData: function(scope) {
        var comboString, isFilled, numberFilled, progress, removeNonLetters, statusOfJustLetters;
        removeNonLetters = function(val, i) {
          return isLetter(scope.secretMessage[i]);
        };
        statusOfJustLetters = R.filterIndexed(removeNonLetters, scope.decodeKey);
        isFilled = function(status) {
          return status === decodeKeyStates.REVEALED || status === decodeKeyStates.SOLVED || status === decodeKeyStates.HINTEDFILLED;
        };
        numberFilled = R.length(R.filter(isFilled, statusOfJustLetters));
        progress = numberFilled / statusOfJustLetters.length;
        comboString = scope.comboString.length ? scope.comboString : null;
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: comboString || scope.lastCombo || "Type letters to begin revealing he hidden message.",
          match: scope.lastCombo ? !!scope.comboString.length > 0 : null,
          score: scope.score,
          showPlayActions: true,
          progress: progress
        };
      }
    },
    gaveUp: {
      onEnter: function() {
        setStateClass("gaveUp");
        return fadeDownMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var numUnsolved;
        if (trigger === "confirm") {
          playSound("giveUp");
          numUnsolved = R.length(R.filter(R.compose(R.not, isSolved))(scope.decodeKey));
          userData.lastSolvedBundleIndex = scope.currentBundleIndex;
          userData.lastSolvedQuoteIndex = scope.currentQuoteIndex;
          userData.totalScore -= numUnsolved * CONSTANTS.pointsPerLetter;
          userData.progressPerBundle = updateProgressPerBundle(userData.progressPerBundle, scope.currentBundleIndex, scope.currentQuoteIndex);
          saveUserData(userData);
          return ["confirmedGiveUp", scope, userData];
        } else if (trigger === "cancel") {
          return ["play", scope, userData];
        } else {
          return ["gaveUp", scope, userData];
        }
      },
      getRenderData: function(scope) {
        var comboString, cost;
        cost = CONSTANTS.pointsPerLetter * R.length(R.filter(R.compose(R.not, isSolved))(scope.decodeKey));
        comboString = scope.comboString.length ? scope.comboString : null;
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: comboString || scope.lastCombo || "Type letter combos to reveal the hidden message.",
          match: scope.lastCombo ? !!scope.comboString.length > 0 : null,
          score: scope.score,
          showPlayActions: true,
          buyHints: true,
          giveUp: true,
          giveUpCost: cost
        };
      }
    },
    confirmedGiveUp: {
      onEnter: function() {
        return setStateClass("confirmedGiveUp");
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var nextQuote;
        if (trigger === "keyPress" && eventData.keyCode === 32) {
          scope.secretMessage = void 0;
          scope.comboGroups = void 0;
          scope.decodeKey = void 0;
          scope.comboString = void 0;
          scope.score = void 0;
          scope.moves = void 0;
          scope.hints = void 0;
          scope.lastCombo = void 0;
          nextQuote = getNextQuoteIndex(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex);
          if (nextQuote.quoteIndex === 0 && nextQuote.bundleIndex === 0) {
            return ["noMoreQuotes", scope, userData];
          } else {
            return ["loading", scope, userData];
          }
        } else {
          return ["confirmedGiveUp", scope, userData];
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
        setStateClass("solved");
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
          showPlayActions: false,
          solved: true
        };
      }
    },
    outOfHints: {
      onEnter: function() {
        setStateClass("outOfHints");
        return fadeDownMusic();
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "confirm") {
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
    },
    noMoreQuotes: {
      onEnter: function() {
        return setStateClass("noMoreQuotes");
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "confirm") {
          return ["loading", scope, userData];
        } else {
          return ["noMoreQuotes", scope, userData];
        }
      },
      getRenderData: function(scope) {
        return {
          secretMessage: "",
          feedback: "",
          showPlayActions: false,
          noMoreQuotes: true
        };
      }
    }
  };
  frame = function(seed, trigger, eventData) {
    var newScope, newState, newUserData, _ref1;
    _ref1 = seed.state.onEvent(eventData, seed.scope, trigger, seed.userData), newState = _ref1[0], newScope = _ref1[1], newUserData = _ref1[2];
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
    var scope, state, userData, _ref1;
    this.store = onFrameEnter(this.store, trigger, data);
    _ref1 = frame({
      state: this.currentState,
      scope: this.store,
      userData: this.userData
    }, trigger, data), state = _ref1.state, scope = _ref1.scope, userData = _ref1.userData;
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
    if (trigger === "getHelp") {
      scope.showHelp = !scope.showHelp;
    }
    if (trigger === "cancel" && scope.showHelp) {
      scope.showHelp = !scope.showHelp;
    }
    return scope;
  };
  fetchQuote = function(userData) {
    var message, nextQuote;
    nextQuote = getNextQuoteIndex(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex);
    message = quoteBundles[nextQuote.bundleIndex][nextQuote.quoteIndex].quote;
    return setTimeout(function() {
      return updateFrame("quoteLoaded", {
        message: message,
        bundleIndex: nextQuote.bundleIndex,
        quoteIndex: nextQuote.quoteIndex
      });
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
  onHelp = function(e) {
    e.preventDefault();
    return updateFrame("getHelp", null);
  };
  onCancel = function(e) {
    e.preventDefault();
    return updateFrame("cancel", null);
  };
  onConfirm = function(e) {
    e.preventDefault();
    return updateFrame("confirm", null);
  };
  buildSecretMessage = function(secretMessage) {
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
    var $feedback, $feedbackMessage, $muteMusic, $muteSFX, $score, $secretMessage, bundleName, bundleNames, buyHints, feedback, giveUp, giveUpCost, gutter, hopHeight, match, moveOwl, nextHint, num, offset, owlWidth, path, pointsToGo, progress, score, secretMessage, showPlayActions, total;
    $secretMessage = Zepto("#secret-message");
    $feedback = Zepto("#feedback");
    $feedbackMessage = Zepto("#feedback #message");
    $score = Zepto("#score");
    $muteMusic = Zepto("#mute-music-button");
    $muteSFX = Zepto("#mute-sfx-button");
    secretMessage = renderData.secretMessage, feedback = renderData.feedback, score = renderData.score, showPlayActions = renderData.showPlayActions, match = renderData.match, buyHints = renderData.buyHints, giveUp = renderData.giveUp, giveUpCost = renderData.giveUpCost;
    $secretMessage.html(buildSecretMessage(secretMessage));
    $feedbackMessage.html(feedback);
    $score.text(score);
    $feedback.removeClass("no-match");
    $feedback.removeClass("match");
    if (match === true) {
      $feedback.addClass("match");
    }
    if (match === false) {
      $feedback.addClass("no-match");
    }
    if (renderData.solved) {
      Zepto("#share").show();
    } else {
      Zepto("#share").hide();
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
    Zepto("#dialog").hide();
    if (buyHints) {
      Zepto("#dialog #cancel").hide();
      Zepto("#dialog #confirm").show();
      nextHint = getNextFreeHintScore(userData.totalScore);
      pointsToGo = getNextFreeHintScore(userData.totalScore) - userData.totalScore;
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("You are out of hints!");
      Zepto("#dialog #message-content").html("Next free hint awarded at " + nextHint + " points (" + pointsToGo + " points to go)");
      Zepto("#dialog #confirm").text("OK");
    }
    if (giveUp) {
      Zepto("#dialog #cancel").show();
      Zepto("#dialog #confirm").show();
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("Are you sure you want to give up?");
      Zepto("#dialog #message-content").html("You will lose " + giveUpCost + " points for the remaining unsolved words.");
      Zepto("#dialog #confirm").text("Yes, give up");
      Zepto("#dialog #cancel").text("No, I'll keep trying");
    }
    if (renderData.noMoreQuotes) {
      Zepto("#dialog #cancel").hide();
      Zepto("#dialog #confirm").show();
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("Congratulations, you solved all of the quotes!");
      Zepto("#dialog #message-content").html("<p>Thank you for playing.</p><p><a target='_blank' href='http://codeperfectionist.com/portfolio/games/hidden-message-game/'>Stay tuned for more quote bundles and extra features</a></p>");
      Zepto("#dialog #confirm").text("Play again?");
    }
    if (rawScope.showHelp) {
      Zepto("#dialog #cancel").show();
      Zepto("#dialog #confirm").hide();
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("Help");
      Zepto("#dialog #message-content").html("<p>Stuck?  You have to reveal the secret message one letter at a time from the start of each word.  Solving some words will give clues to what letters other words start with.  Try going for shorter word first.  The words say solved only when you complete them.  You can always use a hint or give up, but it will cost you.  Good luck!</p>\n<h3>Credits</h3>\n<ul>\n  <li>Game designed and built by <a target='_blank' href='http://codeperfectionist.com/about'>Jeff Schomay</a></li>\n  <li>Music by <a target='_blank' href='...'>...</a></li>\n  <li>Owl character by <a target='_blank' href='...'>...</a></li>\n  <li>Sound effects by <a target='_blank' href='https://www.freesound.org/people/ddohler/sounds/9098/'>ddohler</a>,\n  <a target='_blank' href='https://www.freesound.org/people/Horn/sounds/9744/'>Horn</a>,\n  <a target='_blank' href='https://www.freesound.org/people/NHumphrey/sounds/204466/'>NHumphrey</a>, and\n  <a target='_blank' href='https://www.freesound.org/people/lonemonk/sounds/47048/'>lonemonk</a></li>\n  <li>Special thanks to: Mark, Marcus, Zia, David, and Michele</li>\n</ul>");
      Zepto("#dialog #cancel").text("Keep playing");
    }
    bundleNames = ["Starter"];
    num = (rawScope.currentQuoteIndex || 0) + 1;
    bundleName = bundleNames[rawScope.currentBundleIndex || 0];
    total = quoteBundles[rawScope.currentBundleIndex || 0].length;
    Zepto("#user-info").show();
    Zepto("#progress").html("Bundle: \"" + bundleName + "\"<br>#" + num + " out of " + total);
    Zepto("#total-score").text(userData.totalScore);
    owlWidth = Zepto("#owl").width();
    gutter = 260;
    path = window.innerWidth - gutter - owlWidth;
    progress = renderData.progress || 0;
    offset = path * progress + gutter / 2;
    hopHeight = 15;
    moveOwl = function(x, y) {
      return Zepto("#owl").css({
        '-webkit-transform': "translate3d(" + x + "px, -" + y + "px, 0)",
        '-ms-transform': "translate3d(" + x + "px, -" + y + "px, 0)",
        'transform': "translate3d(" + x + "px, -" + y + "px, 0)"
      });
    };
    if (renderData.solved) {
      moveOwl(window.innerWidth - (owlWidth + 40), 80);
    } else {
      moveOwl(offset, hopHeight);
    }
    return setTimeout((function() {
      if (!renderData.solved) {
        return moveOwl(offset, 0);
      }
    }), 70);
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
  setStateClass = function(stateName) {
    Zepto("body").removeClass();
    return Zepto("body").addClass(stateName);
  };
  startOwlBlink = function() {
    var blink, openCloseEyes;
    openCloseEyes = function() {
      return Zepto("#owl").toggleClass("blink");
    };
    blink = function() {
      openCloseEyes();
      setTimeout(openCloseEyes, 200);
      return setTimeout(blink, 8000 + ((Math.random() - 0.5) * 5000));
    };
    setTimeout(blink, 5000);
    return setTimeout(blink, 7000);
  };
  startGame = function() {
    return Zepto(function($) {
      var userData;
      fadeInMusic();
      updateFrame.currentState = states.start;
      updateFrame.store = {};
      userData = getUserData();
      updateFrame.userData = userData;
      updateFrame = updateFrame.bind(updateFrame);
      $(document).on("keydown", onKeyDown);
      $("#give-up-button").on("click", onGiveUp);
      $("#hint-button").on("click", onHint);
      $("#mute-music-button").on("click", onMuteMusic);
      $("#mute-sfx-button").on("click", onMuteSFX);
      $("#help-button").on("click", onHelp);
      $("#cancel").on("click", onCancel);
      $("#confirm").on("click", onConfirm);
      startOwlBlink();
      return updateFrame("start");
    });
  };
  getUserData = function() {
    var currentPlayer, currentPlayerDefaults;
    currentPlayerDefaults = {
      hintsRemaining: CONSTANTS.startingHints,
      totalScore: 0,
      lastSolvedBundleIndex: void 0,
      lastSolvedQuoteIndex: void 0,
      progressPerBundle: void 0
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

