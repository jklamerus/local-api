Version `1.4.6-beta.0`
- updated Faker.js to 3.0.1

Version `1.4.5`
- message shown in console when the chosen port is already in use - [Busy port catching](https://github.com/isaacloud/local-api/issues/4)
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
