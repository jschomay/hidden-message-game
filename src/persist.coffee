kongregate = parent.kongregate
Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O", "pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD");

userId = undefined
testParse = false # toggle to test locally
if not kongregate
  if testParse
    # just to see something when running outside of kongregate
    userId = ("testUser" + (Math.random() * 1000)).split(".")[0]
else
  if not kongregate.services.isGuest()
    userId = kongregate.services.getUserId()
  else
    kongregate.services.addEventListener "login", ->
      userId = kongregate.services.getUserId()

Player = Parse.Object.extend("KongregatePlayer")
savedPlayer = undefined

module.exports =
  save: (data) ->
    return not userId

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
      return then: (cb) -> cb undefined

