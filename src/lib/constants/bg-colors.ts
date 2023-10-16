const bgColors = {
  css: "bg-pink-500",
  golang: "bg-sky-400",
  glossary: "bg-white",
  html: "bg-green-200",
  configs: "bg-orange-600",
};

export function getBgColor(id: string): string {
  // Check if 'id' is a valid key in 'bgColors'
  const bgColorClass = bgColors[id as keyof typeof bgColors];

  // Use a default class if 'id' is not found
  return bgColorClass || "bg-white";
}
