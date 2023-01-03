# doc-snippets

`doc-snippets` is a simple tool that allows you to extract and inject snippets from code into markdown files.

# Installation

Using NPM:

```bash
npm install --save-dev doc-snippets
```

Using Yarn:

```bash
yarn add -D doc-snippets
```

# Usage

## Marking and injecting

`doc-snippets` extracts and injects snippets by using tokens:

- To mark a snippet:
  - `$start: snippet-name` - The start of a snippet and its name (required)
  - `$end` - The end of a snippet.
- To inject a snippet:
  - `$snippet: snippet-name` - This gets replaced by the snippet with the given name.

### The snippet name

The snippet name is a string containing **any characters except whitespace**. 

As soon as `doc-snippets` encounters any form of whitespace (space, tab, newline), the snippet name capture ends.

## Configuration

The `doc-snippets` CLI is configured using a JSON file that contains a `doc-snippets` object. By default, this file is `package.json`.

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
  "startTokens": [
    {
      "pattern": "$start: ",
      "inline": false
    }
  ],
  "endTokens": [
    {
      "pattern": "$end",
      "inline": false
    }
  ],
  "injectToken": "$snippet: ",
  "outputDir": "./docs"
}
```

### `extract` and `inject`

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

### Extraction tokens (`startTokens` and `endTokens`)

Extraction tokens mark the beginning and end of our snippets.

The tokens have two properties:
- `pattern` - the **exact string** that denotes the token
- `inline` - defines whether the token is a **regular** or **inline** extraction token

#### Regular and inline extraction tokens

By default, extraction tokens are designed to be written within their own lines. Anything else written within the token's line will be ignored when extracting snippets.

Let's take a look at an example:

```typescript
// $start: hello-snippet we can add comments here
const greeting = "Hello World!";
console.log(greeting);
// $end
```

Using the default configuration, this code will yield a snippet called `hello-snippet` with the following contents:
```
const greeting = "Hello World!";
console.log(greeting);
```

To allow for more flexible snippet extraction, we can use **inline** extraction tokens.

For example, let's configure our extraction tokens as follows:

```json
{
  //...
  "startTokens": [
    {
      "pattern": "/* #start: {SNIPPET_NAME} */",
      "inline": true
    }
  ],
  "endTokens": [
    {
      "pattern": "/* #end */",
      "inline": true
    }
  ]
}
```

Note that there is a special token within the start token's `pattern` property: **`{SNIPPET_NAME}`**. This denotes where in the inline token the snippet name will appear.

In addition, let's assume that we have a file with the following code:

```typescript
const greeting = /* #start: hello-inline-snippet */"Hello World!";
console.log(greeting);/* #end */
```

Snippet extraction would now yield a snippet named `hello-inline-snippet` with the following contents:
```
"Hello World!";
console.log(greeting);
```

Inline extraction tokens can be useful when you need to extract only part of your line.

Regular and inline extraction tokens can be used at the same time, and snippet extraction will always search for **any** end token after it encounters **any** start token.

For reference:
- When a  **regular start token** is encoutered, snippet extraction starts at the beginning of the next line.
- When an **inline start token** is encountered, snippet extraction starts immediately after the token ends.
- When a **regular end token** is encountered, snippet extraction ends at the end of the previous line.
- When an **inline end token** is encountered, snippet extraction ends at the beginning of the token.

**:warning: Regular and inline snippets containing the same substring :warning:**

If we have the following configuration for our end tokens:

```json
"endTokens": [
  {
    "pattern": "$end"
  }
  {
    "pattern": "/* $end */",
    "inline": true
  }
],
```

the `$end` regular token will **always** match before the inline `/* $end */` token due to the way Regex matching works in Javascript.

To avoid these collisions, make sure to specify inline extraction tokens which don't contain any of your regular injection tokens as exact substrings within them.

An easy remedy for the above configuration is simply replacing `/* $end */` with `/* #end */`:

```json
"endTokens": [
  {
    "pattern": "$end"
  }
  {
    "pattern": "/* #end */",
    "inline": true
  }
],
```

### `injectionToken`

The `injectionToken` is the **exact string** which will be replaced by your snippet during injection. The snippet must follow immediately after the `injectionToken`.

For example, if you have the following `injectionToken`:

```json
{
  // Note the space character at the end
  "injectionToken": "$snippet: "
}
```

the following text would be replaced by a snippet called `hello-snippet`:

```md
$snippet: hello-snippet
```

### `outputDir`

The `outputDir` is the output directory for the documentation injected with snippets.

## Running `doc-snippets`

`doc-snippets` comes with a CLI tool which is designed to handle most scenarios.

The CLI `combine` is the only currently supported command, and can be used as follows:

```bash
doc-snippets combine
```

The `combine` command reads a `"doc-snippets"` section from a configuration file (by default this is `package.json`) and performs snippet extraction and injection, and outputs documentation with injected snippets into an `outputDir`.

All configuration options can be overridden using `combine`'s command options.

### 'combine' command options

%snippet: combine-options

## In your own code

If you want to use `doc-snippets` programatically, it offers two exported functions:

```typescript
import { extractSnippets, injectSnippetsIntoFile } from "doc-snippets";

const searchOptions = {
  include: ["sample.sql", "./**/*.{js,ts}"],
  ignore: "./**/node_modules/**",
  dir: "./src",
};

//Returns snippets as `Record<string, string>`.
const startTokens = [
  {
    pattern: "$start: "
  },
  {
    pattern: "/* #start: {SNIPPET_NAME} */",
    inline: true
  }
];

const endTokens = [
  {
    pattern: "$end"
  },
  {
    pattern: "/* #end */",
    inline: true
  }
];

const snippets = await extractSnippets(searchOptions, startTokens, endTokens);

//Injects `snippets` into `./dest/readme.md` replacing all instances of `$snippet: snippet-name` with the appropriate snippet
await injectSnippetsIntoFile(snippets, "./dest/readme.md", "$snippet: ");
```
