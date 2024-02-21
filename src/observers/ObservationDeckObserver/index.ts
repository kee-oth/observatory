import type { Observer } from '../../Observatory'

type Config<Event, Level, ObservationId> = Pick<Observer<Event, Level, ObservationId>, 'levelsToObserve' | 'observeWhen'>

export function createObservationDeckObserver<Event, Level, ObservationId>({ levelsToObserve, observeWhen }: Config<Event, Level, ObservationId>): Observer<Event, Level, ObservationId> {
  return {
    levelsToObserve,
    observeWhen,
    onObservation: (observation) => {
      fetch('http://0.0.0.0:3000/api/observation', {
        method: 'POST',
        body: JSON.stringify([observation]),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
  }
}
