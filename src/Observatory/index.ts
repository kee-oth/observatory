import { Subject } from 'rxjs'

export type Observation<Event, Level, Id> = {
  event: Event
  level: Level
  id: Id
  timestamp: Date
}

export type Observer<Event, Level, ObservationId> = {
  observeWhen?: boolean | (() => boolean)
  levelsToObserve: Level[]
  onObservation: (
    observation: Observation<Event, Level, ObservationId>
  ) => void
}

class Observatory<Event, Level, ObservationId> {
  private declare observationSubject: Subject<
    Observation<Event, Level, ObservationId>
  >

  private observers: Observer<Event, Level, ObservationId>[] = []

  private observationIdGenerator = (): ObservationId =>
    crypto.randomUUID() as ObservationId

  constructor() {
    this.observationSubject = new Subject<
      Observation<Event, Level, ObservationId>
    >()
  }

  setObservationIdGenerator(idGenerator: () => ObservationId) {
    this.observationIdGenerator = idGenerator

    return this
  }

  addObserver(observer: Observer<Event, Level, ObservationId>) {
    const observeWhen = observer.observeWhen ?? true
    const shouldObserverSubscribe
      = typeof observeWhen === 'boolean' ? observeWhen : observeWhen()

    if (shouldObserverSubscribe) {
      this.observationSubject.subscribe((observation) => {
        if (observer.levelsToObserve.includes(observation.level)) {
          observer.onObservation(observation)
        }
      })
    }

    this.observers.push(observer)

    return this
  }

  logObservation = (
    level: Level,
    event: Event,
    when: boolean | (() => boolean) = true,
  ) => {
    const shouldLogObservation = typeof when === 'boolean' ? when : when()

    if (shouldLogObservation) {
      this.observationSubject.next({
        event,
        id: this.observationIdGenerator(),
        level,
        timestamp: new Date(),
      })
    }
  }
}
export type { Observatory }

export function createObservatory<
  Event = never,
  Level = 'ERROR' | 'WARNING' | 'INFO',
  ObservationId = string,
>() {
  return new Observatory<Event, Level, ObservationId>()
}
