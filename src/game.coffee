# quote bundles logic
{
  quoteBundles
  bundleNames
  getNextQuoteIndex
  updateProgressPerBundle
  noMoreQuotes
  bundleCompleted
} = require "./bundles"
persist = require "./persist"
track = require "./analytics"

module.exports = ->

  # constants
  CONSTANTS =
    startingHints: 3
    hintSetback: 40
    pointsForFreeHint: 200
    pointsPerLetter: 5

  # sound constants and utils (using howler.js)
  SOUNDS = {}
  VOLUMES =
    backgroundMusic: 1.0
    keyPressHit: 0.9

  playSound = (key) ->
    SOUNDS[key].play()
  getMusic = ->
    SOUNDS["backgroundMusic"]
  getSFX = ->
    R.omit ["backgroundMusic"], SOUNDS
  playMusic = ->
    getMusic().play()
  pauseMusic = ->
    getMusic().pause()
  playSFX = ->
    R.forEach ((sound) -> sound[1].volume(VOLUMES[sound[0]] or 1)), R.toPairs getSFX()
  pauseSFX = ->
    R.forEach ((sound) -> sound.volume(0)), R.values getSFX()
  fadeInMusic = ->
    getMusic().fadeIn VOLUMES.backgroundMusic, 2000

  decodeKeyStates =
    HIDDEN: 0
    REVEALED: 1
    SOLVED: 2
    HINTED: 3
    HINTEDFILLED: 4


  # utils
  isLetter = (char) ->
    /[a-z]/i.test char
  isLetterOrSpace = (char) ->
    /[a-z\s]/i.test char
  isSpace = (char) ->
    /[\s]/i.test char

  saveIndexes = R.mapIndexed (value, index) -> {index: index, status: value}

  getRandomElement = (arr) ->
    randomI = Math.floor(Math.random() * arr.length)
    randomElement = arr[randomI]
    newArray = R.remove randomI, 1, arr
    [randomElement, newArray]

  # Keep taking random elements from array until reaching the
  # desired amount.  Makes sure not to take the same element.
  getRandomElements = (arr, num = 1) ->
    if typeof num isnt "number"
      console.error "expected a number, got", num
      num = 1
    recur = (arr, acc) ->
      [randomElement, newArr] = getRandomElement arr
      acc.push randomElement
      if acc.length is num
        return acc
      else
        return recur newArr, acc
    recur arr, []


  # hint calculations
  getLastFreeHintScore = (totalScore) ->
    Math.floor(totalScore / CONSTANTS.pointsForFreeHint) * CONSTANTS.pointsForFreeHint

  getNextFreeHintScore = R.compose(R.add(CONSTANTS.pointsForFreeHint), getLastFreeHintScore)

  numFreeHintsEarned = (currentTotalScore, roundScore) ->
    previousTotalScore = currentTotalScore - roundScore
    previousTarget = getNextFreeHintScore previousTotalScore
    Math.ceil(Math.max(0, roundScore - (previousTarget - previousTotalScore)) / CONSTANTS.pointsForFreeHint)

  # game logic
  hideLetters = (char) ->
    if not isLetter char
      decodeKeyStates.SOLVED
    else
      decodeKeyStates.HIDDEN

  isHidden = R.eq decodeKeyStates.HIDDEN
  isSolved = R.eq decodeKeyStates.SOLVED

  # (encodedMessage, decodeKey) -> decodedMessage [{char, status}]
  decode = R.zipWith (secretChar, decodingStatus) ->
    char: secretChar
    status: decodingStatus

  sentanceToWords = (sentance) ->
    breakIntoWords = (acc, char, index) ->
      if isLetterOrSpace char
        if isSpace char
          acc.push []
        else
          charInfo =
            char: char
            index: index
          acc[acc.length - 1].push charInfo
      acc
    R.reduceIndexed breakIntoWords, [[]], sentance

  comboToString = R.compose R.join(""), R.map(R.prop "char")

  isUnsolvedGroup = R.curry (decodeKey, group) ->
    numSolvedInGroup = (acc, char) ->
      if decodeKey[char.index] is decodeKeyStates.SOLVED
        acc++
      acc
    (R.reduce numSolvedInGroup, 0, group) isnt group.length

  setIndexIfNotSolved = (value, arr, index) ->
    if typeof value is "function"
      value = value arr[index]
    arr[index] = value
    arr

  setIndexes = R.curry (value, arr, indexes) ->
    R.reduce R.partial(setIndexIfNotSolved, value), arr, indexes


  setIndexesToSolved = setIndexes decodeKeyStates.SOLVED

  setIndexesToRevealed = setIndexes (currentStatus) ->
    map = {}
    map[decodeKeyStates.HIDDEN] = decodeKeyStates.REVEALED
    map[decodeKeyStates.HINTED] = decodeKeyStates.HINTEDFILLED
    map[currentStatus] or currentStatus

  resetDecodeKey = (decodeKey) ->
    map = {}
    map[decodeKeyStates.SOLVED] = decodeKeyStates.SOLVED
    map[decodeKeyStates.HINTED] = decodeKeyStates.HINTED
    map[decodeKeyStates.HINTEDFILLED] = decodeKeyStates.HINTED

    resetTransform = (currentStatus) ->
      map[currentStatus] or decodeKeyStates.HIDDEN
    R.map resetTransform, decodeKey

  updateDecodeKey = (comboString, decodeKey, comboGroup) ->
    pattern = new RegExp "^" + comboString, "i"
    comboGroupString = comboToString comboGroup

    if pattern.test comboGroupString
      indexes = R.map(R.prop "index") R.take comboString.length, comboGroup
      if comboString.length is comboGroup.length
        return setIndexesToSolved decodeKey, indexes
      else
        return setIndexesToRevealed decodeKey, indexes
    else
      return decodeKey


  getAllMatches = (comboGroups, comboString, decodeKey) ->
    if comboString.length < 1
      return decodeKey
    decodeKey = R.reduce R.partial(updateDecodeKey, comboString), decodeKey, comboGroups
    return getAllMatches comboGroups, comboString.slice(1), decodeKey


  getValidComboStream = (comboString, comboGroups) ->
    if comboString.length < 1
      # no valid combo
      return []

    pattern = new RegExp "^" + comboString, "i"
    joinAndMatch = R.compose(R.match(pattern), comboToString)
    isValidCombo = R.any joinAndMatch, comboGroups

    if isValidCombo
      return comboString
    else
      # recurse with shorter and shorter combo streams
      getValidComboStream comboString.slice(1), comboGroups






  # GAME STATES
  states =
    start:
      onEnter: ->
        setStateClass "start"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "gameReady"
          ["loadingUser", scope, userData]
        else
          ["start", scope, userData]

      getRenderData: ->
        secretMessage: []
        feedback: "LOADING..."
        score: ""
        showPlayActions: false

    loadingUser:
      onEnter: (scope, userData) ->
        setStateClass "loadingUser"
        getUserData(userData)

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "userLoaded"
          return ["loading", scope, eventData]
        else
          return ["loadingUser", scope, userData]

      getRenderData: ->
        secretMessage: []
        feedback: "LOADING..."
        score: ""
        showPlayActions: false

    loading:
      onEnter: (scope, userData) ->
        setStateClass "loading"
        fetchQuote(userData)

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "quoteLoaded"
          giveHints = (indexes, decodeKey) ->
            setAsHinted = (i) ->
              decodeKey[i] = decodeKeyStates.HINTED
            R.forEach setAsHinted, indexes

          secretMessage = eventData.message
          source = eventData.source
          decodeKey = R.map hideLetters, secretMessage
          # help the user out on first levels
          if not userData.progressPerBundle
            # 1st round
            giveHints [10, 28, 38, 60], decodeKey
          else if userData.progressPerBundle[0] is 0
            # 2nd round
            giveHints [3, 4], decodeKey
          else if userData.progressPerBundle[0] is 1
            # 3rd round
            giveHints [17], decodeKey
          # initialize game data with secret message
          scope.secretMessage = secretMessage
          scope.source = source
          scope.currentBundleIndex = eventData.bundleIndex
          scope.currentQuoteIndex = eventData.quoteIndex
          scope.comboGroups = sentanceToWords secretMessage
          scope.decodeKey = decodeKey
          scope.comboString = ""
          scope.score = R.filter(isLetter, secretMessage).length * CONSTANTS.pointsPerLetter
          scope.moves = 0
          scope.hints = 0
          scope.lastCombo = null
          return ["play", scope, userData]
        else
          ["loading", scope, userData]

      getRenderData: (scope) ->
        secretMessage: []
        feedback: "LOADING..."
        score: ""
        showPlayActions: false

    play:
      onEnter: ->
        setStateClass "play"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "giveUp"

          return ["gaveUp", scope, userData]

        if trigger is "hint"
          if userData.hintsRemaining <= 0
            track "outOfHints"
            return ["outOfHints", scope, userData]

          track "useHint", scope, userData

          # get random 1/10th of remaining unsolved letters permanently filled in
          # cuts your score in half each time
          oneOrOneTenth = (items) -> Math.ceil items / 10
          indexedDecodeKey = saveIndexes scope.decodeKey
          hiddenChars = R.filter(R.compose(isHidden, R.prop "status")) indexedDecodeKey
          # if there are none left, just return
          if hiddenChars.length is 0
            return ["play", scope, userData]

          hintAllowance = oneOrOneTenth hiddenChars.length
          elementsToReveal = getRandomElements hiddenChars, hintAllowance
          indexesToReaveal = R.map R.prop("index"), elementsToReveal

          newScore = if scope.score - CONSTANTS.hintSetback < 0 then 0 else scope.score - CONSTANTS.hintSetback
          scope.decodeKey = setIndexes decodeKeyStates.HINTED, scope.decodeKey, indexesToReaveal
          scope.hints += 1
          scope.score = newScore

          userData.hintsRemaining -= 1

          saveUserData userData

          # play sound (one keyPressHit for each hinted char with slight delay)
          playKeySounds = (repeatTimes, playCount = 1) ->
            playSound "keyPressMiss"
            if playCount < repeatTimes
              setTimeout (-> playKeySounds repeatTimes, playCount + 1), 120
          playKeySounds hintAllowance


        if trigger is "keyPress"
          char = String.fromCharCode(eventData.keyCode).toLowerCase()

          # ignore non-letter inputs
          if isLetter char
            potentialCombo = scope.comboString + char
            existingSolved = resetDecodeKey scope.decodeKey

            unsolvedComboGroups = R.filter isUnsolvedGroup(scope.decodeKey), scope.comboGroups

            # update state
            scope.moves += 1
            scope.score = Math.max(0, scope.score - 1)
            scope.comboString = getValidComboStream potentialCombo, unsolvedComboGroups
            scope.decodeKey = getAllMatches scope.comboGroups, scope.comboString, existingSolved

            # if the previous keypress completed a combo, reset the last combo
            if scope.comboCompleted is true
              scope.lastCombo = char
            else
              scope.lastCombo = potentialCombo

            newUnsolvedComboGroups = R.filter isUnsolvedGroup(scope.decodeKey), scope.comboGroups
            scope.comboCompleted = unsolvedComboGroups.length > newUnsolvedComboGroups.length

            isMatch = !!scope.comboString.length
            wordComplete = scope.comboCompleted is true

            # sounds
            if wordComplete
              playSound "keyPressHit"
            else if isMatch
              playSound "keyPressHit"
            else
              playSound "keyPressMiss"


          # won?
          totalSolved = R.length(R.filter(isSolved) scope.decodeKey)
          if totalSolved is scope.secretMessage.length
            playSound "solved"


            userData.totalScore += scope.score
            userData.hintsRemaining += numFreeHintsEarned userData.totalScore, scope.score

            userData.lastSolvedBundleIndex = scope.currentBundleIndex
            userData.lastSolvedQuoteIndex = scope.currentQuoteIndex

            # save furthest progress per bundle in case user jumps to
            # an earlier quote and wants to jump back to latest progress
            userData.progressPerBundle = updateProgressPerBundle userData.progressPerBundle, scope.currentBundleIndex, scope.currentQuoteIndex


            saveUserData userData

            return ["solved", scope, userData]

        ["play", scope, userData]

      getRenderData: (scope) ->
        # get progress of quote
        removeNonLetters = (val, i) ->
          isLetter scope.secretMessage[i]
        statusOfJustLetters = R.filterIndexed removeNonLetters, scope.decodeKey

        isFilled = (status) ->
          status in [decodeKeyStates.REVEALED, decodeKeyStates.SOLVED, decodeKeyStates.HINTEDFILLED]
        numberFilled = R.length R.filter isFilled, statusOfJustLetters

        progress = numberFilled / statusOfJustLetters.length

        comboString = if scope.comboString.length then scope.comboString else null
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboString or scope.lastCombo  or "Type letters to begin revealing the hidden message."
        match: if scope.lastCombo then !!scope.comboString.length > 0 else null
        score: scope.score
        showPlayActions: true
        progress: progress

    gaveUp:
      onEnter: ->
        setStateClass "gaveUp"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "confirm"

          track "giveUp", scope, userData

          playSound "giveUp"

          numUnsolved = R.length R.filter(R.compose(R.not, isSolved)) scope.decodeKey

          userData.lastSolvedBundleIndex = scope.currentBundleIndex
          userData.lastSolvedQuoteIndex = scope.currentQuoteIndex

          userData.totalScore -= numUnsolved * CONSTANTS.pointsPerLetter

          # save furthest progress per bundle in case user jumps to
          # an earlier quote and wants to jump back to latest progress
          userData.progressPerBundle = updateProgressPerBundle userData.progressPerBundle, scope.currentBundleIndex, scope.currentQuoteIndex

          saveUserData userData

          return ["confirmedGiveUp", scope, userData]

        else if trigger is "cancel"
          return ["play", scope, userData]

        else
          return ["gaveUp", scope, userData]

      getRenderData: (scope) ->
        cost = CONSTANTS.pointsPerLetter * R.length R.filter(R.compose(R.not, isSolved)) scope.decodeKey
        # same as "play" render data, plus additional give up flags
        comboString = if scope.comboString.length then scope.comboString else null
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboString or scope.lastCombo  or "Type letter combos to reveal the hidden message."
        match: if scope.lastCombo then !!scope.comboString.length > 0 else null
        score: scope.score
        showPlayActions: true
        buyHints: true
        giveUp: true
        giveUpCost: cost


    confirmedGiveUp:
      onEnter: ->
        setStateClass "confirmedGiveUp"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "keyPress" and eventData.keyCode is 32 # space bar

          # reset everything
          scope.secretMessage = undefined
          scope.source = undefined
          scope.comboGroups = undefined
          scope.decodeKey = undefined
          scope.comboString = undefined
          scope.score = undefined
          scope.moves = undefined
          scope.hints = undefined
          scope.lastCombo = undefined

          if noMoreQuotes(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)
            return ["noMoreQuotes", scope, userData]
          else if bundleCompleted(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)
            return ["bundleCompleted", scope, userData]
          else
            return ["loading", scope, userData]

        else
          return ["confirmedGiveUp", scope, userData]

      getRenderData: (scope) ->
        secretMessage: decode(scope.secretMessage, R.map( R.always(decodeKeyStates.SOLVED), scope.decodeKey))
        source: scope.source
        gaveUp: true
        feedback: "You gave up!<br>Press 'Space bar' to play again."
        score: 0
        showPlayActions: false
        showLogInLink: not persist.getUserId()?

    solved:
      onEnter: ->
        setStateClass "solved"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "keyPress" and eventData.keyCode is 32 # space bar
          # reset everything
          scope.secretMessage = undefined
          scope.source = undefined
          scope.comboGroups = undefined
          scope.decodeKey = undefined
          scope.comboString = undefined
          scope.score = undefined
          scope.moves = undefined
          scope.hints = undefined
          scope.lastCombo = undefined

          if noMoreQuotes(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)
            return ["noMoreQuotes", scope, userData]
          else if bundleCompleted(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)
            return ["bundleCompleted", scope, userData]
          else
            return ["loading", scope, userData]

        else
          return ["solved", scope, userData]

      getRenderData: (scope) ->
        hints = if scope.hints > 1 then scope.hints else "no"
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        source: scope.source
        feedback:  "SOLVED in #{scope.moves} moves!<br>Press 'Space bar' to play again."
        score: scope.score
        showPlayActions: false
        solved: true
        showLogInLink: not persist.getUserId()?

    outOfHints:
      onEnter: ->
        setStateClass "outOfHints"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "confirm"
          return ["play", scope, userData]

        return ["outOfHints", scope, userData]

      getRenderData: (scope) ->
        # same as "play" render data, plus additional buyHints flag
        comboString = if scope.comboString.length then scope.comboString else null
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboString or scope.lastCombo  or "Type letter combos to reveal the hidden message."
        match: if scope.lastCombo then !!scope.comboString.length > 0 else null
        score: scope.score
        showPlayActions: true
        buyHints: true


    noMoreQuotes:
      onEnter: ->
        setStateClass "noMoreQuotes"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "confirm"
          return ["loading", scope, userData]
        else
          return ["noMoreQuotes", scope, userData]

      getRenderData: (scope) ->
        secretMessage: ""
        feedback: ""
        showPlayActions: false
        noMoreQuotes: true


    bundleCompleted:
      onEnter: ->
        setStateClass "bundleCompleted"

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "confirm"
          return ["loading", scope, userData]
        else
          return ["bundleCompleted", scope, userData]

      getRenderData: (scope) ->
        secretMessage: ""
        feedback: ""
        showPlayActions: false
        bundleCompleted: true


  # MAIN LOOP
  # Called on each game event through updateFrame.
  # Runs the current game state through a state machine.
  #
  # The active state handles the triggering event, then states
  # are transitioned depending on the outcome, and the resulting
  # active state renders the data.
  frame = (seed, trigger, eventData) ->
    [newState, newScope, newUserData] = seed.state.onEvent eventData, seed.scope, trigger, seed.userData

    if states[newState] isnt seed.state
      states[newState].onEnter newScope, newUserData

    render states[newState].getRenderData(newScope), newScope, newUserData

    {state: states[newState], scope: newScope, userData: newUserData}



  # This is a wrapper that holds state so that the rest of the
  # code can be completely pure.
  # In an FRP style, this could be done by folding over events instead.
  # It is called by all game events with the event trigger and event data.
  updateFrame = (trigger, data) ->
    self = updateFrame
    # "before all" - a chance to change the store and state
    [self.store, self.currentState, self.userData] = onFrameEnter self.store, self.currentState, trigger, data, self.userData
    {state, scope, userData} = frame {state: self.currentState, scope: self.store, userData: self.userData}, trigger, data
    self.currentState = state
    self.store = scope
    self.userData = userData

  updateFrame.userData = {}
  updateFrame.store = {}
  updateFrame.currentState = states.start


  # code to run on every frame regardless of which state is active
  onFrameEnter = (scope, state, trigger, eventData, userData) ->
    if trigger is "toggleMuteMusic"
      if scope.musicIsPaused
        playMusic()
      else
        pauseMusic()
      scope.musicIsPaused = !scope.musicIsPaused

    if trigger is "toggleMuteSFX"
      if scope.SFXIsPaused
        playSFX()
      else
        pauseSFX()
      scope.SFXIsPaused = !scope.SFXIsPaused

    if trigger is "getHelp"
      scope.showHelp = !scope.showHelp

    # note: when in a state with a dialog, pressing the button on
    # the get help dialog will also affect that state, so use
    # cancel instead of confirm to avoid triggering anything
    if trigger is "cancel" and scope.showHelp
      scope.showHelp = !scope.showHelp

    if trigger is "loggedIn"
      state = states.loadingUser
      getUserData(userData)

    [scope, state, userData]




  # binding game event streams

  fetchQuote = (userData) ->
    nextQuote = getNextQuoteIndex userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex
    message = quoteBundles[nextQuote.bundleIndex][nextQuote.quoteIndex].quote
    source = quoteBundles[nextQuote.bundleIndex][nextQuote.quoteIndex].source
    # need to make this async to go through the state machine properly
    setTimeout ->
      updateFrame "quoteLoaded",
        message: message
        source: source
        bundleIndex: nextQuote.bundleIndex
        quoteIndex: nextQuote.quoteIndex
    , 0

  onKeyDown = (e) ->
    if e.keyCode in [8, 32, 9, 37, 38, 39, 40] #backspace, space, tab, arrow keys
      # don't want the browser to go back or scroll (if not full screen)
      # or tab to next link
      e.preventDefault()
    updateFrame "keyPress", e

  onKeyboardKeyPress = (e) ->
    e.preventDefault()
    updateFrame "keyPress", {keyCode: (e.target.innerHTML.charCodeAt(0) - 32)}

  onPlayAgain = (e) ->
    e.preventDefault()
    #clicking on the "play again" text simulates a space keypress to toggle play again
    updateFrame "keyPress", {keyCode: 32}

  onGiveUp = (e) ->
    e.preventDefault()
    updateFrame "giveUp", null

  onHint = (e) ->
    e.preventDefault()
    updateFrame "hint", null

  onMuteMusic = (e) ->
    e.preventDefault()
    updateFrame "toggleMuteMusic", null

  onMuteSFX = (e) ->
    e.preventDefault()
    updateFrame "toggleMuteSFX", null

  onHelp = (e) ->
    e.preventDefault()
    updateFrame "getHelp", null

  onCancel = (e) ->
    e.preventDefault()
    updateFrame "cancel", null

  onConfirm = (e) ->
    e.preventDefault()
    updateFrame "confirm", null

  onShare = (e) ->
    hiddenQuote = updateFrame.store.secretMessage.replace(/[a-zA-Z]/ig, '_')
    bundleName = bundleNames[updateFrame.store.currentBundleIndex ]
    quoteNumber = updateFrame.store.currentQuoteIndex + 1
    moves = updateFrame.store.moves
    FB.ui
      method: 'feed'
      caption: "#{bundleName} bundle ##{quoteNumber}"
      description: "\"#{hiddenQuote}\""
      picture: 'http://jschomay.github.io/hidden-message-game/assets/owl-happy.png'
      link: "https://apps.facebook.com/quote-decoder/?fb_source=feed"
      name: "I just decoded this quote in #{moves} moves, can you?"
    , -> track 'share'

  onInvite = (e) =>
    FB.ui
      method: 'apprequests'
      message: 'I\'ve been playing this word puzzle game and think it\'s fun.  You should try it out.'
    , -> track 'invite'

  onLogin = (e) ->
    FB.login (response) ->
      persist.setUserId response
      updateFrame "loggedIn"


  # drawing

  buildSecretMessage = (secretMessage) ->
    statusMap = R.invertObj decodeKeyStates

    buildMarkup = (acc, letter) ->
      if isSpace letter.char
        newLine = ""
        if /[\n\r]/.test letter.char
          newLine = "<br>"
        acc + "</span>#{newLine}<span class='word'>"
      else
        text = letter.char
        if letter.status is decodeKeyStates.HIDDEN
          text = " "
        status = statusMap[letter.status].toLowerCase()
        acc + "<span class='letter #{status}'>#{text}</span>"

    (R.reduce buildMarkup, "<span class='word'>", secretMessage) + "</span>"

  render = (renderData, rawScope, userData) ->
    $secretMessage = Zepto("#secret-message")
    $source = Zepto("#source")
    $feedback = Zepto("#feedback")
    $feedbackMessage = Zepto("#feedback #message")
    $score = Zepto("#score")
    $muteMusic = Zepto("#mute-music-button")
    $muteSFX = Zepto("#mute-sfx-button")
    {secretMessage, source, feedback, score, showPlayActions, match, buyHints, giveUp, giveUpCost} = renderData

    $secretMessage.html buildSecretMessage secretMessage
    $feedbackMessage.html feedback # make sure only known or escaped strings go through here!
    $score.text score
    $feedback.removeClass "no-match"
    $feedback.removeClass "match"
    if match is true
      $feedback.addClass "match"
    if match is false
      $feedback.addClass "no-match"

    $source.hide()
    if renderData.solved or renderData.gaveUp
      $source.show()
      $source.text source or "Unknown"

    # renderData.showLogInLink only set at end of round if isGuest
    if renderData.showLogInLink
      Zepto("#feedback .login-link").show()
    else
      Zepto("#feedback .login-link").hide()

    # social
    if renderData.solved
      Zepto("#social").show()
    else
      Zepto("#social").hide()

    # hint and give up buttons
    if showPlayActions
      Zepto("#play-actions").show()
    else
      Zepto("#play-actions").hide()

    Zepto("#hint-button .hints-remaining").text userData.hintsRemaining

    # sound state
    $muteMusic.removeClass "muted"
    $muteSFX.removeClass "muted"
    if rawScope.musicIsPaused
      $muteMusic.addClass "muted"
    if rawScope.SFXIsPaused
      $muteSFX.addClass "muted"

    # dialog box
    Zepto("#dialog").hide()

    # buy hints dialog
    if buyHints
      Zepto("#dialog #cancel").hide()
      Zepto("#dialog #confirm").show()
      nextHint = getNextFreeHintScore userData.totalScore
      pointsToGo = getNextFreeHintScore(userData.totalScore) - userData.totalScore
      Zepto("#dialog").show()
      Zepto("#dialog h3").text "You are out of hints!"
      Zepto("#dialog #message-content").html "Next free hint awarded at #{nextHint} points (#{pointsToGo} points to go)"
      Zepto("#dialog #confirm").text "OK"

    # give up dialog
    if giveUp
      Zepto("#dialog #cancel").show()
      Zepto("#dialog #confirm").show()
      Zepto("#dialog").show()
      Zepto("#dialog h3").text "Are you sure you want to give up?"
      Zepto("#dialog #message-content").html "You will lose #{giveUpCost} points for the remaining unsolved words."
      Zepto("#dialog #confirm").text "Yes, give up"
      Zepto("#dialog #cancel").text "No, I'll keep trying"

    # no more quotes dialog
    if renderData.noMoreQuotes
      Zepto("#dialog #cancel").hide()
      Zepto("#dialog #confirm").show()
      Zepto("#dialog").show()
      Zepto("#dialog h3").text "You solved all of the quotes!  You win!"
      Zepto("#dialog #message-content").html "<p>Thank you for playing.</p><p>If you enjoyed this game please tell your friends.  I will continue to add new features and quote bundles, so come back later to play more.  :)</p>"
      Zepto("#dialog #confirm").text "Play again?"

    # bundle completed dialog
    bundleName = bundleNames[rawScope.currentBundleIndex or 0]
    nextBundleName = bundleNames[(rawScope.currentBundleIndex or 0) + 1]
    if renderData.bundleCompleted
      Zepto("#dialog #cancel").hide()
      Zepto("#dialog #confirm").show()
      Zepto("#dialog").show()
      Zepto("#dialog h3").text "Congratulations, you finished the \"#{bundleName}\" bundle!"
      Zepto("#dialog #message-content").html "You've unlocked the \"#{nextBundleName}\" bundle."
      Zepto("#dialog #confirm").text "Play next bundle"

    # get help dialog
    if rawScope.showHelp
      Zepto("#dialog #cancel").show()
      Zepto("#dialog #confirm").hide()
      Zepto("#dialog").show()
      Zepto("#dialog h3").text "Help"
      Zepto("#dialog #message-content").html """
        <p>Stuck?  You must reveal the secret message one letter at a time, from the start of each word.  Solving each word will give you a clue to which letters other words start with.  Try going for shorter word first.  The words stay solved only when you complete them.  You can always use a hint or give up, but it will cost you.  Good luck!</p>
        <h3>Credits</h3>
        <ul>
          <li>Game designed and built by <a target='_blank' href='http://codeperfectionist.com/about'>Jeff Schomay</a></li>
          <li>Music by Jamison Rivera
          <li>Owl character by <a target='_blank' href='http://sherony.com'>Sherony Lock</a></li>
          <li>Sound effects by <a target='_blank' href='https://www.freesound.org/people/ddohler/sounds/9098/'>ddohler</a>,
          <a target='_blank' href='https://www.freesound.org/people/Horn/sounds/9744/'>Horn</a>,
          <a target='_blank' href='https://www.freesound.org/people/NHumphrey/sounds/204466/'>NHumphrey</a>, and
          <a target='_blank' href='https://www.freesound.org/people/lonemonk/sounds/47048/'>lonemonk</a></li>
          <li>Special thanks to: Mark, Marcus, Zia, David, Joey, Molly and Michele</li>
        </ul>
        """
      Zepto("#dialog #cancel").text "Keep playing"

    # user info
    num = (rawScope.currentQuoteIndex or 0) + 1
    bundleName = bundleNames[rawScope.currentBundleIndex or 0]
    total = quoteBundles[rawScope.currentBundleIndex or 0].length
    Zepto("#user-info").show()
    Zepto("#progress").html "Bundle: \"#{bundleName}\"<br>##{num} out of #{total}"
    Zepto("#total-score").text userData.totalScore
    if not persist.getUserId()?
      Zepto("#user-info .login-link").show()
    else
      Zepto("#user-info .login-link").hide()

    # owl position
    owlWidth = Zepto("#owl").width()
    gutter = 200
    path = window.innerWidth - gutter - owlWidth
    progress = renderData.progress or 0
    offset = path * progress + gutter / 2
    hopHeight = 15
    moveOwl = (x, y) ->
      Zepto("#owl").css
        '-webkit-transform': "translate3d(#{x}px, -#{y}px, 0)"
        '-ms-transform': "translate3d(#{x}px, -#{y}px, 0)"
        'transform': "translate3d(#{x}px, -#{y}px, 0)"
    if renderData.solved
      # jump on top of score
      moveOwl (window.innerWidth - (owlWidth + 10)), 70
    else
      moveOwl offset, hopHeight
    setTimeout (-> if not renderData.solved then moveOwl offset, 0), 70



  # load sounds
  numSoundsLoaded = (soundsLoaded) ->
    R.length R.filter R.compose(R.identity, R.prop("_loaded")), R.values soundsLoaded

  updateLoadProgress = (soundsToLoad, soundsLoaded) ->
    if numSoundsLoaded(soundsLoaded) is soundsToLoad
      startGame()

  loadSounds = (sounds) ->
    totalSounds = R.length R.keys sounds
    formats = [".ogg", ".m4a", ".wav"]
    getFormats = (filePath) ->
      R.map R.concat(filePath), formats

    initializeSounds = (acc, sound) ->
      getConfig = ->
        if typeof sound[1] is "string"
          urls: getFormats sound[1]
          onload: -> updateLoadProgress totalSounds, acc
        else
          R.merge sound[1][1],
            urls: getFormats sound[1][0]
            onload: -> updateLoadProgress totalSounds, acc



      acc[sound[0]] = new Howl getConfig()
      acc

    R.reduce initializeSounds, SOUNDS, R.toPairs sounds

  loadImages = (images) ->
    loadImage = (path) ->
      img = new Image()
      img.src = path
      img

    loadAssets = R.map loadImage
    loadAssets images

  preload = ->
    # images will load quicker than sounds, so I wont bother with a
    # callback when all are loaded
    # Note that I need to hold a reference to the img objects so that
    # the browser doesn't drop them from memory
    keepInMemory = loadImages [
      "assets/owl-normal.png"
      "assets/owl-happy.png"
      "assets/owl-sad.png"
      "assets/owl-blink.png"
    ]

    loadSounds
      keyPressMiss: "assets/key-press-miss"
      keyPressHit: ["assets/key-press-hit", volume: VOLUMES.keyPressHit]
      giveUp: "assets/give-up"
      solved: "assets/solved"
      backgroundMusic: ["assets/background-music-long",
        volume: VOLUMES.backgroundMusic,
        onend: ->
          # using this instead of loop to hopefully avoid a bug in howler
          this.play()
      ]

  setStateClass = (stateName) ->
    Zepto("body").removeClass()
    Zepto("body").addClass stateName

  # the owl blinking happens on a setTimeout loop outside of
  # the main state machine and rendering function, so I'm
  # putting it here even though it seems a bit out of place
  startOwlBlink = ->
    openCloseEyes = ->
      Zepto("#owl").toggleClass "blink"

    blink = ->
      openCloseEyes()
      setTimeout(openCloseEyes, 200)

      # queue next blink
      setTimeout(blink, 8000 + ((Math.random() - 0.5) * 5000))

    # start two syncopated loops (after 5 seconds) for a nice random
    # rhythm of blinking, including a "double blink" effect
    setTimeout blink, 5000
    setTimeout blink, 7000

  startGame = ->
    # make sure document is loaded before starting (it should be by now)
    Zepto ($) ->
      fadeInMusic()

      startOwlBlink()

      # bind inputs
      $(document).on "keydown", onKeyDown
      $(".keyboard__key").on "click", onKeyboardKeyPress
      $("#feedback #message").on "click", onPlayAgain
      $("#give-up-button").on "click", onGiveUp
      $("#hint-button").on "click", onHint
      $("#mute-music-button").on "click", onMuteMusic
      $("#mute-sfx-button").on "click", onMuteSFX
      $("#help-button").on "click", onHelp
      $("#cancel").on "click", onCancel
      $("#confirm").on "click", onConfirm
      $("#share").on "click", onShare
      $("#invite").on "click", onInvite
      $(".login-link").on "click", onLogin

      # start the game
      persist.waitForUserStatus().then ->
        updateFrame "gameReady"

  getUserData = (progress) ->
    currentPlayerDefaults =
      hintsRemaining: CONSTANTS.startingHints
      totalScore: 0
      lastSolvedBundleIndex: undefined
      lastSolvedQuoteIndex: undefined
      progressPerBundle: undefined

    hasProgress = R.values(progress).length
    userData = if hasProgress then progress else currentPlayerDefaults

    persist.load().then (currentPlayer) ->
      if not currentPlayer
        saveUserData userData
        updateFrame "userLoaded", userData
      else
        playerData = currentPlayer.toJSON()
        plays = playerData.plays or 0
        playerData.plays = plays + 1
        # update play count
        saveUserData playerData

        # merge to update persisted data schema
        updateFrame "userLoaded", R.merge userData, playerData
    , (error) ->
      console.error "Error loading user data:", error
      updateFrame "userLoaded", userData

  saveUserData = (userData) ->
    persist.save userData


  # kick off game
  preload()
