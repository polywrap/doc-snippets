import fs from "fs";

export async function injectSnippetsIntoFile(
  snippets: Record<string, string>,
  filePath: string
) {
  let contents = fs.readFileSync(filePath, "utf-8");
  let modified = false;
  let index = 0;

  while (index < contents.length) {
    const marker = "$snippet: ";
    const markerIdx = contents.indexOf(marker, index);

    if (markerIdx < 0) {
      index = contents.length;
      continue;
    }

    const nameStartIdx = markerIdx + marker.length;
    const nameEndIdx = contents.indexOf("\n", nameStartIdx);
    const name = contents.substring(nameStartIdx, nameEndIdx);

    if (!snippets[name]) {
      throw Error(`Unknown Snippet: ${name} in ${filePath}`);
    }

    contents = contents.replace(`${marker}${name}\n`, `${snippets[name]}\n`);
    console.log("- Inject Snippet", name, "into", filePath);

    modified = true;
    index = markerIdx + snippets[name].length;
  }

  if (modified) {
    fs.writeFileSync(filePath, contents, "utf-8");
  }
}
