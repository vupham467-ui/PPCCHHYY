import { apiClient } from "../constants/api";

const UploadFileService = {
    image: async (file) => {
        const res = await apiClient.post("/Upload/image", file);
        return res.data;
    },

    file: async (fileUpload, typeFile = "fileYCTN") => {       
        const res = await apiClient.post(`/Upload/file?typeFile=${typeFile}`, fileUpload);
        return res.data;
    },

    signfile: async (fileUpload, fileName, typeFile = "fileYCTN") => {       
        const res = await apiClient.post(`/Upload/signfile?typeFile=${typeFile}&fileName=${fileName}`, fileUpload);
        return res.data;
    },

    //QLTB:
    fileQLTB_ThuHoi: async (fileUpload, typeFile = "fileQLTB_ThuHoi") => {       
        const res = await apiClient.post(`/Upload/file?typeFile=${typeFile}`, fileUpload);
        return res.data;
    },
}
export default UploadFileService;
