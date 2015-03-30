module.exports = ->

  quoteApiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.iheartquotes.com%2Fapi%2Fv1%2Frandom%3Fmax_characters%3D75%26format%3Djson'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"

  decodeKeyStates =
    HIDDEN: 0
    REVEALED: 1
    SOLVED: 2

  isLetter = (char) ->
    /[a-z]/i.test char
  isLetterOrSpace = (char) ->
    /[a-z\s]/i.test char
  isSpace = (char) ->
    /[\s]/i.test char

  hideLetters = (char) ->
    if not isLetter char
      decodeKeyStates.SOLVED
    else
      decodeKeyStates.HIDDEN

  decodeChar = (secretChar, decodingStatus)  ->
    if shouldReveal decodingStatus
      return secretChar
    else
      return "_"

  # encodedMessage, decodeKey -> decodedMessage
  decode = R.compose(R.join(''), R.zipWith(decodeChar))

  sentanceToWords = (sentance) ->
    breakIntoWords = (acc, char, index) ->
      if isLetterOrSpace char
        if isSpace char
          acc.push []
        else
          charInfo =
            char: char
            index: index
            reveal: false
          acc[acc.length - 1].push charInfo
      acc
    R.reduceIndexed breakIntoWords, [[]], sentance


  shouldReveal = (decodingStatus) ->
    decodingStatus in [decodeKeyStates.REVEALED, decodeKeyStates.SOLVED]

  comboToString = R.compose R.join(""), R.map(R.prop "char")

  setIndexIfNotSolved = (value, arr, index) ->
    if arr[index] isnt decodeKeyStates.SOLVED
      arr[index] = value
    arr

  setIndexes = R.curry (value, arr, indexes) ->
    R.reduce R.partial(setIndexIfNotSolved, value), arr, indexes


  setIndexesToSolved = setIndexes decodeKeyStates.SOLVED
  setIndexesToRevealed = setIndexes decodeKeyStates.REVEALED

  resetAllUnsolved = (decodeKey) ->
    nullifyAllNonSolved = (i) ->
      if i is decodeKeyStates.SOLVED then i else decodeKeyStates.HIDDEN
    R.map nullifyAllNonSolved, decodeKey

  updatedecodeKey = (comboString, decodeKey, comboGroup) ->
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


  getAllMatches = (comboGroups, comboStream, decodeKey) ->
    if comboStream.length < 1
      return decodeKey
    comboString = comboToString comboStream
    decodeKey = R.reduce R.partial(updatedecodeKey, comboString), decodeKey, comboGroups
    return getAllMatches comboGroups, comboStream.slice(1), decodeKey


  getValidComboStream = (comboStream, comboGroups) ->
    if comboStream.length < 1
      # no valid combo
      return []

    comboString = comboToString comboStream
    pattern = new RegExp "^" + comboString, "i"
    joinAndMatch = R.compose(R.match(pattern), comboToString)
    isValidCombo = R.any joinAndMatch, comboGroups

    if isValidCombo
      return comboStream
    else
      # recurse with shorter and shorter combo streams
      getValidComboStream comboStream.slice(1), comboGroups






  # GAME STATES
  states =
    loading:
      process: (eventData, scope, trigger) ->
        if trigger isnt "quoteLoaded" then return scope

        secretMessage = eventData
        # initialize game data with secret message
        scope.secretMessage = secretMessage
        scope.comboGroups = sentanceToWords secretMessage
        scope.decodeKey = R.map hideLetters, secretMessage
        scope.comboStream = []
        scope.score = R.filter(isLetter, secretMessage).length * 5
        scope.moves = 0
        scope.lastInput = null
        scope

      nextState: (trigger, scope) ->
        if trigger is "quoteLoaded"
          states.updateProgress
        else
          states.loading

      getRenderData: (scope) ->
        secretMessage: ""
        feedback: "LOADING"
        score: ""
        showGameActions: false

    updateProgress:
      process: (eventData, scope) ->
        char = eventData
        # ignore non-letter inputs
        if isLetter char
          potentialCombo = R.concat scope.comboStream, [{char:char}]
          existingSolved = resetAllUnsolved scope.decodeKey
          # update state
          scope.moves += 1
          scope.score = Math.max(0, scope.score - 1)
          scope.comboStream = getValidComboStream potentialCombo, scope.comboGroups
          scope.decodeKey = getAllMatches scope.comboGroups, scope.comboStream, existingSolved
          scope.lastInput = char
          scope
        else
          scope

      nextState: (trigger, scope) ->
        # give up?
        if trigger is "gaveUp"
          return states.gaveUp

        # won?
        totalUnsolved = R.length R.filter(R.not(R.eq(decodeKeyStates.SOLVED))) scope.decodeKey
        if totalUnsolved is 0
          return states.solved

        # keep playing
        return states.updateProgress

      getRenderData: (scope) ->
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboToString(scope.comboStream) or scope.lastInput  or "Type letter combos to reveal the hidden message."
        score: scope.score
        showGameActions: true

    gaveUp:
      process: (eventData, scope) ->
        fetchQuote()
        # reset everything
        scope.secretMessage = undefined
        scope.comboGroups = undefined
        scope.decodeKey = undefined
        scope.comboStream = undefined
        scope.score = undefined
        scope.moves = undefined
        scope.lastInput = undefined
        scope

      nextState: (trigger, scope) ->
        states.loading

      getRenderData: (scope) ->
        secretMessage: scope.secretMessage
        feedback: "You gave up!<br>Press any key to play again."
        score: 0
        showGameActions: false

    solved:
      process: (eventData, scope) ->
        fetchQuote()
        # reset everything
        scope.secretMessage = undefined
        scope.comboGroups = undefined
        scope.decodeKey = undefined
        scope.comboStream = undefined
        scope.score = undefined
        scope.moves = undefined
        scope.lastInput = undefined
        scope

      nextState: (trigger, scope) ->
        states.loading

      getRenderData: (scope) ->
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback:  "SOLVED in #{scope.moves} moves!<br>Press any key to play again."
        score: scope.score
        showGameActions: false





  # MAIN LOOP
  # Called on each game event through updateFrame.
  # Runs the current game state through a state machine.
  #
  # The active state handles the triggering event, then states
  # are transitioned depending on the outcome, and the resulting
  # active state renders the data.
  frame = (seed, trigger, eventData) ->
    newScope = seed.state.process eventData, seed.scope, trigger
    newState = seed.state.nextState trigger, newScope
    render newState.getRenderData newScope
    {state: newState, scope: newScope}



  # This is a wrapper that holds state so that the rest of the
  # code can be completely pure.
  # In an FRP style, this could be done by folding over events instead
  # It is called by all game events.
  updateFrame = (type, data) ->
    {state, scope} = frame {state: @currentState, scope: @store}, type, data
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
    if e.keyCode is 191 # "?"
      updateFrame "gaveUp", null
    else
      char = String.fromCharCode(e.keyCode).toLowerCase()
      updateFrame "keyPressed", char


  # drawing

  render = (data) ->
    $secretMessage = Zepto("#secret-message")
    $feedback = Zepto("#feedback")
    $score = Zepto("#score")
    {secretMessage, feedback, score, showGameActions} = data

    $secretMessage.text secretMessage
    $feedback.html feedback
    $score.text score

    if showGameActions
      Zepto("#give-up").show()
    else
      Zepto("#give-up").hide()



  # kick off when document is pready
  Zepto ($) ->
    $(document).on "keydown", onKeyDown
    fetchQuote()
    updateFrame "startGame", null
