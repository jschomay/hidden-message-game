quoteBundles = [
  require "./bundles/starter"
]

getNextQuoteIndex = (currentBundleIndex, currentQuoteIndex) ->
  if currentQuoteIndex is quoteBundles[currentBundleIndex].length - 1
    # start next bundle (or start from very begining if no next bundle)
    quoteIndex: 0
    bundleIndex: if quoteBundles[currentBundleIndex + 1] then currentBundleIndex + 1 else 0
  else
    quoteIndex: currentQuoteIndex + 1
    bundleIndex: currentBundleIndex

module.exports = ->

  # constants
  CONSTANTS =
    startingHints: 5
    hintSetback: 20
    pointsForFreeHint: 150
    pointsPerLetter: 5

  # sound constants and utils (using howler.js)
  SOUNDS = {}
  VOLUMES =
    backgroundMusic: 0.1
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
  fadeDownMusic = ->
    volume = getMusic()._volume
    getMusic().fade volume, VOLUMES.backgroundMusic * 1 / 10, 700
  fadeUpMusic = ->
    volume = getMusic()._volume
    getMusic().fade volume, VOLUMES.backgroundMusic, 1500

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
    loading:
      onEnter: (scope, userData) ->
        fadeUpMusic()
        fetchQuote(userData)

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "quoteLoaded"
          secretMessage = eventData
          # initialize game data with secret message
          scope.secretMessage = secretMessage
          scope.comboGroups = sentanceToWords secretMessage
          scope.decodeKey = R.map hideLetters, secretMessage
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
        fadeUpMusic()
      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "giveUp"

          return ["gaveUp", scope, userData]

        if trigger is "hint"
          if userData.hintsRemaining <= 0
            return ["outOfHints", scope, userData]

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

          scope.decodeKey = setIndexes decodeKeyStates.HINTED, scope.decodeKey, indexesToReaveal
          scope.hints += 1
          scope.score -= CONSTANTS.hintSetback

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


            userData.totalSolved += 1
            userData.totalScore += scope.score
            userData.hintsRemaining += numFreeHintsEarned userData.totalScore, scope.score
            nextQuote = getNextQuoteIndex(userData.currentBundleIndex, userData. currentQuoteIndex)
            userData.currentBundleIndex = nextQuote.bundleIndex
            userData.currentQuoteIndex = nextQuote.quoteIndex

            saveUserData userData

            return ["solved", scope, userData]

        ["play", scope, userData]

      getRenderData: (scope) ->
        comboString = if scope.comboString.length then scope.comboString else null
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboString or scope.lastCombo  or "Type letter combos to reveal the hidden message."
        match: if scope.lastCombo then !!scope.comboString.length > 0 else null
        score: scope.score
        showPlayActions: true

    gaveUp:
      onEnter: ->
        fadeDownMusic()

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "confirmGiveUp"
          playSound "giveUp"

          numUnsolved = R.length R.filter(R.compose(R.not, isSolved)) scope.decodeKey
          nextQuote = getNextQuoteIndex(userData.currentBundleIndex, userData. currentQuoteIndex)
          userData.currentBundleIndex = nextQuote.bundleIndex
          userData.currentQuoteIndex = nextQuote.quoteIndex
          userData.totalScore -= numUnsolved * CONSTANTS.pointsPerLetter
          userData.totalSkipped += 1

          saveUserData userData

          return ["confirmedGiveUp", scope, userData]

        else if trigger is "cancelGiveUp"
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

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "keyPress" and eventData.keyCode is 32 # space bar

          # reset everything
          scope.secretMessage = undefined
          scope.comboGroups = undefined
          scope.decodeKey = undefined
          scope.comboString = undefined
          scope.score = undefined
          scope.moves = undefined
          scope.hints = undefined
          scope.lastCombo = undefined

          return ["loading", scope, userData]

        else
          return ["confirmedGiveUp", scope, userData]

      getRenderData: (scope) ->
        secretMessage: decode(scope.secretMessage, R.map( R.always(decodeKeyStates.SOLVED), scope.decodeKey))
        feedback: "You gave up!<br>Press 'Space bar' to play again."
        score: 0
        showPlayActions: false

    solved:
      onEnter: ->
        fadeDownMusic()

      onEvent: (eventData, scope, trigger, userData) ->
        if eventData.keyCode is 32 # space bar
          # reset everything
          scope.secretMessage = undefined
          scope.comboGroups = undefined
          scope.decodeKey = undefined
          scope.comboString = undefined
          scope.score = undefined
          scope.moves = undefined
          scope.hints = undefined
          scope.lastCombo = undefined

          return ["loading", scope, userData]

        else
          return ["solved", scope, userData]

      getRenderData: (scope) ->
        hints = if scope.hints > 1 then scope.hints else "no"
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback:  "SOLVED in #{scope.moves} moves (with #{hints} hints)!<br>Press 'Space bar' to play again."
        score: scope.score
        showPlayActions: false

    outOfHints:
      onEnter: ->
        fadeDownMusic()

      onEvent: (eventData, scope, trigger, userData) ->
        if trigger is "cancelBuyHints"
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
    @store = onFrameEnter @store, trigger, data
    {state, scope, userData} = frame {state: @currentState, scope: @store, userData: @userData}, trigger, data
    @currentState = state
    @store = scope
    @userData = userData


  # code to run on every frame regardless of which state is active
  onFrameEnter = (scope, trigger, eventData) ->
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
    scope




  # binding game event streams

  fetchQuote = ({currentBundleIndex, currentQuoteIndex}) ->
    message = quoteBundles[currentBundleIndex][currentQuoteIndex].quote
    # need to make this async to go through the state machine properly
    setTimeout ->
      updateFrame "quoteLoaded", message
    , 0

  onKeyDown = (e) ->
    if e.keyCode is 8 #backspace
      # don't want the browser to go back
      e.preventDefault()
    updateFrame "keyPress", e

  onGiveUp = (e) ->
    e.preventDefault()
    updateFrame "giveUp", null

  onConfirmGiveUp = (e) ->
    e.preventDefault()
    updateFrame "confirmGiveUp", null

  onCancelGiveUp = (e) ->
    e.preventDefault()
    updateFrame "cancelGiveUp", null

  onHint = (e) ->
    e.preventDefault()
    updateFrame "hint", null

  onMuteMusic = (e) ->
    e.preventDefault()
    updateFrame "toggleMuteMusic", null

  onMuteSFX = (e) ->
    e.preventDefault()
    updateFrame "toggleMuteSFX", null

  onCancelBuyHints = (e) ->
    e.preventDefault()
    updateFrame "cancelBuyHints", null


  # drawing

  buildSecredMessage = (secretMessage) ->
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
    $feedback = Zepto("#feedback")
    $score = Zepto("#score")
    $muteMusic = Zepto("#mute-music-button")
    $muteSFX = Zepto("#mute-sfx-button")
    {secretMessage, feedback, score, showPlayActions, match, buyHints, giveUp, giveUpCost} = renderData

    $secretMessage.html buildSecredMessage secretMessage
    $feedback.html feedback # make sure only known or escaped strings go through here!
    $score.text score
    $feedback.removeClass "no-match"
    $feedback.removeClass "match"
    if match is true
      $feedback.addClass "match"
    if match is false
      $feedback.addClass "no-match"

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

    # buy hints dialog
    # hint and give up buttons
    if buyHints
      Zepto("#buy-hints").show()
      Zepto("#next-free-hint").text getNextFreeHintScore userData.totalScore
      Zepto("#points-to-go").text getNextFreeHintScore(userData.totalScore) - userData.totalScore
    else
      Zepto("#buy-hints").hide()

    # give up dialog
    if giveUp
      Zepto("#give-up-dialog").show()
      Zepto("#give-up-cost").text giveUpCost
    else
      Zepto("#give-up-dialog").hide()

    # user info
    Zepto("#user-info").show()
    Zepto("#total-solved").text userData.totalSolved
    Zepto("#total-skipped").text userData.totalSkipped
    Zepto("#total-score").text userData.totalScore


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

  preload = ->
    loadSounds
      keyPressMiss: "assets/key-press-miss"
      keyPressHit: ["assets/key-press-hit", volume: VOLUMES.keyPressHit]
      giveUp: "assets/give-up"
      solved: "assets/solved"
      backgroundMusic: ["assets/background-music",
        volume: VOLUMES.backgroundMusic,
        onend: ->
          # using this instead of loop to hopefully avoid a bug in howler
          this.play()
      ]

  startGame = ->
    # make sure document is loaded before starting (it should be by now)
    Zepto ($) ->
      fadeInMusic()

      # initialize main loop with starting state
      updateFrame.currentState = states.loading
      updateFrame.store = {}
      userData = getUserData()
      updateFrame.userData = userData
      updateFrame = updateFrame.bind updateFrame

      # bind inputs
      $(document).on "keydown", onKeyDown
      $("#give-up-button").on "click", onGiveUp
      $("#cancel-give-up").on "click", onCancelGiveUp
      $("#confirm-give-up").on "click", onConfirmGiveUp
      $("#hint-button").on "click", onHint
      $("#mute-music-button").on "click", onMuteMusic
      $("#mute-sfx-button").on "click", onMuteSFX
      $("#cancel-buy-hints").on "click", onCancelBuyHints

      fetchQuote(userData)

  getUserData = ->
    currentPlayerDefaults =
      hintsRemaining: CONSTANTS.startingHints
      totalScore: 0
      totalSolved: 0
      totalSkipped: 0
      currentBundleIndex: 0
      currentQuoteIndex: 0

    currentPlayer = JSON.parse localStorage.getItem "currentPlayer"

    if not currentPlayer
      saveUserData currentPlayerDefaults

    # merge to update persisted data schema
    R.merge currentPlayerDefaults, currentPlayer

  saveUserData = (userData) ->
    localStorage.setItem "currentPlayer", JSON.stringify userData


  # kick off game
  preload()
