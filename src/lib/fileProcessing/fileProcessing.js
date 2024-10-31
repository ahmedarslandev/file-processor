import { fileModel } from "../db/models.js";
import { readXlsxFile } from "./readFile.js";
import axios from "axios";
import { config } from "dotenv";

config();

const filesAtATimeEnv = process.env.FILES_CHECK_AT_A_TIME;
const processFileUrl = process.env.PROCESS_FILE_URL;
export async function processFile(dbFileId, filePath) {
  try {
    const filesAtATime = parseInt(filesAtATimeEnv);

    const dbFile = await fileModel.findOne({ _id: dbFileId });
    const filesInProcessing = await fileModel.find({ status: "processing" });

    if (filesInProcessing.length >= filesAtATime) {
      console.log("Limit reached");
      return "limit reached";
    }

    if (dbFile.status == "pending") {
      dbFile.status = "processing";
      await dbFile.save();

      const callerIds = readXlsxFile(filePath);
      if (!callerIds) {
        dbFile.status = "failed";
        await dbFile.save();
        return "failed";
      }

      axios.post(processFileUrl, {
        callerIds,
        fileInfo: dbFile,
      });

      return "success";
    }

    return "File already checked";
  } catch (error) {
    console.log("PATH ERROR", error.message);
    return null;
  }
}
