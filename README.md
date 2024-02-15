# Observatory

## 🚧 Work in progress! 🚧

Observatory's API is subject to change.

Please check back later to see the improvements. And note that this Readme currently acts as the official and only set of documentation.

Please open an issue if you want to

* request a feature
* request documentation clarification
* report a bug

## What is Observatory?

Observatory is a logging library.

### Features

1. Utilize multiple "Observers" for clean separation of logging concerns.
2. Built-in conditional logging (useful for logging different Events in different development environment).
3. Customizeable "Observation Levels" that help you categorize your logging.

Observatory has 1 dependencies (`rxjs`). The goal is to refactor this out after building out the initial feature suite.

### Examples

#### Create Observatory and log Observation Event
```ts
type ObservationEvent = 'ERROR' | 'WARNING' | 'INFO'
const { logObservation } = createObservatory<ObservationEvent>()
  .addObserver({
    levelsToObserve: ['ERROR', 'WARNING'],
    onObservation(observation) {
      console.error(observation)
    },
  })

logObservation('ERROR', 'SOME ERROR!') // will run
logObservation('WARNING', 'SOME WARNING!') // will run
logObservation('INFO', 'SOME INFO!') // will not run
```

#### Create Observatory with multiple Observers
```ts
type ObservationEvent = 'ERROR' | 'WARNING' | 'INFO'
const { logObservation } = createObservatory<ObservationEvent>()
  .addObserver({
    levelsToObserve: ['ERROR'],
    onObservation(observation) {
      console.error(observation.event)
    },
  })
  .addObserver({
    levelsToObserve: ['WARNING'],
    onObservation(observation) {
      console.warn(observation.event)
    },
  })

logObservation('ERROR', 'SOME ERROR!') // will run
logObservation('WARNING', 'SOME WARNING!') // will run
logObservation('INFO', 'SOME INFO!') // will not run
```

#### Conditionally create Observer
```ts
const isTestEnvironment = false

type ObservationEvent = 'ERROR'
const { logObservation } = createObservatory<ObservationEvent>()
  .addObserver({
    when: isTestEnvironment,
    levelsToObserve: ['ERROR'],
    onObservation(observation) {
      console.error(observation.event)
    },
  })

logObservation('ERROR', 'SOME ERROR!') // will not run
```

#### Conditionally log Observation
```ts
const isTestEnvironment = false

type ObservationEvent = 'ERROR'
const { logObservation } = createObservatory<ObservationEvent>()
  .addObserver({
    levelsToObserve: ['ERROR'],
    onObservation(observation) {
      console.error(observation.event)
    },
  })

logObservation('ERROR', 'SOME ERROR!', isTestEnvironment) // will not run
```
