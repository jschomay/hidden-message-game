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


  getAllMatches = (comboGroups, comboString, decodeKey) ->
    if comboString.length < 1
      return decodeKey
    decodeKey = R.reduce R.partial(updatedecodeKey, comboString), decodeKey, comboGroups
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
          scope.lastInput = null
          return ["play", scope]
        else
          ["loading", scope]

      getRenderData: (scope) ->
        secretMessage: ""
        feedback: "LOADING"
        score: ""
        showPlayActions: false

    play:
      onEnter: ->
      onEvent: (eventData, scope, trigger) ->
        if trigger is "giveUp"
          return ["gaveUp", scope]

        else if trigger is "keyPress"
          char = String.fromCharCode(eventData.keyCode).toLowerCase()

          # ignore non-letter inputs
          if isLetter char
            potentialCombo = scope.comboString + char
            existingSolved = resetAllUnsolved scope.decodeKey

            # update state
            scope.moves += 1
            scope.score = Math.max(0, scope.score - 1)
            scope.comboString = getValidComboStream potentialCombo, scope.comboGroups
            scope.decodeKey = getAllMatches scope.comboGroups, scope.comboString, existingSolved
            scope.lastInput = char

          # won?
          isUnsolved = R.compose(R.not, (R.eq decodeKeyStates.SOLVED))
          totalUnsolved = R.length(R.filter(isUnsolved) scope.decodeKey)
          if totalUnsolved is 0
            return ["solved", scope]

        ["play", scope]

      getRenderData: (scope) ->
        comboString = if scope.comboString.length then scope.comboString else null
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback: comboString or scope.lastInput  or "Type letter combos to reveal the hidden message."
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
        scope.lastInput = undefined

        return ["loading", scope]

      getRenderData: (scope) ->
        secretMessage: scope.secretMessage
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
        scope.lastInput = undefined

        return ["loading", scope]

      getRenderData: (scope) ->
        secretMessage: decode(scope.secretMessage, scope.decodeKey)
        feedback:  "SOLVED in #{scope.moves} moves!<br>Press any key to play again."
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


  # drawing

  render = (data) ->
    $secretMessage = Zepto("#secret-message")
    $feedback = Zepto("#feedback")
    $score = Zepto("#score")
    {secretMessage, feedback, score, showPlayActions} = data

    $secretMessage.text secretMessage
    $feedback.html feedback # make sure only known or escaped strings go through here!
    $score.text score

    if showPlayActions
      Zepto("#play-actions").show()
    else
      Zepto("#play-actions").hide()



  # kick off when document is pready
  Zepto ($) ->
    # bind inputs
    $(document).on "keydown", onKeyDown
    $("#give-up-button").on "click", onGiveUp

    fetchQuote()
    updateFrame "startGame", null
