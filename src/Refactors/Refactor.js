import { StatusCodes } from "http-status-codes";
import { ApiFeatures } from "../utils/AppFeatures.js";

//model as argument
export const getallApiFeatures = (Model) => {
  return async (req, res, next) => {
    let apiFeatures = new ApiFeatures(Model.find(), req.query)
      .pagination()
      .filter()
      .selectedFields()
      .search()
      .sort();
    

    let result = await apiFeatures.mongooseQuery;
    //get totalcounts
    const counts = await apiFeatures.getCounts();
    const metaData = {
      page: apiFeatures.page,
      totalDocuments: counts.totalDocuments,
      totalPages: counts.totalPages,
    };
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: "Done", metaData, result });
  };
};