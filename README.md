# LocalAPI

[![Node Version][node-image]][node-url]

<img align="right" src="./docs/logo/logo.jpg">
**LocalAPI** is a Node.js-based application that allows for running a fully functional API on the basis of definitions contained in a RAML file. LocalAPI also generates dummy data JSON files based on JavaScript templates. Example data is generated every time LocalAPI starts and is utilized as responses in the API module.


## Tutorial
**Check out our wiki and tutorial for LocalAPI!**

* [Wiki Home](https://github.com/isaacloud/local-api/wiki)
* [Tutorial](https://github.com/isaacloud/local-api/wiki/Tutorial)

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Run options](#run-options)
    - [Custom port](#custom-port)
    - [Show running details](#show-running-details)
    - [Use static examples](#use-static-examples)
- [RAML](#raml)
  - [Version](#version)
  - [Directory structure](#directory-structure)
  - [Supported responses](#supported-responses)
- [Dummy data generator](#dummy-data-generator)
  - [Basic Information](#basic-information)
  - [How to](#how-to)
  - [Methods for template generator](#methods-for-template-generator)
- [Known problems and limitations](#known-problems-and-limitations)
- [Planned features and enhancements](#planned-features-and-enhancements)
- [License](#license)
- [Changelog](#changelog)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Installation

1. Install Node.js from http://nodejs.org/, version 0.9.11 or higher
2. Install LocalAPI module via npm or yarn
    a) npm

  ```
  npm install -g localapi
  ```
  
  a) yarn

  ```
  yarn global add localapi
  ```

---

## Usage

1. Create a RAML directory with the [specified structure](#directory-structure)

2. Enter the RAML directory:
  
  ```
  cd example_raml
  ```

3. Run LocalAPI:

  ```
  localapi [options] run <raml-file>
  ```

4. Wait a moment until the RAML file is loaded and JSON files with dummy data are generated. The following information will show:

  ```
  info: [localapi] App running at http:/0.0.0.0:3333
  ```
  
  LocalAPI will run at http://localhost:3333


### Run options

#### Custom port

To run LocalAPI on a custom port use `-p` argument

```
localapi run raml_example_file.raml -p 3500
```

#### Show running details

To run LocalAPI with additional logs (details mode) use `-d `argument

```
localapi run -d raml_example_file.raml
```

#### Use static examples

To run LocalAPI with your own predefined examples (not generated from templates), use `--no-examples` argument

```
localapi run --no-examples raml_example_file.raml
```

---

## RAML

### Version

As of now, LocalAPI supports RAML 0.8.

### Directory structure

- [dir] examples - dummy data JSON files (generated from templates)
- [dir] static_examples - dummy data JSON files (static)
- [dir] schemas - json schemas
- [dir] templates - dummy data templates for the [generator](#dummy-data-generator)
- {YOUR\_RAML\_FILENAME}.raml - the RAML file

See [Example RAML directory](./example_raml).


### Supported responses

LocalAPI supports:

* **regular fake data response** 
  
  Available for for synchronous GET requests. Returns the specified response example file. 

  ```
  get:
    responses:
      200:
        body:
          application/json:
            schema: !include schemas/users.json
            example: !include examples/users.json
  ```


* **response containing fake data merged with data sent in the body the request** 
  
  Available for POST, PUT, PATCH requests.

  ```
      patch:
          description: Updates a user partially by his/her id.
          body:
            application/json:
              example: !include examples/user_patch.json
              schema: !include schemas/user_patch.json
          responses:
            200:
              body:
                application/json:
                  schema: !include schemas/user.json
                  example: !include examples/user.json
  ```


* **response containing only data sent in the body of the request**

  Available for POST, PUT, PATCH requests.

  ```
    put:
      body:
        application/json:
          schema: !include schemas/user_put.json
          example: !include examples/user.json
      responses:
        200:
          body:
            application/json:
              example: false
  ```


* **empty response** 
  
  Available for all requests.

  ```
    post:
    description: Creates a user with a system-generated id.
    body:
      application/json:
        example: !include examples/user_post.json
        schema: !include schemas/user_post.json
    responses:
      202:
        body:
          application/json:
            example: ""
            schema: ""
  ```


---


## Dummy data generator

### Basic Information

* Template location: `/templates`
* Template format: `*.js`
* Example data is generated every time LocalAPI starts.
* To disable it, use `--no-examples` option.

**TIP** - [Faker.js](https://github.com/marak/Faker.js/) library is available to use.

### How to

1. Create JavaScript templates in `/templates` directory ([see example](./example_raml/templates/users/user.js)).

2. Run LocalAPI to generate JSON files ([see Usage](#usage)).


### Methods for template generator

- tmplUtils.**stringId([string_length])**<br>
  Returns a string with random characters.<br>
  *string_length* - default: 24

  ```
  var id = tmplUtils.stringId();
  // id === rd9k0cgdi7ap2e29
  ```
- tmplUtils.**getTemplate(template_filename)**<br>
  Generates and includes dummy data json from the template.<br>
  *template_filename* - path to template file
  ```
  var userData = tmplUtils.getTemplate('user.js');
  // userData === {user_data_json}
  ```

- tmplUtils.**multiCollection(min_length, max_length)(loop_function)**<br>
  Creates an array with a random number of elements between *min_length* and *max_length*.<br>
  Single item in array is the result of *loop_function*. <br>
  *min_length* - Minimal length of items in array<br>
  *max_length* - Maximal length of items in array<br>
  *loop_function* - Function that adds a single item to an array

  ```
  var indexArray = tmplUtils.multiCollection(0, 20)(function (i) {
    return i;
  });
  // indexArray === [0, 1, 2, 3, 4, 5, 6]
  ```

  ```
  var indexArray = tmplUtils.multiCollection(1, 3)(function (i) {
    return tmplUtils.getTemplate('user.js');
  });
  // indexArray === [{user_data_json_1}, {user_data_json_2}]
  ```

---

## Known problems and limitations

- When defining multiple response status codes for a request, LocalAPI always returns the one with the smallest code number, regarldess of their order in the RAML file.
- As of now, no support RAML 1.0.
- Cannot switch from generated examples to static examples without manually editing the RAML file.


---


## Planned features and enhancements

* **Improved writing to the console**
* **Modular architecture**
* **Persistence**
* **Sample RAML generator**
* **RAML 1.0 support**
* **Support for query parameters**
* **Improved exception handling**
* **Generating documentation**

---

## License

To see LocalAPI license, go to [LICENSE.md](./docs/LICENSE.md).

---

## Changelog

To see LocalAPI changelog, go to [CHANGELOG.md](./docs/CHANGELOG.md).


[node-image]: https://img.shields.io/badge/node-v0.9.11%2B-blue.svg
[node-url]: https://www.npmjs.com/package/localapi
