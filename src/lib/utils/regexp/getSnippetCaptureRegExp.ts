import { escapeRegExp } from ".";
import { ExtractionToken } from "../../types";

export function getSnippetCaptureRegExp(
  startTokens: ExtractionToken[],
  endTokens: ExtractionToken[]
): RegExp {
  return new RegExp(getSnippetCapturePattern(startTokens, endTokens), "gm");
}

const nameCapturePattern = "([\\S]+)";
const contentCapturePattern = "(?<content>[\\s\\S]+?)";
const snippetNameToken = "{SNIPPET_NAME}";

function getSnippetCapturePattern(
  startTokens: ExtractionToken[],
  endTokens: ExtractionToken[]
): string {
  return (
    getSnippetStartCapturePattern(startTokens) +
    contentCapturePattern +
    getSnippetEndCapturePattern(endTokens)
  );
}

function getSnippetStartCapturePattern(tokens: ExtractionToken[]): string {
  const capturePattern = [...tokens] // Don't mutate original array
    .sort(tokenSortingFn)
    .map((t) => getNonCapturingGroupPatternForToken(t, getStartTokenPattern))
    .join("|");

  return `(?:${capturePattern})`;
}

function getSnippetEndCapturePattern(tokens: ExtractionToken[]): string {
  const capturePattern = [...tokens] // Don't mutate original array
    .sort(tokenSortingFn)
    .map((t) => getNonCapturingGroupPatternForToken(t, getEndTokenPattern))
    .join("|");

  return `(?:${capturePattern})`;
}

// Prioritize inline snippets ahead of regular snippets inside regex group
function tokenSortingFn(token1: ExtractionToken, token2: ExtractionToken) {
  const a = token1.inline ? 0 : 1;
  const b = token2.inline ? 0 : 1;

  return a - b;
}

function getNonCapturingGroupPatternForToken(
  t: ExtractionToken,
  tokenPatternGenerationFn: (token: ExtractionToken) => string
): string {
  return `(?:${tokenPatternGenerationFn(t)})`;
}

function getStartTokenPattern(token: ExtractionToken): string {
  return token.inline
    ? getInlineStartTokenPattern(token.pattern)
    : getRegularStartTokenPattern(token.pattern);
}

function getEndTokenPattern(token: ExtractionToken): string {
  return token.inline
    ? getInlineEndTokenPattern(token.pattern)
    : getRegularEndTokenPattern(token.pattern);
}

function getRegularStartTokenPattern(token: string): string {
  return `${escapeRegExp(token)}${nameCapturePattern}.*?\\n`;
}

function getRegularEndTokenPattern(token: string): string {
  return `\\n.*?${escapeRegExp(token)}`;
}

function getInlineStartTokenPattern(token: string): string {
  const nameStartIdx = token.indexOf(snippetNameToken);
  const nameEndIdx = nameStartIdx + snippetNameToken.length;

  const tokenStart = token.substring(0, nameStartIdx);
  const tokenEnd = token.substring(nameEndIdx);

  return `${escapeRegExp(tokenStart)}${nameCapturePattern}${escapeRegExp(
    tokenEnd
  )}`;
}

function getInlineEndTokenPattern(token: string): string {
  return `${escapeRegExp(token)}`;
}
