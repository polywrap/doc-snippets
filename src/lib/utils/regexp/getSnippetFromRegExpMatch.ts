import { Snippet } from "../../types";

/* 
The last item in the match array is always the content of the snippet, as it's the last group.
ES still doesn't support duplicate group names.
Thus, we have to search for the 1st non-undefined array item after match[0] and before match[match.length - 1], which is our name.

This will be doable using group names once https://github.com/tc39/ecma262/pull/2721 is accepted and implemented into ES.
*/
export function getSnippetFromRegExpMatch(match: RegExpMatchArray): Snippet {
  const contents = match[match.length - 1];

  for (let i = 1; i < match.length - 1; i++) {
    if (match[i] !== undefined) {
      return {
        contents: contents,
        name: match[i],
      };
    }
  }

  // Ignore line in code coverage - it should never be run
  /* istanbul ignore next */
  throw "Could not extract snippet name from RegExp match! This should never happen.";
}
