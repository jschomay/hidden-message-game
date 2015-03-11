module.exports = ->
# Find some good random phrases here:
# http://www.smartphrase.com/cgi-bin/randomphrase.cgi?spanish&humorous&normal&16&11&12&15&1&4
# quote api: http://iheartquotes.com/api

  secretMessage = "It's a small world, but I wouldn't want to have to paint it."

  decoderStates =
    HIDDEN: 0
    REVEALED: 1
    SOLVED: 2
  comboStream = []
  render = undefined
  decoder = undefined

  isLetter = (char) ->
    /[a-z]/i.test char
  isLetterOrSpace = (char) ->
    /[a-z\s]/i.test char
  isSpace = (char) ->
    /[\s]/i.test char

  getDecodeState = (char) ->
    if not isLetter char
      decoderStates.SOLVED
    else
      decoderStates.HIDDEN

  decodeChar = (secretChar, decodingStatus)  ->
    if shouldReveal decodingStatus
      return secretChar
    else
      return "_"

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

  decodeMessage = R.compose R.join(''), R.zipWith(decodeChar, secretMessage)

  comboGroups = sentanceToWords secretMessage

  shouldReveal = (decodingStatus) ->
    decodingStatus in [decoderStates.REVEALED, decoderStates.SOLVED]

  comboToString = R.compose R.join(""), R.map(R.prop "char")

  setIndex = (value, arr, index) ->
    if arr[index] isnt decoderStates.SOLVED
      arr[index] = value
    arr

  setIndexes = R.curry (value, arr, indexes) ->
    R.reduce R.partial(setIndex, value), arr, indexes


  setIndexesToSolved = setIndexes decoderStates.SOLVED
  setIndexesToRevealed = setIndexes decoderStates.REVEALED

  resetDecoder = (decoder) ->
    nullifyAllNonSolved = (i) ->
      if i is decoderStates.SOLVED then i else decoderStates.HIDDEN
    R.map nullifyAllNonSolved, decoder

  updateDecoder = (comboString, decoder, comboGroup) ->
    setDecoderIndexesToSolved = setIndexesToSolved decoder
    setDecoderIndexesToRevealed = setIndexesToRevealed decoder
    pattern = new RegExp "^" + comboString, "i"
    comboGroupString = comboToString comboGroup

    if pattern.test comboGroupString
      indexes = R.map(R.prop "index") R.take comboString.length, comboGroup
      if comboString.length is comboGroup.length
        return setDecoderIndexesToSolved indexes
      else
        return setDecoderIndexesToRevealed indexes
    else
      return decoder


  getAllMatches = (comboGroups, comboStream, decoder) ->
    if comboStream.length < 1
      return decoder
    comboString = comboToString comboStream
    decoder = R.reduce R.partial(updateDecoder, comboString), decoder, comboGroups
    return getAllMatches comboGroups, comboStream.slice(1), decoder


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
  onKeyDown =  (e) ->
    key = e.keyCode
    if e.keyCode is 27 #esc
      # give up; show the secret message
     render decodeMessage(R.map R.always(decoderStates.SOLVED), decoder), "You gave up!"
    char = String.fromCharCode(key).toLowerCase()
    # ignore non-letter inputs
    if isLetter char
      decoder = resetDecoder decoder
      potentialCombo = R.concat comboStream, [{char:char}]
      comboStream = getValidComboStream potentialCombo, comboGroups
      console.log 'comboStream:', comboToString comboStream
      decoder = getAllMatches comboGroups, comboStream, decoder
      console.log 'decoder:', decoder
      render decodeMessage(decoder), comboToString(comboStream) or char

      totalUnsolved = R.length R.filter(R.not(R.eq(decoderStates.SOLVED))) decoder
      if totalUnsolved is 0
        render decodeMessage(decoder), "You win!"




# kick off
  document.onreadystatechange = ->
    if document.readyState is "complete"
      # start up sequence
      decoder = R.map getDecodeState, secretMessage
      $secretMessage = document.getElementById("secret-message")
      $feedback = document.getElementById("feedback")
      render = (secretMessage, feedback) ->
        $secretMessage.innerText = secretMessage
        $feedback.innerText = feedback

      render decodeMessage(decoder), "Type letter combos to reveal the hidden message."
      document.addEventListener "keydown", onKeyDown

