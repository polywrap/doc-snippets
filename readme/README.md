# doc-snippets

`doc-snippets` is a simple tool that allows you to extract and inject snippets from code into markdown files.

## Installation

Using NPM:

```bash
npm install --save-dev doc-snippets
```

Using Yarn:

```bash
yarn add -D doc-snippets
```

## Usage

### Marking and injecting

`doc-snippets` extracts and injects snippets by using tokens:

- To mark a snippet:
  - `$start: snippet-name` - The start of a snippet and its name (required)
  - `$end` - The end of a snippet.
- To inject a snippet:
  - `$snippet: snippet-name` - This gets replaced by the snippet with the given name.

### Configuration

`doc-snippets` is, by defaut, configured using a JSON file that contains a `doc-snippets` object. By default, this file is `package.json`.

The configuration object has the following structure (and default values):

```JSON
"doc-snippets": {
  "extract": {
    "include": "./**/*.{js,ts,json,yaml,txt,md,graphql,cue}",
    "ignore": "./**/node_modules/**",
    "dir": "./src"
  },
  "inject": {
    "include": "./**/*.md",
    "ignore": [],
    "dir": "./src/docs"
  },
  "startToken": "$start: ",
  "endToken": "$end",
  "injectToken": "$snippet: ",
  "outputDir": "./docs"
}
```

#### `extract` and `inject`

The `extract` and `inject` objects both have the same structure:

- `include` - a string or array of strings containing paths to include. The paths are formatted as Glob patterns following the [node-glob specification](https://github.com/isaacs/node-glob)
- `ignore` - same as `include`, this is a string or array of strings containing paths to ignore. It follows the same Glob pattern specification as `include`
- `dir` - the base directory for injection and extraction. `include` and `ignore` use this directory as their base when searching for files.

The `extract` object specifies which files will be parsed for snippets to extract.

The `inject` object specifies which files will be copied into `outputDir` and have snippets injected into them.

**Example `extract` object:**
```JSON
"extract": {
  "include": ["sample.sql", "./**/*.{js,ts}"],
  "ignore": "./**/node_modules/**",
  "dir": "./src"
}
```
In this example, `extract` will perform its search within the `./src` directory.

It will include:
- `./src/sample.sql`
- All files within `./src` and its subdirectories ending in `.js` and `.ts`

It will ignore:
- All directories and subdirectories of any `node_modules` directory found within `./src` and its subdirectories.

The same principles apply for the `inject` object.

#### `outputDir`

The `outputDir` is the output directory for the documentation injected with snippets.

### Running `doc-snippets`

`doc-snippets` comes with a CLI tool which is designed to handle most scenarios.

The CLI `combine` is the only currently supported command, and can be used as follows:

```bash
doc-snippets combine
```

The `combine` command reads a `"doc-snippets"` section from a configuration file (by default this is `package.json`) and performs snippet extraction and injection, and outputs documentation with injected snippets into an `outputDir`.

#### 'combine' command options

%snippet: combine-options

### In your own code

If you want to use `doc-snippets` programatically, it offers two exported functions:

```typescript
import { extractSnippets, injectSnippetsIntoFile } from "doc-snippets";

const searchOptions = {
  include: ["sample.sql", "./**/*.{js,ts}"],
  ignore: "./**/node_modules/**",
  dir: "./src"
}

//Returns snippets as `Record<string, string>`.
const snippets = await extractSnippets(searchOptions, "$start: ", "$end");

//Injects `snippets` into `./dest/readme.md` replacing all instances of `$snippet: snippet-name` with the appropriate snippet
await injectSnippetsIntoFile(snippets, "./dest/readme.md", "$snippet: ");
```
