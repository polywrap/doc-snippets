import path from "path";
import { extractSnippets, extractSnippetsFromFile } from "../../lib/extract";

describe("Extract tests", () => {
  const samplesDir = path.join(__dirname, "samples");

  const validTxtFilePath = path.join(samplesDir, "valid.txt");
  const invalidTxtFilePath = path.join(samplesDir, "invalid.txt");

  const validSnippets: Record<string, string> = {
    "valid-snippet": "Hello Polywrap!",
    "valid-snippet-with-comment": "Hello Comment!",
  };

  const snippetStartToken = "$start: ";
  const snippetEndToken = "$end";

  describe("extractSnippetsFromFile", () => {
    it("should extract snippets from a file", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        validTxtFilePath,
        snippetStartToken,
        snippetEndToken
      );

      expect(snippets).toStrictEqual(validSnippets);
    });

    it("should not extract snippets when the wrong extraction token is used", async () => {
      const snippets: Record<string, string> = {};

      await extractSnippetsFromFile(
        snippets,
        invalidTxtFilePath,
        snippetStartToken,
        snippetEndToken
      );

      expect(snippets).toStrictEqual({});
    });
  });

  describe("extractSnippets", () => {
    it("should extract snippets using valid search parameters", async () => {
      const snippets = await extractSnippets(
        {
          dir: samplesDir,
          include: ["./*.txt"],
          ignore: "./duplicate.txt",
        },
        snippetStartToken,
        snippetEndToken
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
          snippetStartToken,
          snippetEndToken
        );
      }).rejects.toThrow("Duplicate Snippet Definition: valid-snippet");
    });
  });
});
