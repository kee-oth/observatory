import { describe, expect, it, vi } from 'vitest'
import { createObservatory } from './'

describe('createObservatory', () => {
  it('should be able to make logs', () => {
    // Setup
    const callbackForLog = vi.fn()
    const callbackForError = vi.fn()

    const { logObservation } = createObservatory<string>()
      .addObserver({
        levelsToObserve: ['LOG'],
        onObservation(observation) {
          callbackForLog(observation)
        },
      })
      .addObserver({
        levelsToObserve: ['ERROR'],
        onObservation(observation) {
          callbackForError(observation)
        },
      })

    // Test
    logObservation('ERROR', 'SOME ERROR!')
    logObservation('LOG', 'SOME LOG!')

    // Assert
    expect(callbackForError).toHaveBeenCalledOnce()
    expect(callbackForLog).toHaveBeenCalledOnce()
  })

  it('should be able to conditionally add Observer', () => {
    // Setup
    const callback = vi.fn()
    const { logObservation } = createObservatory<string>()
      .addObserver({
        observeWhen: false,
        levelsToObserve: ['LOG'],
        onObservation(observation) {
          callback(observation)
        },
      })

    // Test
    logObservation('LOG', 'SOME LOG!')

    // Assert
    expect(callback).not.toHaveBeenCalled()
  })

  it('should be able to conditionally log Observation', () => {
    // Setup
    const callback = vi.fn()
    const { logObservation } = createObservatory<string>()
      .addObserver({
        levelsToObserve: ['LOG'],
        onObservation(observation) {
          callback(observation)
        },
      })

    // Test
    logObservation('LOG', 'SOME LOG!', true)
    logObservation('LOG', 'SOME LOG!', false)

    // Assert
    expect(callback).toHaveBeenCalledOnce()
  })
})
