kongregate = parent.kongregate or stats: submit: console.log.bind console
{ bundleCompleted } = require "./bundles"

module.exports = (userData) ->

  # HighScore (max)
  kongregate.stats.submit("HighScore", userData.totalScore)

  # NumCompletedQuotes (max)
  sumProgress = (acc, bundleProgress) ->
    acc + bundleProgress + 1
  numCompletedQuotes = R.reduce sumProgress, 0, userData.progressPerBundle
  kongregate.stats.submit("NumCompletedQuotes ", numCompletedQuotes)

  bundleWasCompleted = bundleCompleted(userData.lastSolvedBundleIndex, userData.lastSolvedQuoteIndex)

  # Quotes2BundleCompleted (replace)
  if bundleWasCompleted and userData.progressPerBundle.length is 2
    kongregate.stats.submit("Quotes2BundleCompleted ", 1)

  # StarterBundleComplete (replace)
  if bundleWasCompleted and userData.progressPerBundle.length is 1
    kongregate.stats.submit("StarterBundleComplete ", 1)

