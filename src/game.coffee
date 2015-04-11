module.exports = ->

  quoteApiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.iheartquotes.com%2Fapi%2Fv1%2Frandom%3Fmax_characters%3D75%26format%3Djson'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"

  SOUNDS = {}
  playSound = (key) ->
    SOUNDS[key].play()

  decodeKeyStates =
    HIDDEN: 0
    REVEALED: 1
    SOLVED: 2
    HINTED: 3
    HINTEDFILLED: 4

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
      onEnter: ->
        fetchQuote()

      onEvent: (eventData, scope, trigger) ->
        if trigger is "quoteLoaded"
          secretMessage = eventData
          # initialize game data with secret message
          scope.secretMessage = secretMessage
          scope.comboGroups = sentanceToWords secretMessage
          scope.decodeKey = R.map hideLetters, secretMessage
          scope.comboString = ""
          scope.score = R.filter(isLetter, secretMessage).length * 5
          scope.moves = 0
          scope.hints = 0
          scope.lastCombo = null
          return ["play", scope]
        else
          ["loading", scope]

      getRenderData: (scope) ->
        secretMessage: ""
        feedback: "LOADING..."
        score: ""
        showPlayActions: false

    play:
      onEnter: ->
      onEvent: (eventData, scope, trigger) ->
        if trigger is "giveUp"
          return ["gaveUp", scope]

        if trigger is "hint"
          # get random 1/10th of remaining unsolved letters permanently filled in
          # cuts your score in half each time
          oneOrOneTenth = (items) -> Math.ceil items / 10
          indexedDecodeKey = saveIndexes scope.decodeKey
          hiddenChars = R.filter(R.compose(isHidden, R.prop "status")) indexedDecodeKey
          # if there are none left, just return
          if hiddenChars.length is 0
            return ["play", scope]

          hintAllowance = oneOrOneTenth hiddenChars.length
          elementsToReveal = getRandomElements hiddenChars, hintAllowance
          indexesToReaveal = R.map R.prop("index"), elementsToReveal

          scope.decodeKey = setIndexes decodeKeyStates.HINTED, scope.decodeKey, indexesToReaveal
          scope.hints += 1
          scope.score = Math.floor scope.score / 2


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
            scope.lastCombo = potentialCombo

            # reveal or miss?
            if scope.comboString.length
              playSound "keyPressHit"
            else
              playSound "keyPressMiss"

            # if the last keypress completed a combo, reset the last combo
            if scope.comboCompleted is true
              scope.lastCombo = char

            newUnsolvedComboGroups = R.filter isUnsolvedGroup(scope.decodeKey), scope.comboGroups
            scope.comboCompleted = unsolvedComboGroups.length > newUnsolvedComboGroups.length

          # won?
          totalSolved = R.length(R.filter(isSolved) scope.decodeKey)
          if totalSolved is scope.secretMessage.length
            return ["solved", scope]

        ["play", scope]

      getRenderData: (scope) ->
        comboString = if scope.comboString.length then scope.comboString else null
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboString or scope.lastCombo  or "Type letter combos to reveal the hidden message."
        match: if scope.lastCombo then !!scope.comboString.length > 0 else null
        score: scope.score
        showPlayActions: true

    gaveUp:
      onEnter: ->
      onEvent: (eventData, scope) ->
        # reset everything
        scope.secretMessage = undefined
        scope.comboGroups = undefined
        scope.decodeKey = undefined
        scope.comboString = undefined
        scope.score = undefined
        scope.moves = undefined
        scope.hints = undefined
        scope.lastCombo = undefined

        return ["loading", scope]

      getRenderData: (scope) ->
        secretMessage: decode(scope.secretMessage, R.map( R.always(decodeKeyStates.SOLVED), scope.decodeKey))
        feedback: "You gave up!<br>Press any key to play again."
        score: 0
        showPlayActions: false

    solved:
      onEnter: ->
      onEvent: (eventData, scope) ->
        # reset everything
        scope.secretMessage = undefined
        scope.comboGroups = undefined
        scope.decodeKey = undefined
        scope.comboString = undefined
        scope.score = undefined
        scope.moves = undefined
        scope.hints = undefined
        scope.lastCombo = undefined

        return ["loading", scope]

      getRenderData: (scope) ->
        hints = if scope.hints > 1 then scope.hints else "no"
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback:  "SOLVED in #{scope.moves} moves (with #{hints} hints)!<br>Press any key to play again."
        score: scope.score
        showPlayActions: false





  # MAIN LOOP
  # Called on each game event through updateFrame.
  # Runs the current game state through a state machine.
  #
  # The active state handles the triggering event, then states
  # are transitioned depending on the outcome, and the resulting
  # active state renders the data.
  frame = (seed, trigger, eventData) ->
    [newState, newScope] = seed.state.onEvent eventData, seed.scope, trigger

    if states[newState] isnt seed.state
      states[newState].onEnter()

    render states[newState].getRenderData newScope

    {state: states[newState], scope: newScope}



  # This is a wrapper that holds state so that the rest of the
  # code can be completely pure.
  # In an FRP style, this could be done by folding over events instead.
  # It is called by all game events with the event trigger and event data.
  updateFrame = (trigger, data) ->
    {state, scope} = frame {state: @currentState, scope: @store}, trigger, data
    @currentState = state
    @store = scope

  updateFrame.currentState = states.loading
  updateFrame.store = {}
  updateFrame = updateFrame.bind updateFrame



  # bindng game event streams

  fetchQuote = ->
    Zepto.get quoteApiUrl, (response) ->
      parse = (str = "") ->
        str = str.trim()
        str = str.replace(/\t/g, "")
        str

      quote = JSON.parse(response.query.results.body).quote

      message = quote.split(/[\n\r]?\s\s--/)[0]
      source = quote.split(/[\n\r]?\s\s--/)[1]

      updateFrame "quoteLoaded", message

  onKeyDown = (e) ->
    e.preventDefault()
    updateFrame "keyPress", e

  onGiveUp = (e) ->
    e.preventDefault()
    updateFrame "giveUp", null

  onHint = (e) ->
    e.preventDefault()
    updateFrame "hint", null


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

  render = (data) ->
    $secretMessage = Zepto("#secret-message")
    $feedback = Zepto("#feedback")
    $score = Zepto("#score")
    {secretMessage, feedback, score, showPlayActions, match} = data

    $secretMessage.html buildSecredMessage secretMessage
    $feedback.html feedback # make sure only known or escaped strings go through here!
    $score.text score
    $feedback.removeClass "no-match"
    $feedback.removeClass "match"
    if match is true
      $feedback.addClass "match"
    if match is false
      $feedback.addClass "no-match"

    if showPlayActions
      Zepto("#play-actions").show()
    else
      Zepto("#play-actions").hide()


  # load sounds
  numSoundsLoaded = (soundsLoaded) ->
    R.length R.filter R.compose(R.identity, R.prop("_loaded")), R.values soundsLoaded

  updateLoadProgress = (soundsToLoad, soundsLoaded) ->
    if numSoundsLoaded(soundsLoaded) is soundsToLoad
      startGame()

  loadSounds = (sounds) ->
    totalSounds = R.length R.keys sounds

    initializeSounds = (acc, sound) ->
      acc[sound[0]] = new Howl
        urls: sound[1]
        onload: -> updateLoadProgress totalSounds, acc
      acc

    R.reduce initializeSounds, SOUNDS, R.toPairs sounds

  preload = ->
    loadSounds
      keyPressMiss: ['assets/key-press-miss.wav']
      keyPressHit: ['assets/key-press-hit.wav']

  startGame = ->
    # make sure document is loaded before starting (it should be by now)
    Zepto ($) ->
      # bind inputs
      $(document).on "keydown", onKeyDown
      $("#give-up-button").on "click", onGiveUp
      $("#hint-button").on "click", onHint

      fetchQuote()


  # kick off game
  preload()
