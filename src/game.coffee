module.exports = ->
# Find some good random phrases here:
# http://www.smartphrase.com/cgi-bin/randomphrase.cgi?spanish&humorous&normal&16&11&12&15&1&4
# quote api: http://iheartquotes.com/api

  decodeKeyStates =
    HIDDEN: 0
    REVEALED: 1
    SOLVED: 2

  secretMessage = undefined
  comboGroups = undefined
  decodeKey = undefined
  comboStream = undefined
  score = undefined
  moves = undefined

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


  # main "loop"
  onKeyDown =  (render, e) ->
    key = e.keyCode

    # give up?
    if e.keyCode is 191 # "?"
      # give up; show the secret message
     render secretMessage, "You gave up!", 0

    char = String.fromCharCode(key).toLowerCase()
    # ignore non-letter inputs
    if isLetter char
      # update state
      moves++
      score = Math.max(0, score - 1)
      potentialCombo = R.concat comboStream, [{char:char}]
      comboStream = getValidComboStream potentialCombo, comboGroups
      decodeKey = resetAllUnsolved decodeKey
      decodeKey = getAllMatches comboGroups, comboStream, decodeKey

      # display
      console.log 'comboStream:', comboToString comboStream
      console.log 'decodeKey:', decodeKey
      render decode(secretMessage, decodeKey), (comboToString(comboStream) or char), score

      # won?
      totalUnsolved = R.length R.filter(R.not(R.eq(decodeKeyStates.SOLVED))) decodeKey
      if totalUnsolved is 0
        render decode(secretMessage, decodeKey), "SOLVED in #{moves} moves!", score


  initializeGame = (render) ->

    messages = ["There's no such thing as a free lunch.", "Here, there, and everywhere."]

    # set initial game state

    # static
    secretMessage = messages.pop() or "No more messages left."
    comboGroups = sentanceToWords secretMessage

    # dynamic
    decodeKey = R.map hideLetters, secretMessage
    comboStream = []
    score = R.filter(isLetter, secretMessage).length * 5
    moves = 0

    # start game
    render decode(secretMessage, decodeKey), "Type letter combos to reveal the hidden message.", score
    document.addEventListener "keydown", R.partial onKeyDown, render



# kick off
  document.onreadystatechange = ->
    if document.readyState is "complete"
      $secretMessage = document.getElementById("secret-message")
      $feedback = document.getElementById("feedback")
      $score = document.getElementById("score")
      render = (secretMessage, feedback, score) ->
        $secretMessage.innerText = secretMessage
        $feedback.innerText = feedback
        $score.innerText = score

      initializeGame render
