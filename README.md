<img align="right" height="250" src="./docs/logo/logo.png">
# LocalAPI

[![Node Version][node-image]][node-url]

**LocalAPI** application is based on Node.js library and allows for running a fully functional API on the basis of definitions included in a raml file.
The application also generates dummy data json files from templates and serve them as a response body in API module.

In short: LocalAPI generates dummy data and runs local API based on RAML.

## Tutorial
**Check out our wiki and tutorial for LocalAPI!**

* [How it works?](https://github.com/isaacloud/local-api/wiki/How-it-works%3F)
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
    - [Directory structure](#directory-structure)
    - [Supported responses](#supported-responses)
  - [Dummy data generator](#dummy-data-generator)
    - [Information](#information)
    - [How to](#how-to)
    - [Example RAML directory](#example-raml-directory)
    - [Methods for template generator§§](#methods-for-template-generator%C2%A7%C2%A7)
  - [Known problems and limitations](#known-problems-and-limitations)
  - [Planned features and enhancements](#planned-features-and-enhancements)
- [License](#license)
- [Changelog](#changelog)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

- Install Node.js from http://nodejs.org/, version 0.9.11 or higher
- Install LocalAPI module via npm

```
npm install -g localapi
```

## Usage
- Create a RAML directory with [specified structure](#raml-directory-structure)
- Enter the RAML directory

```
cd example_raml
```

- Run LocalAPI by command

```
localapi run {YOUR_RAML_FILENAME}.raml
```

Substitute `{YOUR_RAML_FILENAME}.raml` with your raml filename. Example:

```
localapi run raml_example_file.raml
```

- Wait a moment while the raml file is loaded and json files with dummy data are generated. The following information will show:

```
info: [localapi] App running at http:/0.0.0.0:3333
```

- LocalAPI will run at http://127.0.0.1:3333/


## Run options

### Custom port
To run LocalAPI on a custom port use `-p` argument

```
localapi run raml_example_file.raml -p 3500
```

### Show running details
To run LocalAPI with additional logs (details mode) use `-d `argument

```
localapi run -d raml_example_file.raml
```

### Use static examples
To run LocalAPI with your own predefined examples (not generated from templates), use `--no-examples` argument

```
localapi run --no-examples raml_example_file.raml
```


## RAML 

### Directory structure

- [dir] assets - additional files
- [dir] examples - dummy data json files (generated from templates)
- [dir] static_examples - dummy data json files (static)
- [dir] schemas - json schemas
- [dir] templates - dummy data templates for [generator](#dummy-data-generator)
- {YOUR_RAML_FILENAME}.RAML - raml file

See [Example RAML directory](example_raml) with generated json files.




### Supported responses

LocalAPI supports:

* **regular fake data responses for synchronous GET requests** 
  Specify the response example for a GET request as a JSON file/object/array. (See [GET /users/:userId:](./example_raml/raml_example_file.raml) for reference.)

  ```
  get:
    responses:
      200:
        body:
          application/json:
            schema: !include schemas/users.json
            example: !include examples/users.json
  ```


* **responses containing fake data merged with data sent in the body of POST, PUT, PATCH requests** 
  Specify the response example for a POST, PUT or PATCH request as a JSON file/object/array. (See [PATCH /users/:userId:](./example_raml/raml_example_file.raml) for reference.)

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


* **responses containing only data sent in the body of a POST, PUT, PATCH request** 
  Specify the response example for a POST, PUT or PATCH request as `false`. (See [PUT /users/:userId:](./example_raml/raml_example_file.raml) for reference.)

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


* **empty responses** 
  Enter an empty string (`example: ""`) as a response example for GET, POST, PUT, PATCH and DELETE requests. (See [POST /users](./example_raml/raml_example_file.raml) for reference.)

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





## Dummy data generator

### Information
Template location: `/templates`<br />
Template format: `*.js`<br />
Example data is generated every time LocalAPI starts.<br />
**TIP** - [Faker.js](https://github.com/marak/Faker.js/) library is available to use.

### How to
1. Create required directories with the structure shown in [RAML directory structure](#directory-structure)
2. Create javascript files with templates in `/templates` directory ([see example](#raml)).
3. Run LocalAPI to generate json files ([see Usage](#usage))

### Example RAML directory
See [Example RAML directory](./example_raml) with generated json files.

### Methods for template generator§§
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


## Known problems and limitations

- When defining multiple response status codes for a request, LocalAPI always returns the one with the smallest code number, regarldess of their order in the RAML file.
- As of now, no support RAML 1.0.
- Cannot switch from generated examples to static examples without manually editing the RAML file.



## Planned features and enhancements

* **Improved writing to the console**
Better outputting information about requests and errors to the console. There will also be a possibility to generate log files with all requests made to the service.

* **Modular architecture**
Refactoring of the application architecture to make it more modular. A possibility to support plugin provided by external developers will also be provided. (An example of such an add-on is support for storing data in databases, not only in files, as is currently the case.)

* **Persistence**
Support for persisting results of operations made objects via the service. A user object created by sending a POST request to `/users` will be saved and retrieved upon a GET request.

* **Sample RAML generator**
A simple RAML file generator to accelerate a newcomer's adoption of LA and smooth out the process of adding a required API structure. The process of creating a sample API will require entering a simple command in the command line, such as `localapi gen-example`.

* **RAML 1.0 support**
Support for the RAML standard in its newest, 1.0 version. Considering its current, beta version, the schedule for this feature has not been established yet.

* **Support for query parameters**
Traits defined in a RAML can modify requests made to an API – narrow down the number of results returned, display them in a specified sort order, etc. Query parameters will also find their way to future releases.

* **Improved exception handling**
Future releases will provide for improved exception handling, for example, when a given port is already bound by an instance of the service running and we want to launch the second instance on the same port.

* **Generating documentation**
Generating simple documentation of the mock API in the HTML format is also taken into consideration in long-distance plans of the LA team.



# License

To see LocalAPI license, go to [LICENSE.md](./docs/LICENSE.md).



# Changelog

To see LocalAPI changelog, go to [CHANGELOG.md](./docs/CHANGELOG.md).


[node-image]: https://img.shields.io/badge/node-v0.9.11%2B-blue.svg
[node-url]: https://www.npmjs.com/package/localapi