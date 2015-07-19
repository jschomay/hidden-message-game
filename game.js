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
require.register("src/bundles", function(exports, require, module) {
var bundleCompleted, bundleNames, getNextQuoteIndex, noMoreQuotes, quoteBundles, updateProgressPerBundle;

quoteBundles = [require("./bundles/starter"), require("./bundles/quotes2")];

bundleNames = ["Starter", "Quotes #2"];

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

noMoreQuotes = function(lastSolvedBundleIndex, lastSolvedQuoteIndex) {
  var nextQuote;
  nextQuote = getNextQuoteIndex(lastSolvedBundleIndex, lastSolvedQuoteIndex);
  return nextQuote.quoteIndex === 0 && nextQuote.bundleIndex === 0;
};

bundleCompleted = function(lastSolvedBundleIndex, lastSolvedQuoteIndex) {
  var nextQuote;
  nextQuote = getNextQuoteIndex(lastSolvedBundleIndex, lastSolvedQuoteIndex);
  return nextQuote.quoteIndex === 0;
};

module.exports = {
  quoteBundles: quoteBundles,
  bundleNames: bundleNames,
  updateProgressPerBundle: updateProgressPerBundle,
  getNextQuoteIndex: getNextQuoteIndex,
  noMoreQuotes: noMoreQuotes,
  bundleCompleted: bundleCompleted
};

});

require.register("src/bundles/quotes2", function(exports, require, module) {
module.exports = [
    {
        "_id": {
            "$oid": "554fbba30a061f9afcba2b7c"
        },
        "quote": "If a tree falls in a forest and no one is around to hear it, does it make a sound?",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fb8670a061f9afcba2b76"
        },
        "quote": "You miss 100% of the shots you don’t take.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fb89e0a061f9afcba2b77"
        },
        "quote": "Life is what happens to you while you’re busy making other plans.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fbad40a061f9afcba2b7a"
        },
        "quote": "If all you have is a hammer, everything looks like a nail.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fb64d0a061f9afcba2b75"
        },
        "quote": "Be the change you wish to see in the world.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fb4ab0a061f9afcba2b73"
        },
        "quote": "Obstacles are what you see when you take your eyes off your goal.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fbbe40a061f9afcba2b7d"
        },
        "quote": "Never try to teach a pig to sing; it wastes your time and it annoys the pig.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fc1230a061f9afcba2b7f"
        },
        "quote": "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fbd090a061f9afcba2b7e"
        },
        "quote": "Did you know: Two thirds of the people on earth have never seen snow?",
        "bundle": "quotes2"
    },
    {
        "_id": {
            "$oid": "554fba310a061f9afcba2b78"
        },
        "quote": "My Mama always said, \"Life was like a box of chocolates; you never know what you're gonna get.\"",
        "bundle": "quotes2"
    }
]
;
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
            "$oid": "554fb52e0a061f9afcba2b74"
        },
        "quote": "That's one small step for man, one giant leap for mankind.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb40c0a061f9afcba2b6f"
        },
        "quote": "Do... or do not. There is no try. Only do.",
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
            "$oid": "554fb2980a061f9afcba2b6c"
        },
        "quote": "Today is the tomorrow you worried about yesterday.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb4420a061f9afcba2b70"
        },
        "quote": "You're almost to the end of the starter bundle!  Good job, keep going.",
        "bundle": "starter"
    },
    {
        "_id": {
            "$oid": "554fb46b0a061f9afcba2b71"
        },
        "quote": "Do not underestimate the power of the Force.",
        "bundle": "starter"
    }
]
;
});

