const bgColors = {
  configs: "hover:bg-orange-600",
  css: "hover:bg-pink-500",
  glossary: "hover:bg-white",
  golang: "hover:bg-sky-400",
  html: "hover:bg-green-200",
  php: "hover:bg-purple-500",
  python: "hover:bg-yellow-300",
};

export function getBgColor(id: string): string {
  // Check if 'id' is a valid key in 'bgColors'
  const bgColorClass = bgColors[id as keyof typeof bgColors];

  // Use a default class if 'id' is not found
  return bgColorClass || "bg-white";
}
