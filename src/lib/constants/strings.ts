export function replaceHTMLChar(text: string): string {
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/\s/g, "&nbsp;");
}

export function generateSlug(input: string, length = 50): string {
  const slug = input
    .toLowerCase()
    // remove special characters
    .replace(/[^\w\s-]/g, "")
    // remove non-ASCII codes
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]+/g, "")
    // remove duplicate spaces
    .replace(/[\s]+/g, " ")
    // replace spaces with hyphens
    .replace(/[\s]/g, "-");

  return slug.slice(0, length);
}

function randomNumber(length: number): string {
  const n: number = length;
  const randomFloat: number =
    Math.random() * (9 * Math.pow(10, n - 1)) + Math.pow(10, n - 1);
  const randomInt: number = Math.floor(randomFloat);
  return randomInt.toString();
}

export function generateExerciseSlug(title: string): string {
  const slug = generateSlug(title);
  if (slug.endsWith("-")) {
    return slug + randomNumber(10);
  } else {
    return slug + "-" + randomNumber(10);
  }
}

export function adjustSpaces(input: string): string {
  return (
    input
      // reduce line breaks
      .replaceAll("\n\n\n", "\n\n")
      // convert 4 spaces to 2
      .replaceAll("    ", "  ")
      // convert tabs to spaces
      .replaceAll("\t", "  ")
  );
}
