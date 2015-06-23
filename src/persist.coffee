module.exports =
  save: (data) ->
    try
      localStorage.setItem "currentPlayer", JSON.stringify data
    catch
      console.error "Unable to save to local storage, your progress won't be saved :("

  load: ->
    try
      JSON.parse localStorage.getItem "currentPlayer"
    catch
      console.error "Unable to read from local storage, you'll have to start from the beginning."
      {}
