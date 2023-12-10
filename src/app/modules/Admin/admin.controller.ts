import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const getAllAdmin = catchAsync(async (req, res) => {
  const query = req?.query;
  const result = await AdminServices.getAllAdminFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all Admin successfully",
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get single admin successfully",
    data: result,
  });
});

const deleteSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminIntoDB(id, admin);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  deleteSingleAdmin,
  updateAdmin,
};
