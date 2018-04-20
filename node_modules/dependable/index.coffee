path = require 'path'
fs = require 'fs'

existsSync = fs.existsSync ? path.existsSync

# simple dependency injection. No nesting, just pure simplicity
exports.container = ->

  factories = {}
  modules = {}


  ## REGISTER / PARSE ################################################

  # register it! Parse it for dependencies
  register = (name, func) ->
    if name == Object name
      hash = name
      for name, func of hash
        registerOne name, func
    else
      registerOne name, func

  registerOne = (name, func) ->
    if not func? then throw new Error "cannot register null function"
    factories[name] = toFactory func

  list = -> factories

  load = (file) ->
    exists = existsSync file
    if exists
      stats = fs.statSync file
      if stats.isDirectory() then return loaddir file
    loadfile file

  loadfile = (file) ->
    module = file.replace(/\.\w+$/, "")

    # Remove dashes from files and camelcase results
    name = path.basename(module).replace(/\-(\w)/g, (match, letter) -> letter.toUpperCase())

    modules[name] = module

  loaddir = (dir) ->
    filenames = fs.readdirSync dir
    files = filenames.map (file) -> path.join dir, file
    for file in files
      continue unless file.match /\.(js|coffee)$/
      stats = fs.statSync file
      if stats.isFile() then loadfile file

  toFactory = (func) ->
    if typeof func is "function"
      func: func
      required: argList func
    else
      func: -> func
      required: []

  argList = (func) ->
    # match over multiple lines
    match = func.toString().match /function.*?\(([\s\S]*?)\)/
    if not match? then throw new Error "could not parse function arguments: #{func?.toString()}"
    required = match[1].split(",").filter(notEmpty).map((str) -> str.trim())
    return required

  notEmpty = (a) -> a

  ## GET ########################################################
  # gives you a single dependency

  # recursively resolve it!
  # TODO add visitation / detect require loops
  get = (name, overrides, visited = []) ->

    isOverridden = overrides?

    # check for circular dependencies
    if haveVisited visited, name
      throw new Error "circular dependency with '#{name}'"
    visited = visited.concat(name)

    factory = factories[name]
    if not factory?
      module = modules[name]
      if module?
        register name, require(module)
        factory = factories[name]
      else
        throw new Error "dependency '#{name}' was not registered"

    # use the one you already created
    if factory.instance? and not isOverridden
      return factory.instance

    # apply args to the right?
    dependencies = factory.required.map (name) ->
      if overrides?[name]?
        overrides?[name]
      else
        get name, overrides, visited

    instance = factory.func dependencies...

    if not isOverridden
      factory.instance = instance

    return instance

  getSandboxed = (name, overrides) ->
    mockContainer = exports.container()
    mockContainer.register(name, factories[name].func)

    return mockContainer.get(name, overrides)

  haveVisited = (visited, name) ->
    isName = (n) -> n is name
    visited.filter(isName).length

  ## RESOLVE ##########################################################

  resolve = (overrides, func) ->
    if not func
      func = overrides
      overrides = null
    register "__temp", func
    get "__temp", overrides

  container =
    get: get
    getSandboxed: getSandboxed
    resolve: resolve
    register: register
    load: load
    list: list

  # let people access the container if the know what they're doing
  container.register "_container", container

  return container
