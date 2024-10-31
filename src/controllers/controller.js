import { fileModel } from "../lib/db/models.js";
import { saveResTitles } from "../lib/fileProcessing/writeFile.js";

class Routes {
  receiveCallerIds = async (request, response) => {
    try {
      const data = await request.body;

      if (!data.callerIds) {
        return;
      }

      const callerIds = data.callerIds;
      const file = await fileModel.findById(data.fileInfo._id);

      if (!file) {
        return;
      }

      await saveResTitles(
        callerIds,
        file.filePath,
        file.filename,
        file.extentionName
      );
      file.status = "completed";
      await file.save();
      console.log("File saved successfully");

      return;
    } catch (error) {
      console.error(error);
    }
  };
}

const { receiveCallerIds } = new Routes();

export { receiveCallerIds };
