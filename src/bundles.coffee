quoteBundles = [
  require "./bundles/starter"
]

updateProgressPerBundle = (progressPerBundle, currentBundleIndex, currentQuoteIndex) ->
  if not progressPerBundle
    # need to initiate progressPerBundle
    initedPreviousBundles = R.times R.always(0), currentBundleIndex
    R.append currentQuoteIndex, initedPreviousBundles
  else if currentBundleIndex is progressPerBundle.length - 1
    # same bundle
    if currentQuoteIndex > R.last(progressPerBundle)
      # and newer quote
      R.append currentQuoteIndex, R.slice 0, -1, progressPerBundle
    else
      progressPerBundle
  else if currentBundleIndex > progressPerBundle.length - 1
    # next bundle
    R.append currentQuoteIndex, progressPerBundle
  else
    progressPerBundle


getNextQuoteIndex = (lastSolvedBundleIndex, lastSolvedQuoteIndex) ->
  if not lastSolvedQuoteIndex?
    # new game
    quoteIndex: 0
    bundleIndex: 0
  else if lastSolvedQuoteIndex is quoteBundles[lastSolvedBundleIndex].length - 1
    # bundle complete, start next bundle
    # (or start from very begining if no next bundle)
    quoteIndex: 0
    bundleIndex: if quoteBundles[lastSolvedBundleIndex + 1] then lastSolvedBundleIndex + 1 else 0
  else
    # next quote in bundle
    quoteIndex: lastSolvedQuoteIndex + 1
    bundleIndex: lastSolvedBundleIndex


module.exports = {
  quoteBundles
  updateProgressPerBundle
  getNextQuoteIndex
}
