

/**
 * Requirements
 * 
 * 1. Performant
 * 2. Ergonomic and simple to use
 * 3. Doesn't get in the way
 * 
 * Features
 * 
 * 1. Can create a single or multiple observatories
 * 2. Can hook up many loggers to do whatever
 * 3. Should be able to include plugins to hook up to logging services
 * 4. Need to accomodate asynchronous logging
 * 5. Should export a default Observation type
 * 
 */

// shoudl do this, and Context should be what the consuming dev sets, that we we can use observationLevel on here
export type Observation<Message = string, Context = never> = {
  context: Context,
  id: string,
  message: Message,
  timestamp: Date,
}

// which function in here?
type Observer<Observation = never> = {
  observe: (observation: Observation) => void
  onObservation: (observation: Observation) => void
}

type Observers<Observation = never> = Observer<Observation>[]

type ObservatoryConstructorParams<Observation = never> = {
  observers: Observers<Observation>
  onObservation: (observation: Observation) => void // actually shouldn't have this, that's what observeers do
}

export class Observatory<ObservationContext = never, ObservationLevel> {
  declare private observations: Observation[] // is there a way to "watch" this and run onObservation when a new one is added? Otherwise, just do it on `logObservation`
  declare private observers: Observer[]
  declare private onObservation: (observation: Observation) => void

  constructor({ observers, onObservation }: ObservatoryConstructorParams<Observation>) {
    this.observers = observers
    this.onObservation = onObservation
  }

  getObservations(): Observation[] {
    return this.observations
  }

  logObservation(observation: Observation): void {
    this.observations.push(observation)
    this.onObservation(observation)
  }
}

const createObservatory = () => {
  // return new Observatory()
}