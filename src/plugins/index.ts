import type { Observatory } from '../Observatory'
import { createObservationDeckObserver } from '../observers/ObservationDeckObserver'

// Plugins are a way to get access to the Observatory (via `this`)
// can be used to add observers or set defaults
export type Plugin<Event, Level, ObservationId> = { setup: (observatory: Observatory<Event, Level, ObservationId>) => Observatory<Event, Level, ObservationId> }

type Config<Level> = {
  levelsToObserve: Level[]
}

export function observationDeckPlugin<Event, Level, ObservationId>(config: Config<Level>): Plugin<Event, Level, ObservationId> {
  return {
    setup: (observatory) => {
      return observatory.addObserver(createObservationDeckObserver({ levelsToObserve: config.levelsToObserve }))
    },
  }
}
