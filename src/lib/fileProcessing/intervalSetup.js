import { fileModel } from "../db/models.js";
import { processFile } from "./fileProcessing.js";
import connectMongo from "../db/config.js";
import { join } from "path";
import { config } from "dotenv";

config({path:"../../../.env"});

const filesAtATimeEnv = process.env.FILES_CHECK_AT_A_TIME
const intervalRepeatTime = parseInt(process.env.INTERVAL_REPEAT_TIME)

let hasRun = false;
let processingInterval = null;
const filesAtATime = parseInt(filesAtATimeEnv, 10);

const processPendingFiles = async () => {
  await connectMongo();
  try {
    const processingFiles = await fileModel.find({ status: "processing" });
    console.log(processingFiles)
    if (processingFiles.length >= filesAtATime) {
      console.log("Limit reached. Skipping processing.");
      return; // Limit reached
    }

    const pendingFile = await fileModel.findOne({ status: "pending" });

    if (!pendingFile) {
      console.log("No pending file found.");
      return;
    }

    const userDirectory = join(
      "../../../../file-server-handler/uploads",
      pendingFile.owner.toString()
    );

    console.log(`Processing file: ${pendingFile.filename}` , userDirectory);
    await processFile(
      pendingFile._id,
      pendingFile.filePath,
      pendingFile.filePath,
      pendingFile.filename,
      pendingFile.extentionName
    );

    console.log(
      `Processing complete for file: ${
        (pendingFile.filename, pendingFile.extentionName)
      }`
    );
  } catch (error) {
    console.error("Error during file processing:", error);
  }
};

const startProcessingInterval = () => {
  if (hasRun) {
    console.log("Processing function has already been executed.");
    return; // Prevent further execution
  }

  hasRun = true;

  if (processingInterval) {
    console.log("Processing interval already running.");
    return; // Interval already running
  }

  processingInterval = setInterval(() => {
    console.log("Checking for pending files...");
    processPendingFiles();
  }, 1000 * intervalRepeatTime); 

  console.log("Processing interval started.");
};

export { startProcessingInterval };
