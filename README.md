# naive sed

![](https://i2.wp.com/www.complexsql.com/wp-content/uploads/2018/06/SED.png?ssl=1)
**This project contains the propose solution to Week 1 assignment **
The goal is to build a search command implementation

## Requiriments

- Only the substitution command is required: ✅
- Create a command line utility that accepts options and arguments: ✅
- The first argument will be the command and the second one will be the file: ✅
- Check if the file specified exists: ✅
- Check if the substitution command is valid: ✅
- Implement the -n option, which prevents a line from being printed unless specified by ‘p’: ✅
- Implement the -i [extension] which tells sed to edit the file instead of printing to the standard output : ✅
- A copy of the original should be saved in [file_name].[extension]
- Multiple substitution commands should be accepted with the -e option, with one command per -e appearance : ✅
- When the -n option appears, the line should not be printed to the standard output unless specified: ✅
- The -f [script-file] option should expect a file which consists of several lines containing one command each: ✅
- Implement the p flag which tells that the line should be printed: ✅
- Implement the g flag which tells that all occurrences of the search should be replaced on the line. By default only the first occurrence is replaced : ✅

## Remarks

##### -i [extension]

**Requiriment:** A copy of the original should be saved in [file_name].[extension]
When -i is passed a new file
**Implementation**: A new file with name [new-{file-name}].[extension] is created in the same directory, this file will contain the result of substitute commands passed, and the "original" file will be staying with its original data and name _as required_

##### Check if the file specified exists task

The implementation checks also for read, file visible to the calling process and write if specified.

##### Substitute command accepted sintaxis

The sintaxis for valid command input are:

1. The only separator character supported is: " /"
2. A command should not be wrapped in '[command]', it should be as follows: [command]
3. Regular expressions are not implemented in search field.

##### Substitute command accepted sintaxis

This implementations use files path with fs and path node core modules, so it works on any OS.
