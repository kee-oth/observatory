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

    // Setup
    expect(callbackForError).toHaveBeenCalledOnce()
    expect(callbackForLog).toHaveBeenCalledOnce()
  })
})
