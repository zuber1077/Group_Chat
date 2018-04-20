# Dependable [![Build Status](https://travis-ci.org/idottv/dependable.png)](https://travis-ci.org/idottv/dependable)

A minimalist dependency injection framework for node.js.

## Example

### Create a container

Create a new container by calling `dependable.container`:

```js
var dependable = require('dependable'),
    container = dependable.container();
```

### Register some dependencies

Register a few dependencies for later use (a string and an object):

```js
container.register('occupation', 'tax attorney');
container.register('transport', {
  type: 'station wagon',
  material: 'wood-paneled'
});
```

### Register a dependency that has other dependencies

When the argument is a function, the function's arguments are automatically
populated with the correct dependencies, and the return value of the function
is registered as the dependency:

```js
container.register('song', function (occupation, transport, legalStatus) {
  var song = {};

  song.chorus = function chorus() {
    return [
      'I\'m a ' + occupation,
      'On a ' + transport.material + ' ' + transport.type + ' I ride',
      'And I\'m ' + legalStatus.message
    ].join('\n');
  };

  return song;
});
```

### Register a dependency out-of-order

`song` depends on a `legalStatus`, which hasn't been registered yet.
Dependable resolves dependencies lazily, so we can define this dependency
after-the-fact:

```js
container.register('legalStatus', {
  warrants: [],
  message: 'without outstanding warrants'
});
```

### Resolve a dependency and use it

Like with container.register, the function arguments are automatically resolved, along
with their dependencies:

```js
container.resolve(function (song) {
  /*
   * I'm a tax attorney
   * On a wood-paneled station wagon I ride
   * And I'm without outstanding warrants
   */
  console.log(song.chorus());
});
```

### Re-register dependencies

As it stands, `song` returns boring, non-catchy lyrics. One way to change its behavior
is to re-register its dependencies:

```js
container.register('occupation', 'cowboy');
container.register('legalStatus', {
  warrants: [
    {
      for: 'shooting the sheriff',
      notes: 'did not shoot the deputy'
    }
  ],
  message: 'wanted: dead or alive'
});
```

This is really useful in a number of situations:

1. A container can register configuration parameters for an application---for example, a port---and allows them to be changed later
2. Dependencies can be replaced with mock objects in order to test other dependencies

To resolve the updated dependencies, provide an empty override:

```js
container.resolve({}, function (song) {
  /*
   * I'm a cowboy
   * On a wood-paneled station wagon I ride
   * And I'm wanted: dead or alive
   */
  console.log(song.chorus());
});
```

### Override dependencies at resolve time

It's also possible to override dependencies at resolve time:

```js
var horse = {
  type: 'horse',
  material: 'steel'
};

container.resolve({ transport: horse }, function (song) {
  /*
   * I'm a cowboy
   * On a steel horse I ride
   * And I'm wanted: dead or alive
   */
  console.log(song.chorus());
});
```

Sounds like a hit!

## API

`container.register(name, function)` - Registers a dependency by name. `function` can be a function that takes dependencies and returns anything, or an object itself with no dependencies.

`container.register(hash)` - Registers a hash of names and dependencies. This is useful for setting configuration constants.

`container.load(fileOrFolder)` - Registers a file, using its file name as the name, or all files in a folder. Does not traverse subdirectories.

`container.get(name, overrides = {})` - Returns a dependency by name, with all dependencies injected. If you specify overrides, the dependency will be given those overrides instead of those registered.

`container.getSandboxed(name, overrides = {})` - Returns a dependency by name, with all dependencies injected. Unlike `get`, you _must_ specify overrides for all dependencies. This can (and should) be used during testing to ensure a module under test has been competely isolated.

`container.resolve(overrides={}, cb)` - Calls `cb` like a dependency function, injecting any dependencies found in the signature. Like `container.get`, this supports overrides.

`container.list()` - Return a list of registered dependencies.

## Development

Dependable is written in coffeescript. To generate javascript, run `npm run prepublish`.

Tests are written with mocha. To run the tests, run `npm test`.

## License

[MIT][license]

[license]: https://github.com/Schoonology/dependable/blob/master/LICENSE
