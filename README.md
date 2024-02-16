# Observatory

## 🚧 Work in progress! 🚧

Observatory's API is subject to change.

Please check back later to see the improvements. And note that this Readme currently acts as the official and only set of documentation.

Please open an issue if you want to

* request a feature
* request documentation clarification
* report a bug

## What is Observatory?

Observatory is a logging framework.

### What's a logging framework?

Observatory does not provide actual logging functionality but instead provides an ergonomic way to setup logging in your JavaScript or TypeScript application. Observatory provides a way to route logging requests and you provide the actual logging functionality.

Here's an example:
```ts
type ObservationEvent = string // or whatever you'd like
type ObservationLevel = 'ERROR' | 'INFO' // or whatever you'd like
const { logObservation } = createObservatory<ObservationEvent, ObservationLevel>()
  .addObserver({
    levelsToObserve: ['ERROR'],
    onObservation(observation) {
      yourErrorLogger(observation) // you have access to all observations of levels `ERROR`
    },
  })
  .addObserver({
    levelsToObserve: ['INFO'],
    onObservation(observation) {
      yourInfoLogger(observation) // you have access to all observations of levels `INFO`
    },
  })

logObservation('ERROR', 'SOME ERROR!') // this observation will ultimately be processed by `yourErrorLogger`
logObservation('INFO', 'SOME ERROR!') // this observation will ultimately be processed by `yourInfoLogger`
```

### Features

1. Utilize multiple "Observers" for clean separation of logging concerns.
2. Built-in conditional logging (useful for logging different Events in different development environment).
3. Customizeable "Observation Levels" that help you categorize your logging.

Observatory has 1 dependencies (`rxjs`). The goal is to refactor this out after building out the initial feature suite.

### Examples

#### Create Observatory and log Observation Event
```ts
type ObservationEvent = string // or whatever you'd like
type ObservationLevel = 'ERROR' | 'WARNING' | 'INFO' // or whatever you'd like
const { logObservation } = createObservatory<ObservationEvent, ObservationLevel>()
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
type ObservationEvent = string
type ObservationLevel = 'ERROR' | 'WARNING' | 'INFO'
const { logObservation } = createObservatory<ObservationEvent, ObservationLevel>()
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

type ObservationEvent = string
type ObservationLevel = 'ERROR'
const { logObservation } = createObservatory<ObservationEvent, ObservationLevel>()
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

type ObservationEvent = string
type ObservationLevel = 'ERROR'
const { logObservation } = createObservatory<ObservationEvent, ObservationLevel>()
  .addObserver({
    levelsToObserve: ['ERROR'],
    onObservation(observation) {
      console.error(observation.event)
    },
  })

logObservation('ERROR', 'SOME ERROR!', isTestEnvironment) // will not run
```
