kongregate = parent.kongregate
Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O", "pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD");

getUserId = ->
  mockUserId = false # toggle to test locally
  if not kongregate
    if mockUserId
      # just to see something when running outside of kongregate
      # return userId = ("testUser" + (Math.random() * 1000)).split(".")[0]
      return "mockUser"
  else
    if not kongregate.services.isGuest()
      return userId = kongregate.services.getUserId()
    else
      return undefined

Player = Parse.Object.extend("KongregatePlayer")
savedPlayer = undefined

module.exports =
  save: (data) ->
    userId = "" + getUserId() # note it is coerced to string
    return if not userId

    if not savedPlayer
      savedPlayer = new Player()
      savedPlayer.set "userId", userId
      savedPlayer.save(data).then (player) ->
        true
      , (error) -> console.error error
    else
      savedPlayer.save(data).then (player) ->
        true
      , (error) -> console.error error

  load: ->
    userId = "" + getUserId() # note it is coerced to string
    if userId
      query = new Parse.Query(Player)
      query.equalTo "userId", userId
      # return possible user as promise
      playerPromise = query.first()
      playerPromise.then (player) ->
        if player
          savedPlayer = player
      , (error) ->
        console.error error
      return playerPromise
    else
      immediate = new Parse.Promise()
      setTimeout (-> immediate.resolve()), 0
      return immediate
