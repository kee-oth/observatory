import { describe, expect, it, vi } from 'vitest'
import { createObservatory } from './'

describe('createObservatory', () => {
  it('should be able to log Observations to different Observing', () => {
    // Setup
    const callbackForLog = vi.fn()
    const callbackForError = vi.fn()

    const { logObservation } = createObservatory<string>()
      .addObserver({
        levelsToObserve: ['INFO'],
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
    logObservation('INFO', 'SOME INFO!')

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
        levelsToObserve: ['INFO'],
        onObservation(observation) {
          callback(observation)
        },
      })

    // Test
    logObservation('INFO', 'SOME INFO!')

    // Assert
    expect(callback).not.toHaveBeenCalled()
  })

  it('should be able to conditionally log Observation', () => {
    // Setup
    const callback = vi.fn()
    const { logObservation } = createObservatory<string>()
      .addObserver({
        levelsToObserve: ['INFO'],
        onObservation(observation) {
          callback(observation)
        },
      })
      .setObservationIdGenerator(() => 'fish')

    // Test
    logObservation('INFO', 'SOME INFO!', true)
    logObservation('INFO', 'SOME INFO!', false)

    // Assert
    expect(callback).toHaveBeenCalledOnce()
  })
})