require.register("src/game", function(exports, require, module) {
var bundleCompleted, bundleNames, getNextQuoteIndex, kongregate, noMoreQuotes, persist, quoteBundles, updateProgressPerBundle, _ref;

kongregate = parent.kongregate;

_ref = require("./bundles"), quoteBundles = _ref.quoteBundles, bundleNames = _ref.bundleNames, getNextQuoteIndex = _ref.getNextQuoteIndex, updateProgressPerBundle = _ref.updateProgressPerBundle, noMoreQuotes = _ref.noMoreQuotes, bundleCompleted = _ref.bundleCompleted;

persist = require("./persist");

module.exports = function() {
  var CONSTANTS, SOUNDS, VOLUMES, buildSecretMessage, comboToString, decode, decodeKeyStates, fadeInMusic, fetchQuote, frame, getAllMatches, getLastFreeHintScore, getMusic, getNextFreeHintScore, getRandomElement, getRandomElements, getSFX, getUserData, getValidComboStream, hideLetters, isHidden, isLetter, isLetterOrSpace, isSolved, isSpace, isUnsolvedGroup, loadImages, loadSounds, numFreeHintsEarned, numSoundsLoaded, onCancel, onConfirm, onFrameEnter, onGiveUp, onHelp, onHint, onKeyDown, onKongregateLogin, onMuteMusic, onMuteSFX, pauseMusic, pauseSFX, playMusic, playSFX, playSound, preload, render, resetDecodeKey, saveIndexes, saveUserData, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, setStateClass, startGame, startOwlBlink, states, updateDecodeKey, updateFrame, updateLoadProgress;
  CONSTANTS = {
    startingHints: 3,
    hintSetback: 40,
    pointsForFreeHint: 200,
    pointsPerLetter: 5
  };
  SOUNDS = {};
  VOLUMES = {
    backgroundMusic: 1.0,
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
        if (trigger === "gameReady") {
          return ["loadingUser", scope, userData];
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
    loadingUser: {
      onEnter: function(scope, userData) {
        setStateClass("loadingUser");
        return getUserData(userData);
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "userLoaded") {
          return ["loading", scope, eventData];
        } else {
          return ["loadingUser", scope, userData];
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
        setStateClass("loading");
        return fetchQuote(userData);
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var decodeKey, giveHints, secretMessage;
        if (trigger === "quoteLoaded") {
          giveHints = function(indexes, decodeKey) {
            var setAsHinted;
            setAsHinted = function(i) {
              return decodeKey[i] = decodeKeyStates.HINTED;
            };
            return R.forEach(setAsHinted, indexes);
          };
          secretMessage = eventData.message;
          decodeKey = R.map(hideLetters, secretMessage);
          if (!userData.progressPerBundle) {
            giveHints([10, 28, 38, 60], decodeKey);
          } else if (userData.progressPerBundle[0] === 0) {
            giveHints([3, 4], decodeKey);
          } else if (userData.progressPerBundle[0] === 1) {
            giveHints([17], decodeKey);
          }
          scope.secretMessage = secretMessage;
          scope.currentBundleIndex = eventData.bundleIndex;
          scope.currentQuoteIndex = eventData.quoteIndex;
          scope.comboGroups = sentanceToWords(secretMessage);
          scope.decodeKey = decodeKey;
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
        return setStateClass("play");
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var char, elementsToReveal, existingSolved, hiddenChars, hintAllowance, indexedDecodeKey, indexesToReaveal, isMatch, newScore, newUnsolvedComboGroups, oneOrOneTenth, playKeySounds, potentialCombo, totalSolved, unsolvedComboGroups, wordComplete;
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
          newScore = scope.score - CONSTANTS.hintSetback < 0 ? 0 : scope.score - CONSTANTS.hintSetback;
          scope.decodeKey = setIndexes(decodeKeyStates.HINTED, scope.decodeKey, indexesToReaveal);
          scope.hints += 1;
          scope.score = newScore;
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
          feedback: comboString || scope.lastCombo || "Type letters to begin revealing the hidden message.",
          match: scope.lastCombo ? !!scope.comboString.length > 0 : null,
          score: scope.score,
          showPlayActions: true,
          progress: progress
        };
      }
    },
    gaveUp: {
      onEnter: function() {
        return setStateClass("gaveUp");
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
        if (trigger === "keyPress" && eventData.keyCode === 32) {
          scope.secretMessage = void 0;
          scope.comboGroups = void 0;
          scope.decodeKey = void 0;
          scope.comboString = void 0;
          scope.score = void 0;
          scope.moves = void 0;
          scope.hints = void 0;
          scope.lastCombo = void 0;
          if (noMoreQuotes(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)) {
            return ["noMoreQuotes", scope, userData];
          } else if (bundleCompleted(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)) {
            return ["bundleCompleted", scope, userData];
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
          showPlayActions: false,
          showLogInLink: kongregate != null ? kongregate.services.isGuest() : void 0
        };
      }
    },
    solved: {
      onEnter: function() {
        return setStateClass("solved");
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
          if (noMoreQuotes(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)) {
            return ["noMoreQuotes", scope, userData];
          } else if (bundleCompleted(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)) {
            return ["bundleCompleted", scope, userData];
          } else {
            return ["loading", scope, userData];
          }
        } else {
          return ["solved", scope, userData];
        }
      },
      getRenderData: function(scope) {
        var hints;
        hints = scope.hints > 1 ? scope.hints : "no";
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: "SOLVED in " + scope.moves + " moves!<br>Press 'Space bar' to play again.",
          score: scope.score,
          showPlayActions: false,
          solved: true,
          showLogInLink: kongregate != null ? kongregate.services.isGuest() : void 0
        };
      }
    },
    outOfHints: {
      onEnter: function() {
        return setStateClass("outOfHints");
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
    },
    bundleCompleted: {
      onEnter: function() {
        return setStateClass("bundleCompleted");
      },
      onEvent: function(eventData, scope, trigger, userData) {
        if (trigger === "confirm") {
          return ["loading", scope, userData];
        } else {
          return ["bundleCompleted", scope, userData];
        }
      },
      getRenderData: function(scope) {
        return {
          secretMessage: "",
          feedback: "",
          showPlayActions: false,
          bundleCompleted: true
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
    var scope, state, userData, _ref1, _ref2;
    _ref1 = onFrameEnter(this.store, this.currentState, trigger, data, this.userData), this.store = _ref1[0], this.currentState = _ref1[1], this.userData = _ref1[2];
    _ref2 = frame({
      state: this.currentState,
      scope: this.store,
      userData: this.userData
    }, trigger, data), state = _ref2.state, scope = _ref2.scope, userData = _ref2.userData;
    this.currentState = state;
    this.store = scope;
    return this.userData = userData;
  };
  updateFrame.userData = {};
  updateFrame.store = {};
  updateFrame.currentState = states.start;
  updateFrame = updateFrame.bind(updateFrame);
  onFrameEnter = function(scope, state, trigger, eventData, userData) {
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
    if (trigger === "loggedIn") {
      state = states.loadingUser;
      getUserData(userData);
    }
    return [scope, state, userData];
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
    var _ref1;
    if ((_ref1 = e.keyCode) === 8 || _ref1 === 32 || _ref1 === 9 || _ref1 === 37 || _ref1 === 38 || _ref1 === 39 || _ref1 === 40) {
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
  onKongregateLogin = function(e) {
    return updateFrame("loggedIn", null);
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
    var $feedback, $feedbackMessage, $muteMusic, $muteSFX, $score, $secretMessage, bundleName, buyHints, feedback, giveUp, giveUpCost, gutter, hopHeight, match, moveOwl, nextBundleName, nextHint, num, offset, owlWidth, path, pointsToGo, progress, score, secretMessage, showPlayActions, total;
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
    if (renderData.showLogInLink) {
      Zepto("#feedback .login-link").show();
    } else {
      Zepto("#feedback .login-link").hide();
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
      Zepto("#dialog h3").text("You solved all of the quotes!");
      Zepto("#dialog #message-content").html("<p>Thank you for playing.</p><p><a target='_blank' href='http://codeperfectionist.com/portfolio/games/hidden-message-game/'>Stay tuned for more quote bundles and extra features</a></p>");
      Zepto("#dialog #confirm").text("Play again?");
    }
    bundleName = bundleNames[rawScope.currentBundleIndex || 0];
    nextBundleName = bundleNames[(rawScope.currentBundleIndex || 0) + 1];
    if (renderData.bundleCompleted) {
      Zepto("#dialog #cancel").hide();
      Zepto("#dialog #confirm").show();
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("Congratulations, you finished the \"" + bundleName + "\" bundle!");
      Zepto("#dialog #message-content").html("You've unlocked the \"" + nextBundleName + "\" bundle.");
      Zepto("#dialog #confirm").text("Play next bundle");
    }
    if (rawScope.showHelp) {
      Zepto("#dialog #cancel").show();
      Zepto("#dialog #confirm").hide();
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("Help");
      Zepto("#dialog #message-content").html("<p>Stuck?  You must reveal the secret message one letter at a time, from the start of each word.  Solving each word will give you a clue to which letters other words start with.  Try going for shorter word first.  The words stay solved only when you complete them.  You can always use a hint or give up, but it will cost you.  Good luck!</p>\n<h3>Credits</h3>\n<ul>\n  <li>Game designed and built by <a target='_blank' href='http://codeperfectionist.com/about'>Jeff Schomay</a></li>\n  <li>Music by Jamison Rivera\n  <li>Owl character by <a target='_blank' href='http://sherony.com'>Sherony Lock</a></li>\n  <li>Sound effects by <a target='_blank' href='https://www.freesound.org/people/ddohler/sounds/9098/'>ddohler</a>,\n  <a target='_blank' href='https://www.freesound.org/people/Horn/sounds/9744/'>Horn</a>,\n  <a target='_blank' href='https://www.freesound.org/people/NHumphrey/sounds/204466/'>NHumphrey</a>, and\n  <a target='_blank' href='https://www.freesound.org/people/lonemonk/sounds/47048/'>lonemonk</a></li>\n  <li>Special thanks to: Mark, Marcus, Zia, David, Joey, Molly and Michele</li>\n</ul>");
      Zepto("#dialog #cancel").text("Keep playing");
    }
    num = (rawScope.currentQuoteIndex || 0) + 1;
    bundleName = bundleNames[rawScope.currentBundleIndex || 0];
    total = quoteBundles[rawScope.currentBundleIndex || 0].length;
    Zepto("#user-info").show();
    Zepto("#progress").html("Bundle: \"" + bundleName + "\"<br>#" + num + " out of " + total);
    Zepto("#total-score").text(userData.totalScore);
    if (kongregate != null ? kongregate.services.isGuest() : void 0) {
      Zepto("#user-info .login-link").show();
    } else {
      Zepto("#user-info .login-link").hide();
    }
    owlWidth = Zepto("#owl").width();
    gutter = 200;
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
      moveOwl(window.innerWidth - (owlWidth + 10), 70);
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
  loadImages = function(images) {
    var loadAssets, loadImage;
    loadImage = function(path) {
      var img;
      img = new Image();
      img.src = path;
      return img;
    };
    loadAssets = R.map(loadImage);
    return loadAssets(images);
  };
  preload = function() {
    var keepInMemory;
    keepInMemory = loadImages(["assets/owl-normal.png", "assets/owl-happy.png", "assets/owl-sad.png", "assets/owl-blink.png"]);
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
        "assets/background-music-long", {
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
      fadeInMusic();
      $('.popup').click(function() {
        var height, left, opts, top, url, width;
        width = 575;
        height = 400;
        left = ($(window).width() - width) / 2;
        top = ($(window).height() - height) / 2;
        url = this.href;
        opts = "status=1,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
        window.open(url, 'Share', opts);
        return false;
      });
      $(document).on("keydown", onKeyDown);
      $("#give-up-button").on("click", onGiveUp);
      $("#hint-button").on("click", onHint);
      $("#mute-music-button").on("click", onMuteMusic);
      $("#mute-sfx-button").on("click", onMuteSFX);
      $("#help-button").on("click", onHelp);
      $("#cancel").on("click", onCancel);
      $("#confirm").on("click", onConfirm);
      $(".login-link").on("click", function() {
        return kongregate != null ? kongregate.services.showSignInBox() : void 0;
      });
      if (kongregate != null) {
        kongregate.services.addEventListener("login", onKongregateLogin);
      }
      startOwlBlink();
      return updateFrame("gameReady");
    });
  };
  getUserData = function(progress) {
    var currentPlayerDefaults, hasProgress, userData;
    currentPlayerDefaults = {
      hintsRemaining: CONSTANTS.startingHints,
      totalScore: 0,
      lastSolvedBundleIndex: void 0,
      lastSolvedQuoteIndex: void 0,
      progressPerBundle: void 0
    };
    hasProgress = R.values(progress).length;
    userData = hasProgress ? progress : currentPlayerDefaults;
    return persist.load().then(function(currentPlayer) {
      if (!currentPlayer) {
        saveUserData(userData);
        return updateFrame("userLoaded", userData);
      } else {
        return updateFrame("userLoaded", R.merge(userData, currentPlayer.toJSON()));
      }
    }, function(error) {
      console.error("Error loading user data:", error);
      return updateFrame("userLoaded", userData);
    });
  };
  saveUserData = function(userData) {
    return persist.save(userData);
  };
  return preload();
};

});

require.register("src/persist", function(exports, require, module) {
var Player, getUserId, kongregate, savedPlayer;

kongregate = parent.kongregate;

Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O", "pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD");

getUserId = function() {
  var mockUserId, userId;
  mockUserId = false;
  if (!kongregate) {
    if (mockUserId) {
      return "mockUser";
    }
  } else {
    if (!kongregate.services.isGuest()) {
      return userId = kongregate.services.getUserId();
    } else {
      return void 0;
    }
  }
};

Player = Parse.Object.extend("KongregatePlayer");

savedPlayer = void 0;

module.exports = {
  save: function(data) {
    var userId;
    userId = "" + getUserId();
    if (!userId) {
      return;
    }
    if (!savedPlayer) {
      savedPlayer = new Player();
      savedPlayer.set("userId", userId);
      return savedPlayer.save(data).then(function(player) {
        return true;
      }, function(error) {
        return console.error(error);
      });
    } else {
      return savedPlayer.save(data).then(function(player) {
        return true;
      }, function(error) {
        return console.error(error);
      });
    }
  },
  load: function() {
    var immediate, playerPromise, query, userId;
    userId = "" + getUserId();
    if (userId) {
      query = new Parse.Query(Player);
      query.equalTo("userId", userId);
      playerPromise = query.first();
      playerPromise.then(function(player) {
        if (player) {
          return savedPlayer = player;
        }
      }, function(error) {
        return console.error(error);
      });
      return playerPromise;
    } else {
      immediate = new Parse.Promise();
      setTimeout((function() {
        return immediate.resolve();
      }), 0);
      return immediate;
    }
  }
};

});

