(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
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
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("src/analytics.coffee", function(exports, require, module) {
var bundleNames, getNextQuoteIndex, _ref;

Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O", "pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD");

_ref = require("./bundles"), bundleNames = _ref.bundleNames, getNextQuoteIndex = _ref.getNextQuoteIndex;

module.exports = function(eventName, scope, userData, dimensions) {
  var nextQuote, round;
  if (scope == null) {
    scope = {};
  }
  if (userData == null) {
    userData = {};
  }
  if (dimensions == null) {
    dimensions = {};
  }
  dimensions.platform = "direct";
  if (userData.lastSolvedBundleIndex) {
    nextQuote = getNextQuoteIndex(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex);
    round = "" + bundleNames[nextQuote.bundleIndex] + "-" + (nextQuote.quoteIndex + 1);
    dimensions.round = round;
  }
  return Parse.Analytics.track(eventName, dimensions);
};

});

require.register("src/bundles.coffee", function(exports, require, module) {
var bundleCompleted, bundleNames, getNextQuoteIndex, noMoreQuotes, quoteBundles, updateProgressPerBundle;

quoteBundles = [require("./bundles/starter"), require("./bundles/quotes2"), require("./bundles/jokes")];

bundleNames = ["Starter", "Quotes #2", "Jokes"];

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

require.register("src/bundles/jokes.json", function(exports, require, module) {
module.exports = [
    {
        "quote": "What happens when you run behind a car?",
        "source": "You get exhausted."
    },
    {
        "quote": "What happens when you run in front of a car?",
        "source": "You get tired."
    },
    {
        "quote": "What happens to frogs that park illegally?",
        "source": "They get toad."
    },
    {
        "quote": "How do crazy people get through the forest?",
        "source": "They take the psychopath."
    },
    {
        "quote": "What do you call a fish without any eyes?",
        "source": "A fsh."
    },
    {
        "quote": "What do you call a fly without any wings?",
        "source": "A walk."
    },
    {
        "quote": "What do you call a cow without any legs?",
        "source": "Ground beef."
    },
    {
        "quote": "What do you call a cow with only two legs?",
        "source": "Lean beef."
    },
    {
        "quote": "What do you call a cow that just gave birth?",
        "source": "De-calf-inated"
    },
    {
        "quote": "How do you count cows?",
        "source": "With a cowculator."
    }
]
;
});

require.register("src/bundles/quotes2.json", function(exports, require, module) {
module.exports = [
    {
        "quote": "If a tree falls in a forest and no one is around to hear it, does it make a sound?",
        "source": "Philosophical thought experiment"
    },
    {
        "quote": "You miss 100% of the shots you don’t take.",
        "source": "Wayne Gretzky, the \"greatest hockey player ever\""
    },
    {
        "quote": "Life is what happens to you while you’re busy making other plans.",
        "source": "\"Beautiful Boy\" lyrics by John Lennon"
    },
    {
        "quote": "If all you have is a hammer, everything looks like a nail.",
        "source": "Abraham Maslow"
    },
    {
        "quote": "Be the change you wish to see in the world.",
        "source": "Attributed to Mahatma Gandhi"
    },
    {
        "quote": "Obstacles are what you see when you take your eyes off your goal.",
        "source": "Henry Ford"
    },
    {
        "quote": "Never try to teach a pig to sing; it wastes your time and it annoys the pig.",
        "source": "Robert Heinlein (1907 - 1988) American Science Fiction Author"
    },
    {
        "quote": "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        "source": "Albert Einstein"
    },
    {
        "quote": "Did you know: Two thirds of the people on earth have never seen snow?",
        "source": "Now you know"
    },
    {
        "quote": "My Mama always said, \"Life was like a box of chocolates; you never know what you're gonna get.\"",
        "source": "Forrest Gump (Tom Hanks) in \"Forrest Gump\""
    }
]
;
});

require.register("src/bundles/starter.json", function(exports, require, module) {
module.exports = [
    {
        "quote": "Happiness isn't having what you want, it's wanting what you have.",
        "source": "Very old proverb"
    },
    {
        "quote": "He who laughs last, laughs longest.",
        "source": "Common idiom originating from an old English play"
    },
    {
        "quote": "That's one small step for man, one giant leap for mankind.",
        "source": "Neil Armstrong upon first ever lunar landing"
    },
    {
        "quote": "Do... or do not. There is no try. Only do.",
        "source": "Yoda in \"Star Wars: Episode V - The Empire Strikes Back\""
    },
    {
        "quote": "Talk sense to a fool and he calls you foolish.",
        "source": "Euripides, Greek tragic dramatist (484 BC - 406 BC)"
    },
    {
        "quote": "80% of success is just showing up.",
        "source": "Woody Allen"
    },
    {
        "quote": "If you choose not to decide, you still have made a choice.",
        "source": "\"Freewill\" lyrics by Rush"
    },
    {
        "quote": "Today is the tomorrow you worried about yesterday.",
        "source": "Dale Carnegie, self-improvement author"
    },
    {
        "quote": "You're almost to the end of the starter bundle!  Good job, keep going.",
        "source": "Surprise!  Hi from the game's author.  How meta."
    },
    {
        "quote": "Do not underestimate the power of the Force.",
        "source": "Slight misquote of Darth Vader from Star Wars"
    }
]
;
});

require.register("src/game.coffee", function(exports, require, module) {
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

module.exports = function() {
  var CONSTANTS, SOUNDS, VOLUMES, buildSecretMessage, comboToString, decode, decodeKeyStates, fadeInMusic, fetchQuote, frame, getAllMatches, getLastFreeHintScore, getMusic, getNextFreeHintScore, getRandomElement, getRandomElements, getSFX, getUserData, getValidComboStream, hideLetters, isHidden, isLetter, isLetterOrSpace, isSolved, isSpace, isUnsolvedGroup, loadImages, loadSounds, numFreeHintsEarned, numSoundsLoaded, onCancel, onConfirm, onFrameEnter, onGiveUp, onHelp, onHint, onKeyDown, onKeyboardKeyPress, onMuteMusic, onMuteSFX, onPlayAgain, pauseMusic, pauseSFX, playMusic, playSFX, playSound, preload, render, resetDecodeKey, saveIndexes, saveUserData, sentanceToWords, setIndexIfNotSolved, setIndexes, setIndexesToRevealed, setIndexesToSolved, setStateClass, startGame, startOwlBlink, states, updateDecodeKey, updateFrame, updateLoadProgress;
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
    HINTED: 3
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
    map[decodeKeyStates.HINTED] = decodeKeyStates.REVEALED;
    return map[currentStatus] || currentStatus;
  });
  resetDecodeKey = function(decodeKey) {
    var map, resetTransform;
    map = {};
    map[decodeKeyStates.REVEALED] = decodeKeyStates.HINTED;
    map[decodeKeyStates.HINTED] = decodeKeyStates.HINTED;
    map[decodeKeyStates.SOLVED] = decodeKeyStates.SOLVED;
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
      return "";
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
        setStateClass("loading");
        return fetchQuote(userData);
      },
      onEvent: function(eventData, scope, trigger, userData) {
        var decodeKey, giveHints, secretMessage, source;
        if (trigger === "quoteLoaded") {
          giveHints = function(indexes, decodeKey) {
            var setAsHinted;
            setAsHinted = function(i) {
              if (decodeKey[i] === decodeKeyStates.HIDDEN) {
                return decodeKey[i] = decodeKeyStates.HINTED;
              }
            };
            return R.forEach(setAsHinted, indexes);
          };
          secretMessage = eventData.message;
          source = eventData.source;
          decodeKey = R.map(hideLetters, secretMessage);
          if (userData.solvedQuotes === 0) {
            giveHints([10, 28, 38, 60], decodeKey);
          } else if (userData.solvedQuotes === 1) {
            giveHints([3, 4], decodeKey);
          } else if (userData.solvedQuotes === 2) {
            giveHints([17], decodeKey);
          }
          scope.secretMessage = secretMessage;
          scope.source = source;
          scope.comboGroups = sentanceToWords(secretMessage);
          scope.decodeKey = decodeKey;
          scope.comboString = "";
          scope.score = R.filter(isLetter, secretMessage).length * CONSTANTS.pointsPerLetter;
          scope.moves = 0;
          scope.hints = 0;
          scope.lastCombo = null;
          scope.comboCompleted = false;
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
            userData.solvedQuotes += 1;
            userData.solved.push(scope.source);
            saveUserData(userData);
            return ["solved", scope, userData];
          }
        }
        return ["play", scope, userData];
      },
      getRenderData: function(scope) {
        var feedback, isFilled, numberFilled, progress, removeNonLetters, statusOfJustLetters;
        removeNonLetters = function(val, i) {
          return isLetter(scope.secretMessage[i]);
        };
        statusOfJustLetters = R.filterIndexed(removeNonLetters, scope.decodeKey);
        isFilled = function(status) {
          return status === decodeKeyStates.REVEALED || status === decodeKeyStates.SOLVED;
        };
        numberFilled = R.length(R.filter(isFilled, statusOfJustLetters));
        progress = numberFilled / statusOfJustLetters.length;
        feedback = scope.comboCompleted ? "Word completed!" : scope.comboString.length ? "Current streak: " + scope.comboString : scope.lastCombo ? "No words start with " + scope.lastCombo : "Type letters to begin revealing the hidden message.";
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: feedback,
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
          userData.totalScore -= numUnsolved * CONSTANTS.pointsPerLetter;
          userData.solved.push(scope.source);
          saveUserData(userData);
          return ["confirmedGiveUp", scope, userData];
        } else if (trigger === "cancel") {
          return ["play", scope, userData];
        } else {
          return ["gaveUp", scope, userData];
        }
      },
      getRenderData: function(scope) {
        var cost, feedback;
        cost = CONSTANTS.pointsPerLetter * R.length(R.filter(R.compose(R.not, isSolved))(scope.decodeKey));
        feedback = scope.comboCompleted ? "Word completed!" : scope.comboString.length ? "Current streak: " + scope.comboString : scope.lastCombo ? "No words start with " + scope.lastCombo : "Type letters to begin revealing the hidden message.";
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: feedback,
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
          scope.source = void 0;
          scope.comboGroups = void 0;
          scope.decodeKey = void 0;
          scope.comboString = void 0;
          scope.score = void 0;
          scope.moves = void 0;
          scope.hints = void 0;
          scope.lastCombo = void 0;
          return ["loading", scope, userData];
        } else {
          return ["confirmedGiveUp", scope, userData];
        }
      },
      getRenderData: function(scope) {
        return {
          secretMessage: decode(scope.secretMessage, R.map(R.always(decodeKeyStates.SOLVED), scope.decodeKey)),
          source: "https://icanhazdadjoke.com/j/" + scope.source,
          gaveUp: true,
          feedback: "You gave up!<br>Press 'Space bar' to play again.",
          score: 0,
          showPlayActions: false
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
          scope.source = void 0;
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
          source: "https://icanhazdadjoke.com/j/" + scope.source,
          feedback: "SOLVED in " + scope.moves + " moves!<br>Press 'Space bar' to play again.",
          score: scope.score,
          showPlayActions: false,
          solved: true
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
        var feedback;
        feedback = scope.comboCompleted ? "Word completed!" : scope.comboString.length ? "Current streak: " + scope.comboString : scope.lastCombo ? "No words start with " + scope.lastCombo : "Type letters to begin revealing the hidden message.";
        return {
          secretMessage: decode(scope.secretMessage, scope.decodeKey),
          feedback: feedback,
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
    if (trigger === "getHelp") {
      scope.showHelp = !scope.showHelp;
    }
    if (trigger === "cancel" && scope.showHelp) {
      scope.showHelp = !scope.showHelp;
    }
    return scope;
  };
  fetchQuote = function(userData) {
    var myHeaders;
    myHeaders = new Headers({
      "User-Agent": "Hidden Message Game (https://github.com/jschomay/hidden-message-game)",
      "Accept": "application/json"
    });
    return fetch("https://icanhazdadjoke.com/", {
      headers: myHeaders
    }).then(function(response) {
      return response.json();
    }).then(function(_arg) {
      var id, joke;
      id = _arg.id, joke = _arg.joke;
      if (__indexOf.call(userData.solved, id) >= 0) {
        console.warn("Already seen this quote, fetching a new one..");
        return fetchQuote(userData);
      } else {
        return updateFrame("quoteLoaded", {
          message: joke,
          source: id,
          quoteIndex: 0
        });
      }
    });
  };
  onKeyDown = function(e) {
    var _ref;
    if ((_ref = e.keyCode) === 8 || _ref === 32 || _ref === 9 || _ref === 37 || _ref === 38 || _ref === 39 || _ref === 40) {
      e.preventDefault();
    }
    return updateFrame("keyPress", e);
  };
  onKeyboardKeyPress = function(e) {
    e.preventDefault();
    return updateFrame("keyPress", {
      keyCode: e.target.innerHTML.charCodeAt(0) - 32
    });
  };
  onPlayAgain = function(e) {
    e.preventDefault();
    return updateFrame("keyPress", {
      keyCode: 32
    });
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
    var $feedback, $feedbackMessage, $muteMusic, $muteSFX, $score, $secretMessage, $source, buyHints, feedback, giveUp, giveUpCost, gutter, hopHeight, match, moveOwl, nextHint, offset, owlWidth, path, pointsToGo, progress, score, secretMessage, showPlayActions, source;
    $secretMessage = Zepto("#secret-message");
    $source = Zepto("#source");
    $feedback = Zepto("#feedback");
    $feedbackMessage = Zepto("#feedback #message");
    $score = Zepto("#score");
    $muteMusic = Zepto("#mute-music-button");
    $muteSFX = Zepto("#mute-sfx-button");
    secretMessage = renderData.secretMessage, source = renderData.source, feedback = renderData.feedback, score = renderData.score, showPlayActions = renderData.showPlayActions, match = renderData.match, buyHints = renderData.buyHints, giveUp = renderData.giveUp, giveUpCost = renderData.giveUpCost;
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
    $source.hide();
    if (renderData.solved || renderData.gaveUp) {
      $source.show();
      $source.text(source || "Unknown");
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
    if (rawScope.showHelp) {
      Zepto("#dialog #cancel").show();
      Zepto("#dialog #confirm").hide();
      Zepto("#dialog").show();
      Zepto("#dialog h3").text("Help");
      Zepto("#dialog #message-content").html("<p>Stuck?  You must reveal the secret message one letter at a time, by filling in each word from its beginning.  Try going for shorter words first.  You can always use a hint or give up, but it will cost you.  Good luck!</p>\n<h3>Credits</h3>\n<ul>\n  <li>Game designed and built by <a target='_blank' href='http://codeperfectionist.com/about'>Jeff Schomay</a></li>\n  <li>Music by Jamison Rivera\n  <li>Owl character by <a target='_blank' href='http://sherony.com'>Sherony Lock</a></li>\n  <li>Sound effects by <a target='_blank' href='https://www.freesound.org/people/ddohler/sounds/9098/'>ddohler</a>,\n  <a target='_blank' href='https://www.freesound.org/people/Horn/sounds/9744/'>Horn</a>,\n  <a target='_blank' href='https://www.freesound.org/people/NHumphrey/sounds/204466/'>NHumphrey</a>, and\n  <a target='_blank' href='https://www.freesound.org/people/lonemonk/sounds/47048/'>lonemonk</a></li>\n  <li>Special thanks to: Mark, Marcus, Zia, David, Joey, Molly and Michele</li>\n</ul>");
      Zepto("#dialog #cancel").text("Keep playing");
    }
    Zepto("#user-info").show();
    Zepto("#progress").html("Bundle: Dad jokes<br>Total solved: " + userData.solvedQuotes);
    Zepto("#total-score").text(userData.totalScore);
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
      var userData;
      fadeInMusic();
      $('.popup').click(function() {
        var height, left, opts, shareType, top, url, width;
        width = 575;
        height = 400;
        left = ($(window).width() - width) / 2;
        top = ($(window).height() - height) / 2;
        url = this.href;
        opts = "status=1,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
        window.open(url, 'Share', opts);
        shareType = /twitter/.test(this.href) ? "tweet" : "facebook";
        return false;
      });
      updateFrame.currentState = states.start;
      updateFrame.store = {};
      userData = getUserData();
      updateFrame.userData = userData;
      updateFrame = updateFrame.bind(updateFrame);
      $(document).on("keydown", onKeyDown);
      $(".keyboard__key").on("click", onKeyboardKeyPress);
      $("#feedback #message").on("click", onPlayAgain);
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
      solvedQuotes: 0,
      solved: []
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

require.register("src/keyboard.coffee", function(exports, require, module) {
module.exports = '<div id="keyboard">\n  <div class="keyboard__row">\n    <div class="keyboard__key">q</div>\n    <div class="keyboard__key">w</div>\n    <div class="keyboard__key">e</div>\n    <div class="keyboard__key">r</div>\n    <div class="keyboard__key">t</div>\n    <div class="keyboard__key">y</div>\n    <div class="keyboard__key">u</div>\n    <div class="keyboard__key">i</div>\n    <div class="keyboard__key">o</div>\n    <div class="keyboard__key">p</div>\n  </div>\n  <div class="keyboard__row">\n    <div class="keyboard__key">a</div>\n    <div class="keyboard__key">s</div>\n    <div class="keyboard__key">d</div>\n    <div class="keyboard__key">f</div>\n    <div class="keyboard__key">g</div>\n    <div class="keyboard__key">h</div>\n    <div class="keyboard__key">j</div>\n    <div class="keyboard__key">k</div>\n    <div class="keyboard__key">l</div>\n  </div>\n  <div class="keyboard__row">\n    <div class="keyboard__key">z</div>\n    <div class="keyboard__key">x</div>\n    <div class="keyboard__key">c</div>\n    <div class="keyboard__key">v</div>\n    <div class="keyboard__key">b</div>\n    <div class="keyboard__key">n</div>\n    <div class="keyboard__key">m</div>\n  </div>\n</div>';

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

