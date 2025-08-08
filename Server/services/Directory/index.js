import { createDirectoryService } from "./createDirectoryService.js";
import { deleteDirectoryService } from "./deleteDirectoryService.js";
import { getDirectoryDataService } from "./getDirectoryDataService.js";
import { updateDirectoryDataService } from "./updateDirectoryDataService.js";

export default {
    GetDirectoryDataService: getDirectoryDataService,
    UpdateDirectoryDataService: updateDirectoryDataService,
    CreateDirectoryService: createDirectoryService,
    DeleteDirectoryService: deleteDirectoryService,
}