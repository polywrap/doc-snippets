import { escapeRegExp, snippetNameCapturePattern } from ".";

export function getInjectionTokenCaptureRegExp(injectionToken: string): RegExp {
  const pattern = escapeRegExp(injectionToken) + snippetNameCapturePattern;

  return new RegExp(pattern, "m");
}
