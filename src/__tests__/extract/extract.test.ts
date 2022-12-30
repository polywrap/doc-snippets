import path from "path";
import { extractSnippets, extractSnippetsFromFile } from "../../lib/extract";
import { ExtractionToken } from "../../lib/types";

describe("Extract tests", () => {
  const samplesDir = path.join(__dirname, "samples");

  const validTxtFilePath = path.join(samplesDir, "valid.txt");
  const invalidTxtFilePath = path.join(samplesDir, "invalid.txt");
  const validRegularInlineTxtFilePath = path.join(
    samplesDir,
    "valid-regular-inline.txt"
  );

  const validSnippets: Record<string, string> = {
    "valid-snippet": "Hello Polywrap!",
    "valid-snippet-with-comment": "Hello Comment!",
  };

  const snippetStartToken: ExtractionToken = { pattern: "$start: " };
  const snippetEndToken: ExtractionToken = { pattern: "$end" };
  const inlineSnippetStartToken: ExtractionToken = {
    pattern: "/* $start: {SNIPPET_NAME} */",
    inline: true,
  };
  const inlineSnippetEndToken: ExtractionToken = {
    pattern: "/* $end */",
    inline: true,
  };

  describe("extractSnippetsFromFile", () => {
    it("should extract snippets from a file", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        validTxtFilePath,
        [snippetStartToken],
        [snippetEndToken]
      );

      expect(snippets).toStrictEqual(validSnippets);
    });

    it("should not extract snippets when the wrong extraction token is present in file", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        invalidTxtFilePath,
        [snippetStartToken],
        [snippetEndToken]
      );

      expect(snippets).toStrictEqual({});
    });

    it("should extract using regular tokens", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        validRegularInlineTxtFilePath,
        [snippetStartToken],
        [snippetEndToken]
      );

      expect(snippets).toHaveProperty("regular-start-regular-end");
      expect(snippets["regular-start-regular-end"]).not.toHaveLength(0);
    });

    it("should extract using inline tokens", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        validRegularInlineTxtFilePath,
        [inlineSnippetStartToken],
        [inlineSnippetEndToken]
      );

      expect(snippets).toHaveProperty("inline-start-inline-end");
      expect(snippets["inline-start-inline-end"]).not.toHaveLength(0);
    });

    it("should extract using both regular and inline tokens", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        validRegularInlineTxtFilePath,
        [snippetStartToken, inlineSnippetStartToken],
        [inlineSnippetEndToken, snippetEndToken]
      );

      const expectedSnippetNames = [
        "regular-start-regular-end",
        "regular-start-inline-end",
        "inline-start-regular-end",
        "inline-start-inline-end",
      ];

      for (const name of expectedSnippetNames) {
        expect(snippets).toHaveProperty(name);
        expect(snippets[name]).not.toHaveLength(0);
      }
    });
  });

  describe("extractSnippets", () => {
    it("should extract snippets using valid search parameters", async () => {
      const snippets = await extractSnippets(
        {
          dir: samplesDir,
          include: ["./valid.txt", "./invalid.txt"],
          ignore: "./duplicate.txt",
        },
        [snippetStartToken],
        [snippetEndToken]
      );

      expect(snippets).toStrictEqual(validSnippets);
    });

    it("should throw when duplicate snippet is encountered", async () => {
      expect(async () => {
        await extractSnippets(
          {
            dir: samplesDir,
            include: "./*.txt",
            ignore: [],
          },
          [snippetStartToken],
          [snippetEndToken]
        );
      }).rejects.toThrow("Duplicate Snippet Definition: valid-snippet");
    });
  });
});
