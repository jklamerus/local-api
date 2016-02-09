# LocalAPI
<img align="right" src="./logo.jpg">
**LocalAPI** application is based on Node.js library and allows for running a fully functional API on the basis of definitions included in a raml file.
The application also generates dummy data json files from templates and serve them as a response body in API module.

In short: LocalAPI generates dummy data and runs local API based on RAML.

## Tutorial
**Check out our tutorial for LocalAPI!**
https://github.com/isaacloud/local-api/wiki/Tutorial

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


  - [Installation](#installation)
  - [Usage](#usage)
  - [Run options](#run-options)
    - [Custom port](#custom-port)
    - [Show running details](#show-running-details)
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
- Install Node.js from http://nodejs.org/
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
To run LocalAPI on a custom port use -p argument

```
localapi run raml_example_file.raml -p 3500
```

### Show running details
To run LocalAPI with additional logs (details mode) use -d argument

```
localapi run raml_example_file.raml -d
```

---
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

* **regular fake data responses for synchronous requests** (see [GET /users/:userId:](./example_raml/raml_example_file.raml) for reference)
* **empty responses** (see [POST /users](./example_raml/raml_example_file.raml) for reference)
* **responses containing data sent in the request body** (see [PUT /users/:userId:](./example_raml/raml_example_file.raml) for reference)
* **responses for PATCH requests containing fake data merged with data sent in the request body** (see [PATCH /users/:userId:](./example_raml/raml_example_file.raml) for reference)

---
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
---

## Known problems and limitations

- When defining multiple response status codes for a request, LocalAPI always returns the one with the smallest code number, regarldess of their order in the RAML file.
- As of now, no support RAML 1.0.
- Cannot switch from generated examples to static examples without manually editing the RAML file.

---

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

---

# License

To see LocalAPI license, go to [LICENSE.md](./docs/LICENSE.md).

---

---
## Changelog

Version `1.4.5`
- show message in console when chosen port is already in use - [Busy port catching](https://github.com/isaacloud/local-api/issues/4)
- added option for turning off data generation - [Add option for turning data generation on or off](https://github.com/isaacloud/local-api/issues/33)
- fixed request body parsing (when some error occurs - send error response)
- fixed bug with json-schema **$ref** keyword - now you can use schema references

Version `1.4.4`
- changed message for 'not' error
- added errors for not specified Content-Types in raml

Version `1.4.3`
- added ASCII image

Version `1.4.2`
- fixed content type check in GET requests

Version `1.4.1`
- add compatibility for draft v4
- add compatibility for request Content-Type(urlencoded, text, raw)

Version `1.4.0`

- fixed small bugs with *schema validation*
- added better node and library *error handling*
- added support for empty response body
- added support for response body to be the same as request body:
  - should be set to **false**
  - example in *raml_example_file.raml* **PUT /users/:id**
- added support for **PATCH** method

Version `1.3.6`
- fixed bug with baseUri and added support for api versioning

Version `1.3.5`
- added default Content-Type for respones

Version `1.3.4`
- all data types in the request body supported
- improved handling for status codes fos success responses
- fixed json-schema validation issue

Version `1.3.0`
- added commander.js library for better CLI usage
- reorganised run commands
- hidden unnecessary logs on app start
- added 'details mode' which shows all logs on app start (-d argument)
- reorganised logs

Version `1.2.3`
- added a possibility to run an application on a custom port (-p argument)

Version `1.2.2`
- added support for custom headers in response

Version `1.2.1`
- fixed method that gets content-type of request

Version `1.2.0`
- changed path for json-schema for POST and PUT validation (consistent with the RAML documentation now)
```
before: put/post -> responses -> {code} -> body -> {contentType} -> schema
now: put/post -> body -> {contentType} -> schema
```
- modified example_raml
- fixed merge of objects (example + request body) for response

Version `1.1.1`
- modified and registered the application as global in npm repository
- changed the color of logs
- added feature: make dir 'examples' if does not exist
- a lot of small fixes
