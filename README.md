# doc-snippets
Doc-snippets is a simple tool that allows you to extract and inject snippets from code into markdown files.

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

Exported functions:

```typescript
extractSnippets(dir: string) //Returns a `Record<string, string>` of all snippets found within `dir`.

injectSnippets(snippets: Record<string, string>, dir: string) //Injects `snippets` into .md files found inside `dir`
```

```
polywrap-snippet-tools combine <snippetsDir> <docsDir> <outputDir>

# Example used within the documentation package
# Extracts snippets from ./snippets and outputs a copy of ./src/docs into ./docs with injected snippets
polywrap-snippet-tools combine ./snippets ./src/docs ./docs
```