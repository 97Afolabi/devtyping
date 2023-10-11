import fs from "fs";

export async function fetchSummary() {
  try {
    // Read the JSON file from the root directory
    const data = fs.readFileSync("./languages/index.json", "utf-8");
    const jsonData = JSON.parse(data);
    // const response = await fetch("./languages/index.json");
    // const data = await response.json();
    return jsonData.list;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSamples(file: string) {
  try {
    // Read the JSON file from the root directory
    const data = fs.readFileSync(`./languages/${file}.json`, "utf-8");
    const jsonData = JSON.parse(data);
    // console.log(jsonData);
    // const response = await fetch("./languages/index.json");
    // const data = await response.json();
    return jsonData;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSample(file: string, slug: string) {
  try {
    const content = await fetchSamples(file);
    return content.samples.find((item: { url: string }) => item.url === slug);
  } catch (error) {
    console.log(error);
  }
}
