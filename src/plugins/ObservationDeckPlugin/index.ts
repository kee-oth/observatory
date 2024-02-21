import { createObservationDeckObserver } from '../../observers/ObservationDeckObserver'
import type { Plugin } from '..'

import type { Observer } from '../../Observatory'

type Config<Event, Level, ObservationId> = Pick<Observer<Event, Level, ObservationId>, 'levelsToObserve' | 'observeWhen'>

export function observationDeckPlugin<Event, Level, ObservationId>({ levelsToObserve, observeWhen }: Config<Event, Level, ObservationId>): Plugin<Event, Level, ObservationId> {
  return {
    setup: (observatory) => {
      return observatory.addObserver(createObservationDeckObserver({ levelsToObserve, observeWhen }))
    },
  }
}
