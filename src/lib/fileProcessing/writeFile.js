import * as XLSX from "xlsx";
import { writeFile } from "fs/promises";
import { dirname, join } from "path";

export async function saveResTitles(
  titles,
  userDirectory,
  filename,
) {
  try {
    const worksheetData = [
      ["callerIDs", "status"],
      ...titles.map((title) => [title.callerId, title.status]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    const filenameParts = filename.split(".");

    filenameParts.splice(1, 0, "_Completed.");

    const completedFileName = filenameParts.join("");
    const userDir = dirname(userDirectory)
    const filePathRes = join(userDir, completedFileName);

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    
    await writeFile(filePathRes, buffer);

    return filePathRes;
  } catch (error) {
    console.error("Error saving file:", error);
    return null;
  }
}
