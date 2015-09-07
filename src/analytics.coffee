Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O", "pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD");

{bundleNames, getNextQuoteIndex} = require "./bundles"

module.exports = (eventName, scope = {}, userData = {}, dimensions = {}) ->
  dimensions.platform = "facebook"
  if userData.lastSolvedBundleIndex
    nextQuote = getNextQuoteIndex userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex
    round = "#{bundleNames[nextQuote.bundleIndex]}-#{(nextQuote.quoteIndex)+ 1}"
    dimensions.round = round

  Parse.Analytics.track(eventName, dimensions)

