import { Subject } from 'rxjs'

export type Observation<ObservationEvent, ObservationLevel, ObservationId> = {
  event: ObservationEvent
  level: ObservationLevel
  id: ObservationId
  timestamp: Date
}

export type Observer<ObservationEvent, ObservationLevel, ObservationId> = {
  observeWhen?: boolean | (() => boolean)
  levelsToObserve: ObservationLevel[]
  onObservation: (
    observation: Observation<ObservationEvent, ObservationLevel, ObservationId>
  ) => void
}

type ObservationLevelDefault =
  | 'ERROR'
  | 'FAILURE'
  | 'LOG'
  | 'PERFORMANCE'
  | 'MONITORING'
  | 'WARNING'

export class Observatory<
  ObservationEvent = never,
  ObservationLevel = ObservationLevelDefault,
  ObservationId = string,
> {
  declare private observationSubject: Subject<Observation<ObservationEvent, ObservationLevel, ObservationId>>
  private observers: Observer<
    ObservationEvent,
    ObservationLevel,
    ObservationId
  >[] = []

  private observationIdGenerator: () => ObservationId = () =>
    crypto.randomUUID() as ObservationId

  constructor() {
    this.observationSubject = new Subject<
      Observation<ObservationEvent, ObservationLevel, ObservationId>
    >()
  }

  setObservationIdGenerator(idGenerator: () => ObservationId) {
    this.observationIdGenerator = idGenerator
  }

  addObserver(
    observer: Observer<ObservationEvent, ObservationLevel, ObservationId>,
  ) {
    const shouldObserverSubscribe = (observer.observeWhen === undefined || typeof observer.observeWhen === 'boolean') ? observer.observeWhen === undefined ? true : Boolean(observer.observeWhen) : observer.observeWhen()

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
    observationLevel: ObservationLevel,
    observationEvent: ObservationEvent,
    when: boolean | (() => boolean) = true,
  ) => {
    const shouldLogObservation = typeof when === 'boolean' ? Boolean(when) : when()

    if (shouldLogObservation) {
      this.observationSubject.next({
        event: observationEvent,
        id: this.observationIdGenerator(),
        level: observationLevel,
        timestamp: new Date(),
      })
    }
  }
}

export function createObservatory<
  ObservationEvent = never,
  ObservationLevel = ObservationLevelDefault,
  ObservationId = string,
>() {
  return new Observatory<ObservationEvent, ObservationLevel, ObservationId>()
}
