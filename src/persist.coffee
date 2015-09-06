Parse.initialize("iul0cVOM5mJWAj1HHBa158cpMoyEQ2wWxSK3Go9O", "pbFnYPVaSunEmgjI8qTKqkW8nHKoB6Xor1DtOWpD");

userId = undefined

Player = Parse.Object.extend("FacebookPlayer")
savedPlayer = undefined

module.exports =
  save: (data) ->
    userId = userId
    return if not userId

    if not savedPlayer
      savedPlayer = new Player()
      savedPlayer.set "userId", "" + userId # note it is coerced to string
      savedPlayer.save(data).then (player) ->
        true
      , (error) -> console.error error
    else
      savedPlayer.save(data).then (player) ->
        true
      , (error) -> console.error error

  load: ->
    userId = userId
    if userId
      query = new Parse.Query(Player)
      query.equalTo "userId", "" + userId
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

  setUserId: (response) ->
    console.log 'setUserId', response
    return if response.status isnt 'connected'

    userId = response.authResponse.userID

  getUserId: -> userId
