module.exports = ->

  quoteApiUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.iheartquotes.com%2Fapi%2Fv1%2Frandom%3Fmax_characters%3D75%26format%3Djson'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"

  saveQuoteUrl = "http://localhost:8000"

  saveQuote = (quote) ->
    console.log "Saving \"#{quote}\"..."
    success = ->
      console.log "success"
      updateFrame "quoteSaved", null

    error = (xhr) ->
      throw new Error xhr.responseText

    Zepto.ajax
      type: 'POST',
      url: saveQuoteUrl
      data:
        quote: quote
      success: success
      error: error

  # GAME STATES
  states =
    loading:
      onEnter: ->
        fetchQuote()
      onEvent: (eventData, scope, trigger) ->
        if trigger is "quoteLoaded"
          quote = eventData
          scope.quote = quote
          return ["editQuote", scope]
        else
          ["loading", scope]
      getRenderData: (scope) ->
        quote: ""
        feedback: "LOADING..."
        showEditActions: false

    editQuote:
      onEnter: ->
      onEvent: (eventData, scope, trigger) ->
        if trigger is "saveQuote"
          scope.quote = eventData
          return ["saving", scope]
        else if trigger is "skipQuote"
          return ["loading", scope]
        else
          ["editQuote", scope]
      getRenderData: (scope) ->
        quote: scope.quote
        feedback: "You can edit this quote, save it, or skip it."
        showEditActions: true

    saving:
      onEnter: (quote) ->
        saveQuote quote
      onEvent: (eventData, scope, trigger) ->
        if trigger is "quoteSaved"
          scope.quote = undefined
          return ["loading", scope]
        else
          return ["saving", scope]
      getRenderData: (scope) ->
        quote: scope.quote
        feedback: "Saving quote..."
        showEditActions: false



  # MAIN LOOP
  # Called on each game event through updateFrame.
  # Runs the current game state through a state machine.
  #
  # The active state handles the triggering event, then states
  # are transitioned depending on the outcome, and the resulting
  # active state renders the data.
  frame = (seed, trigger, eventData) ->
    [newState, newScope] = seed.state.onEvent eventData, seed.scope, trigger

    if states[newState] isnt seed.state
      states[newState].onEnter newScope.quote

    render states[newState].getRenderData(newScope), newScope

    {state: states[newState], scope: newScope}



  # This is a wrapper that holds state so that the rest of the
  # code can be completely pure.
  # In an FRP style, this could be done by folding over events instead.
  # It is called by all game events with the event trigger and event data.
  updateFrame = (trigger, data) ->
    @store = onFrameEnter @store, trigger, data
    {state, scope} = frame {state: @currentState, scope: @store}, trigger, data
    @currentState = state
    @store = scope


  # code to run on every frame regardless of which state is active
  onFrameEnter = (scope, trigger, eventData) ->
    scope




  # bindng game event streams

  fetchQuote = ->
    Zepto.get quoteApiUrl, (response) ->
      parse = (str = "") ->
        str = str.trim()
        str = str.replace(/\t/g, "")
        str

      quote = JSON.parse(response.query.results.body).quote

      message = quote.split(/[\n\r]?\s\s--/)[0].trim()
      source = quote.split(/[\n\r]?\s\s--/)[1]

      updateFrame "quoteLoaded", message

  onSkipQuote = (e) ->
    e.preventDefault()
    updateFrame "skipQuote", null
  onSaveQuote = (e) ->
    e.preventDefault()
    quote = Zepto("#quote").val()
    parse = (quote) ->
      quote.trim()
    updateFrame "saveQuote", parse quote


  # drawing

  render = (renderData, rawScope) ->
    $quote = Zepto("#quote")
    $feedback = Zepto("#feedback")
    $saveQuote = Zepto("#save-quote")
    $skipQuote = Zepto("#skip-quote")

    {quote, feedback, showEditActions} = renderData

    $quote.val quote
    $feedback.text feedback

    # hint and give up buttons
    if showEditActions
      Zepto("#edit-actions").show()
    else
      Zepto("#edit-actions").hide()


  start = ->
    # make sure document is loaded before starting (it should be by now)
    Zepto ($) ->

      # initialize main loop with starting state
      updateFrame.currentState = states.loading
      updateFrame.store = {}
      updateFrame = updateFrame.bind updateFrame

      # bind inputs
      $("#save-quote").on "click", onSaveQuote
      $("#skip-quote").on "click", onSkipQuote

      fetchQuote()

  # kick off
  start()
