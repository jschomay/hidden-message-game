module.exports =
  save: (data) ->
    localStorage.setItem "currentPlayer", JSON.stringify data

  load: ->
    JSON.parse localStorage.getItem "currentPlayer"
