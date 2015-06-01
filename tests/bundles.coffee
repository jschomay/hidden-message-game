assert = require("assert")
global.R = require "ramda"

{updateProgressPerBundle} = require "../src/bundles"


describe "updateProgressPerBundle", ->

  it "next quote in bundle", ->
    progressPerBundle = [19, 5] # all of bundle 1, index 5 in bundle 2
    newProgress = updateProgressPerBundle progressPerBundle, 1, 6
    assert.deepEqual newProgress, [19, 6]

    progressPerBundle = [15]
    newProgress = updateProgressPerBundle progressPerBundle, 0, 16
    assert.deepEqual newProgress, [16]

  it "with undefined progressPerBundle", ->
    newProgress = updateProgressPerBundle undefined, 1, 6
    assert.deepEqual newProgress, [0, 6]

    newProgress = updateProgressPerBundle undefined, 0, 0
    assert.deepEqual newProgress, [0]

    newProgress = updateProgressPerBundle undefined, 0, 3
    assert.deepEqual newProgress, [3]

  it "when in last bundle, but earlier quote", ->
    progressPerBundle = [19, 5]
    newProgress = updateProgressPerBundle progressPerBundle, 1, 1
    assert.deepEqual newProgress, [19, 5]

  it "when in earlier bundle", ->
    progressPerBundle = [19, 5]
    newProgress = updateProgressPerBundle progressPerBundle, 0, 6
    assert.deepEqual newProgress, [19, 5]

  it "when on next bundle", ->
    progressPerBundle = [19, 19]
    newProgress = updateProgressPerBundle progressPerBundle, 2, 0
    assert.deepEqual newProgress, [19, 19, 0]
