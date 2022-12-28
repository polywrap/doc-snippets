import fs from "fs";
import path from "path";
import fse from "fs-extra";
import { injectSnippetsIntoFile } from "../../lib/inject";

describe("Inject tests", () => {
  describe("injectSnippetsIntoFile", () => {
    const samplesDir = path.join(__dirname, "samples");
    const tempDir = path.join(__dirname, ".temp");

    const validMdFilePath = path.join(tempDir, "valid.md");
    const eolMdFilePath = path.join(tempDir, "eol.md");
    const spaceMdFilePath = path.join(tempDir, "space.md");
    const invalidMdFilePath = path.join(tempDir, "invalid.md");

    const injectionToken = "$snippet: ";
    const altInjectionToken = "#alt-snippet: ";

    const sampleSnippets: Record<string, string> = {
      "valid-snippet": "Hello Polywrap!",
      "nonexistent-snippet": "Hello nonexistent!",
    };

    beforeEach(() => {
      fse.cpSync(samplesDir, tempDir, { recursive: true });
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true });
    });

    it("should inject snippets into a file with a valid snippet token ending in a newline", async () => {
      await injectSnippetsIntoFile(
        sampleSnippets,
        validMdFilePath,
        injectionToken
      );

      const contents = fs.readFileSync(validMdFilePath, { encoding: "utf-8" });

      expect(contents).toContain(sampleSnippets["valid-snippet"]);
      expect(contents).toContain(altInjectionToken);
      expect(contents).not.toContain(sampleSnippets["nonexistent-snippet"]);
    });

    it("should inject snippets into a file with a valid snippet token ending with a space", async () => {
      await injectSnippetsIntoFile(
        sampleSnippets,
        spaceMdFilePath,
        injectionToken
      );

      const contents = fs.readFileSync(spaceMdFilePath, { encoding: "utf-8" });

      expect(contents).toContain(sampleSnippets["valid-snippet"]);
      expect(contents).toContain("foobar");
      expect(contents).not.toContain(sampleSnippets["nonexistent-snippet"]);
    });

    it("should inject snippets into a file with a valid snippet token located at the end of the file", async () => {
      await injectSnippetsIntoFile(
        sampleSnippets,
        eolMdFilePath,
        injectionToken
      );

      const contents = fs.readFileSync(eolMdFilePath, { encoding: "utf-8" });

      expect(contents).toContain(sampleSnippets["valid-snippet"]);
      expect(contents).not.toContain(sampleSnippets["nonexistent-snippet"]);
    });

    it("should throw when an unknown snippet is found", async () => {
      expect(async () => {
        await injectSnippetsIntoFile(
          sampleSnippets,
          invalidMdFilePath,
          injectionToken
        );
      }).rejects.toThrow(
        `Unknown Snippet: invalid-snippet in ${invalidMdFilePath}`
      );
    });
  });
});
