using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using APIPCHY.Helpers;
using QLTB_API.Models.QUAN_TRI.DM_DONVI;
using QLTB_API.Models.QUAN_TRI.HT_MENU;
using APIPCHY_PhanQuyen.Services;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;
using QLTB_API.Helpers;
using QLTB_API.Models.Common;

namespace QLTB_API.Models.QUAN_TRI.HT_NGUOIDUNG
{
    public class HT_NGUOIDUNG_Manager
    {

        private readonly IConfiguration _configuration; // Thêm biến cấu hình

        public HT_NGUOIDUNG_Manager(IConfiguration configuration)
        {
            _configuration = configuration; // Khởi tạo biến cấu hình
        }

        DataHelper helper = new DataHelper();

        DataHelper helper_QLTB = new DataHelper(DbConnectionType.QLTB);

        private string secret;

        public HT_NGUOIDUNG_Model login_HT_NGUOIDUNG(string username, string password, bool needCheckPass)
        {
            try
            {
                DataTable ds = helper.ExcuteReader("PKG_QLTB_QUANTRI.login_HT_NGUOIDUNG", "p_TEN_DANG_NHAP", username);
                if (ds == null || ds.Rows.Count == 0)
                {
                        
                    return null;

                }
                else
                {
                    HT_NGUOIDUNG_Model user = new HT_NGUOIDUNG_Model();

                    user.id = ds.Rows[0]["ID"] != DBNull.Value ? ds.Rows[0]["ID"].ToString() : null;
                    user.dm_donvi_id = ds.Rows[0]["DM_DONVI_ID"] != DBNull.Value ? ds.Rows[0]["DM_DONVI_ID"].ToString() : null;
                    user.ten_donvi = ds.Rows[0]["TEN"] != DBNull.Value ? ds.Rows[0]["TEN"].ToString() : null;
                    user.dm_phongban_id = ds.Rows[0]["DM_PHONGBAN_ID"] != DBNull.Value ? ds.Rows[0]["DM_PHONGBAN_ID"].ToString() : null;
                    user.ten_phongban = ds.Rows[0]["TEN_PB"] != DBNull.Value ? ds.Rows[0]["TEN_PB"].ToString() : null;
                    user.dm_kieucanbo_id = ds.Rows[0]["DM_KIEUCANBO_ID"] != DBNull.Value ? ds.Rows[0]["DM_KIEUCANBO_ID"].ToString() : null;
                    user.dm_chucvu_id = ds.Rows[0]["DM_CHUCVU_ID"] != DBNull.Value ? ds.Rows[0]["DM_CHUCVU_ID"].ToString() : null;
                    user.ten_dang_nhap = ds.Rows[0]["TEN_DANG_NHAP"] != DBNull.Value ? ds.Rows[0]["TEN_DANG_NHAP"].ToString() : null;
                    user.mat_khau = null;
                    user.ho_ten = ds.Rows[0]["HO_TEN"] != DBNull.Value ? ds.Rows[0]["HO_TEN"].ToString() : null;
                    user.email = ds.Rows[0]["EMAIL"] != DBNull.Value ? ds.Rows[0]["EMAIL"].ToString() : null;
                    user.ldap = ds.Rows[0]["LDAP"] != DBNull.Value ? ds.Rows[0]["LDAP"].ToString() : null;
                    user.trang_thai = ds.Rows[0]["TRANG_THAI"] != DBNull.Value ? int.Parse(ds.Rows[0]["TRANG_THAI"].ToString()) : null;
                    user.so_dien_thoai = ds.Rows[0]["SO_DIEN_THOAI"] != DBNull.Value ? ds.Rows[0]["SO_DIEN_THOAI"].ToString() : null;
                    user.gioi_tinh = ds.Rows[0]["GIOI_TINH"] != DBNull.Value ? int.Parse(ds.Rows[0]["GIOI_TINH"].ToString()) : null;
                    user.so_cmnd = ds.Rows[0]["SO_CMND"] != DBNull.Value ? ds.Rows[0]["SO_CMND"].ToString() : null;
                    user.dm_donvi_lamviec_id = ds.Rows[0]["DM_DONVI_LAMVIEC_ID"] != DBNull.Value ? ds.Rows[0]["DM_DONVI_LAMVIEC_ID"].ToString() : null;
                    user.ht_vaitro_id = ds.Rows[0]["HT_VAITRO_ID"] != DBNull.Value ? ds.Rows[0]["HT_VAITRO_ID"].ToString() : null;
                    user.hrms_type = ds.Rows[0]["HRMS_TYPE"] != DBNull.Value ? int.Parse(ds.Rows[0]["HRMS_TYPE"].ToString()) : null;
                    user.sign_type = ds.Rows[0]["sign_type"] != DBNull.Value ? int.Parse(ds.Rows[0]["sign_type"].ToString()) : null;
                    user.sign_image = ds.Rows[0]["SIGN_IMAGE"] != DBNull.Value ? ds.Rows[0]["SIGN_IMAGE"].ToString() : null;
                    //user.anhchukynhay = ds.Rows[0]["ANHCHUKYNHAY"] != DBNull.Value ? ds.Rows[0]["ANHCHUKYNHAY"].ToString() : null;
                    user.roleid = ds.Rows[0]["ROLEID"] != DBNull.Value ? ds.Rows[0]["ROLEID"].ToString() : null;
                    user.phong_ban = ds.Rows[0]["PHONG_BAN"] != DBNull.Value ? ds.Rows[0]["PHONG_BAN"].ToString() : null;
                    //user.anhdaidien = ds.Rows[0]["ANHDAIDIEN"] != DBNull.Value ? ds.Rows[0]["ANHDAIDIEN"].ToString() : null;
                    user.ma_dviqly = ds.Rows[0]["MA_DVIQLY"] != DBNull.Value ? ds.Rows[0]["MA_DVIQLY"].ToString() : null;
                    user.sign_alias = ds.Rows[0]["SIGN_ALIAS"] != DBNull.Value ? ds.Rows[0]["SIGN_ALIAS"].ToString() : null;
                    //user.value_token = ds.Rows[0]["VALUE_TOKEN"] != DBNull.Value ? ds.Rows[0]["VALUE_TOKEN"].ToString() : null;
                    user.ds_donvi = new DM_DONVI_Manager().get_All_DM_DONVI_ByMADVIQLY(user.ma_dviqly);
                    user.ma_nvien_cmis = ds.Rows[0]["MA_NVIEN_CMIS"] != DBNull.Value ? ds.Rows[0]["MA_NVIEN_CMIS"].ToString() : null;
                    user.tao_phieu = ds.Rows[0]["TAO_PHIEU"] != DBNull.Value ? ds.Rows[0]["TAO_PHIEU"].ToString() : null;
                    user.is_admin = ds.Rows[0]["IS_ADMIN"] != DBNull.Value ? ds.Rows[0]["IS_ADMIN"].ToString() : null;
                    user.ds_quyen = ds.Rows[0]["ds_quyen"] != DBNull.Value ? ds.Rows[0]["ds_quyen"].ToString() : null;

                    //Ảnh đại diện mới:
                    var avatarPath = ds.Rows[0]["image_path"] != DBNull.Value
                    ? ds.Rows[0]["image_path"].ToString()
                    : null;

                    user.anhdaidien = ImageUrlHelper.BuildUserAvatarUrl(
                        avatarPath,
                        _configuration["ApiBaseUrl"]
                    );

                    List<string> allowedMenus = get_allowedMenusByUserName(username);

                    user.allowedMenus = allowedMenus;

                    //TokenService tokenService = new TokenService(_configuration);
                    //string token = tokenService.GenerateJwtToken(user);
                    user.token = "";

                    if (needCheckPass) {
                        string passFromDB = ds.Rows[0]["MAT_KHAU"] != DBNull.Value ? ds.Rows[0]["MAT_KHAU"].ToString() : null;

                        if (!PasswordHasher.VerifyHashedString(passFromDB, password))
                        {
                            return null;
                        }
                    }
                    return user;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<HTNguoiDungDTO> GET_HT_NGUOIDUNG(int pageIndex, int pageSize, out long total)
        {
            List<HTNguoiDungDTO> result = new List<HTNguoiDungDTO>();

            using (OracleConnection cn = new ConnectionOracle().getConnectionQLTB())
            {
                cn.Open();
                try
                {
                    OracleCommand cmd = new OracleCommand();
                    cmd.Connection = cn;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = @"PKG_QLTB_QUANTRI.get_ALL_NGUOIDUNG";

                    cmd.Parameters.Add("p_pageIndex", OracleDbType.Int32).Value = pageIndex;
                    cmd.Parameters.Add("p_pageSize", OracleDbType.Int32).Value = pageSize;

                    cmd.Parameters.Add("p_getDB", OracleDbType.RefCursor).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("p_totalRecords", OracleDbType.Int32).Direction = ParameterDirection.Output;

                    OracleDataAdapter dap = new OracleDataAdapter(cmd);
                    DataSet ds = new DataSet();
                    dap.Fill(ds);

                    // Xử lý dữ liệu phân trang
                    if (ds.Tables.Count > 0)
                    {
                        foreach (DataRow dr in ds.Tables[0].Rows)
                        {
                            HTNguoiDungDTO user = new HTNguoiDungDTO
                            {
                                ID = dr["ID"].ToString(),
                                DM_DONVI_ID = dr["DM_DONVI_ID"].ToString(),
                                DM_PHONGBAN_ID = dr["DM_PHONGBAN_ID"].ToString(),
                                DM_CHUCVU_ID = dr["DM_CHUCVU_ID"].ToString(),
                                TEN_DANG_NHAP = dr["TEN_DANG_NHAP"].ToString(),
                                MAT_KHAU = dr["MAT_KHAU"].ToString(),
                                HO_TEN = dr["HO_TEN"].ToString(),
                                EMAIL = dr["EMAIL"].ToString(),
                                LDAP = dr["LDAP"].ToString(),
                                TRANG_THAI = dr["TRANG_THAI"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["TRANG_THAI"]),
                                NGAY_TAO = dr["NGAY_TAO"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["NGAY_TAO"]),
                                NGUOI_TAO = dr["NGUOI_TAO"].ToString(),
                                NGAY_CAP_NHAT = dr["NGAY_CAP_NHAT"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(dr["NGAY_CAP_NHAT"]),
                                NGUOI_CAP_NHAT = dr["NGUOI_CAP_NHAT"].ToString(),
                                SO_DIEN_THOAI = dr["SO_DIEN_THOAI"].ToString(),
                                GIOI_TINH = dr["GIOI_TINH"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["GIOI_TINH"]),
                                SO_CMND = dr["SO_CMND"].ToString(),
                                TRANG_THAI_DONG_BO = dr["TRANG_THAI_DONG_BO"] == DBNull.Value ? (int?)null : Convert.ToInt32(dr["TRANG_THAI_DONG_BO"]),
                                ROLEID = dr["ROLEID"].ToString(),
                                PHONG_BAN = dr["PHONG_BAN"].ToString(),
                                ANHDAIDIEN = dr["ANHDAIDIEN"].ToString()
                            };

                            result.Add(user);
                        }
                    }

                    // Lấy tổng số bản ghi
                    var totalRecord = Convert.ToInt64(cmd.Parameters["p_totalRecords"].Value.ToString());
                    total = (long)Math.Ceiling((double)totalRecord / pageSize);
                }
                catch (Exception ex)
                {
                    throw new Exception("An error occurred while fetching data.", ex);
                }
            }

            return result;
        }


        //them nguoi dung
        public InsertResult<HT_NGUOIDUNG_Model> Insert_QLTB_NGUOI_DUNG(HT_NGUOIDUNG_Model data)
        {
            string strErr = "";
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn;
            OracleTransaction transaction;
            transaction = cn.BeginTransaction();
            cmd.Transaction = transaction;

            try
            {
                string hashPassword = PasswordHasher.HashString(data.mat_khau);
                cmd.Parameters.Clear();
                cmd.Connection = cn;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.insert_HT_NGUOIDUNG";
                cmd.Parameters.Add("p_ID", OracleDbType.Varchar2).Value = Guid.NewGuid().ToString();
                cmd.Parameters.Add("p_DM_DONVI_ID", OracleDbType.Varchar2).Value = data.dm_donvi_id;
                cmd.Parameters.Add("p_DM_PHONGBAN_ID", OracleDbType.Varchar2).Value = data.dm_phongban_id;
                cmd.Parameters.Add("p_DM_KIEUCANBO_ID", OracleDbType.Varchar2).Value = data.dm_kieucanbo_id;
                cmd.Parameters.Add("p_DM_CHUCVU_ID", OracleDbType.Varchar2).Value = data.dm_chucvu_id;
                cmd.Parameters.Add("p_TEN_DANG_NHAP", OracleDbType.Varchar2).Value = data.ten_dang_nhap;
                cmd.Parameters.Add("p_MAT_KHAU", OracleDbType.Varchar2).Value = hashPassword;
                cmd.Parameters.Add("p_HO_TEN", OracleDbType.Varchar2).Value = data.ho_ten;
                cmd.Parameters.Add("p_EMAIL", OracleDbType.Varchar2).Value = data.email;
                cmd.Parameters.Add("p_LDAP", OracleDbType.Varchar2).Value = data.ldap;
                cmd.Parameters.Add("p_TRANG_THAI", OracleDbType.Int32).Value = data.trang_thai;
                cmd.Parameters.Add("p_NGAY_TAO", OracleDbType.Date).Value = data.ngay_tao != DateTime.MinValue ? (object)data.ngay_tao : DBNull.Value;
                cmd.Parameters.Add("p_NGUOI_TAO", OracleDbType.Varchar2).Value = data.nguoi_tao;
                cmd.Parameters.Add("p_NGAY_CAP_NHAT", OracleDbType.Date).Value = data.ngay_cap_nhat != DateTime.MinValue ? (object)data.ngay_cap_nhat : DBNull.Value;
                cmd.Parameters.Add("p_NGUOI_CAP_NHAT", OracleDbType.Varchar2).Value = data.nguoi_cap_nhat;
                cmd.Parameters.Add("p_SO_DIEN_THOAI", OracleDbType.Varchar2).Value = data.so_dien_thoai;
                cmd.Parameters.Add("p_GIOI_TINH", OracleDbType.Int32).Value = data.gioi_tinh;
                cmd.Parameters.Add("p_SO_CMND", OracleDbType.Varchar2).Value = data.so_cmnd;
                cmd.Parameters.Add("p_TRANG_THAI_DONG_BO", OracleDbType.Int32).Value = data.trang_thai_dong_bo;
                cmd.Parameters.Add("p_DB_TAIKHOANDANGNHAP", OracleDbType.Varchar2).Value = data.db_taikhoandangnhap;
                cmd.Parameters.Add("p_DB_NGAY", OracleDbType.Date).Value = data.db_ngay != DateTime.MinValue ? (object)data.db_ngay : DBNull.Value;
                cmd.Parameters.Add("p_DM_DONVI_LAMVIEC_ID", OracleDbType.Varchar2).Value = data.dm_donvi_lamviec_id;
                cmd.Parameters.Add("p_HT_VAITRO_ID", OracleDbType.Varchar2).Value = data.ht_vaitro_id;
                cmd.Parameters.Add("p_SIGN_ALIAS", OracleDbType.Varchar2).Value = data.sign_alias;
                cmd.Parameters.Add("p_SIGN_USERNAME", OracleDbType.Varchar2).Value = data.sign_username;
                cmd.Parameters.Add("p_SIGN_PASSWORD", OracleDbType.Varchar2).Value = data.sign_password;
                //cmd.Parameters.Add("p_HRMS_TYPE", OracleDbType.Int32).Value = data.hrms_type; // Đảm bảo giá trị là số nguyên
                cmd.Parameters.Add("p_SIGN_TYPE", OracleDbType.Int32).Value = data.sign_type; // Đảm bảo giá trị là số nguyên
                cmd.Parameters.Add("p_SIGN_IMAGE", OracleDbType.Varchar2).Value = data.sign_image;
                cmd.Parameters.Add("p_ANHCHUKYNHAY", OracleDbType.Varchar2).Value = data.anhchukynhay;
                cmd.Parameters.Add("p_ROLEID", OracleDbType.Varchar2).Value = data.roleid;
                cmd.Parameters.Add("p_PHONG_BAN", OracleDbType.Varchar2).Value = data.phong_ban;
                cmd.Parameters.Add("p_ANHDAIDIEN", OracleDbType.Varchar2).Value = data.anhdaidien;
                cmd.Parameters.Add("p_VALUE_TOKEN", OracleDbType.Varchar2).Value = data.value_token;
                cmd.Parameters.Add("p_Error", OracleDbType.Varchar2, 4000).Direction = ParameterDirection.Output;

                cmd.ExecuteNonQuery();
                //transaction.Commit();

                string errorOutput = cmd.Parameters["p_Error"].Value.ToString();

                return new InsertResult<HT_NGUOIDUNG_Model>
                {
                    data = data,
                    p_Error = errorOutput
                };
            }


            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }


        //get by id nguoi dung
        public HTNguoiDungDTO GETDATA_DM_NGUOIDUNG_byID(string Id)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            try
            {
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                OracleDataAdapter dap = new OracleDataAdapter();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.get_HT_NGUOIDUNG_byID";
                cmd.Parameters.Add("p_ID", Id);
                cmd.Parameters.Add("p_getDB", OracleDbType.RefCursor).Direction = ParameterDirection.Output;
                dap.SelectCommand = cmd;
                DataSet ds = new DataSet();
                dap.Fill(ds);
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }


                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    DataRow dr = ds.Tables[0].Rows[0];
                    HTNguoiDungDTO result = new HTNguoiDungDTO
                    {
                        ID = dr["ID"].ToString(),
                        TEN_DON_VI = dr["TEN_DON_VI"].ToString(),
                        TEN_PHONG_BAN = dr["TEN_PHONG_BAN"].ToString(),
                        TEN_CHUC_VU = dr["TEN_CHUC_VU"].ToString(),
                        TEN_DANG_NHAP = dr["TEN_DANG_NHAP"].ToString(),
                        HO_TEN = dr["HO_TEN"].ToString(),
                        EMAIL = dr["EMAIL"].ToString(),
                        LDAP = dr["LDAP"].ToString(),
                        TRANG_THAI = dr["TRANG_THAI"] != DBNull.Value ? Convert.ToInt32(dr["TRANG_THAI"]) : (int?)null,
                        NGAY_TAO = dr["NGAY_TAO"] != DBNull.Value ? Convert.ToDateTime(dr["NGAY_TAO"]) : (DateTime?)null,
                        NGUOI_TAO = dr["NGUOI_TAO"].ToString(),
                        NGAY_CAP_NHAT = dr["NGAY_CAP_NHAT"] != DBNull.Value ? Convert.ToDateTime(dr["NGAY_CAP_NHAT"]) : (DateTime?)null,
                        NGUOI_CAP_NHAT = dr["NGUOI_CAP_NHAT"].ToString(),
                        SO_DIEN_THOAI = dr["SO_DIEN_THOAI"].ToString(),
                        GIOI_TINH = dr["GIOI_TINH"] != DBNull.Value ? Convert.ToInt32(dr["GIOI_TINH"]) : (int?)null,
                        TRANG_THAI_DONG_BO = dr["TRANG_THAI_DONG_BO"] != DBNull.Value ? Convert.ToInt32(dr["TRANG_THAI_DONG_BO"]) : (int?)null,
                        DB_TAIKHOANDANGNHAP = dr["DB_TAIKHOANDANGNHAP"].ToString(),
                        DB_NGAY = dr["DB_NGAY"] != DBNull.Value ? Convert.ToDateTime(dr["DB_NGAY"]) : (DateTime?)null,
                        DM_DONVI_LAMVIEC_ID = dr["DM_DONVI_LAMVIEC_ID"].ToString(),
                        HT_VAITRO_ID = dr["HT_VAITRO_ID"].ToString(),
                        MA_NVIEN_CMIS = dr["MA_NVIEN_CMIS"].ToString(),
                    };

                    return result;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }
        //Lấy chi tiết 
        public HT_NGUOIDUNG_Model GET_DM_NGUOIDUNG_byID(string Id)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            try
            {
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                OracleDataAdapter dap = new OracleDataAdapter();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.get_HT_NGUOIDUNGByID";
                cmd.Parameters.Add("p_ID", Id);
                cmd.Parameters.Add("p_getDB", OracleDbType.RefCursor).Direction = ParameterDirection.Output;
                dap.SelectCommand = cmd;
                DataSet ds = new DataSet();
                dap.Fill(ds);

                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }

                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    DataRow dr = ds.Tables[0].Rows[0];
                    HT_NGUOIDUNG_Model result = new HT_NGUOIDUNG_Model()
                    {
                        id = dr["ID"].ToString(),
                        dm_donvi_id = dr["DM_DONVI_ID"].ToString(),
                        dm_phongban_id = dr["DM_PHONGBAN_ID"].ToString(),
                        dm_kieucanbo_id = dr["DM_KIEUCANBO_ID"].ToString(),
                        dm_chucvu_id = dr["DM_CHUCVU_ID"].ToString(),
                        ten_dang_nhap = dr["TEN_DANG_NHAP"].ToString(),
                        mat_khau = null,
                        ho_ten = dr["HO_TEN"].ToString(),
                        email = dr["EMAIL"].ToString(),
                        ldap = dr["LDAP"].ToString(),
                        trang_thai = int.TryParse(dr["TRANG_THAI"].ToString(), out int trangThai) ? trangThai : (int?)null,  // Trả về null nếu không thể parse
                        ngay_tao = dr["NGAY_TAO"] as DateTime?,  // Nếu không có giá trị thì trả về null
                        nguoi_tao = dr["NGUOI_TAO"].ToString(),
                        ngay_cap_nhat = dr["NGAY_CAP_NHAT"] as DateTime?,  // Nếu không có giá trị thì trả về null
                        nguoi_cap_nhat = dr["NGUOI_CAP_NHAT"].ToString(),
                        so_dien_thoai = dr["SO_DIEN_THOAI"].ToString(),
                        gioi_tinh = int.TryParse(dr["GIOI_TINH"].ToString(), out int gioiTinh) ? gioiTinh : (int?)null,  // Trả về null nếu không thể parse
                        so_cmnd = dr["SO_CMND"].ToString(),
                        //trang_thai_dong_bo = dr["TRANG_THAI_DONG_BO"] as int?,  // Trả về null nếu không có giá trị
                        db_taikhoandangnhap = dr["DB_TAIKHOANDANGNHAP"].ToString(),
                        db_ngay = dr["DB_NGAY"] as DateTime?,  // Trả về null nếu không có giá trị
                        dm_donvi_lamviec_id = dr["DM_DONVI_LAMVIEC_ID"].ToString(),
                        ht_vaitro_id = dr["HT_VAITRO_ID"].ToString(),
                        sign_alias = dr["SIGN_ALIAS"].ToString(),
                        sign_image = dr["SIGN_IMAGE"].ToString(),
                        ma_nvien_cmis = dr["MA_NVIEN_CMIS"].ToString(),
                        //anhdaidien = dr["ANHDAIDIEN"].ToString(),
                        //sign_username = dr["SIGN_USERNAME"].ToString(),
                        //sign_password = null,
                        sign_type = int.TryParse(dr["sign_type"].ToString(), out int signType) ? signType : (int?)null,  // Trả về null nếu không thể parse
                        hrms_type = int.TryParse(dr["HRMS_TYPE"].ToString(), out int hrmsType) ? hrmsType : (int?)null,  // Trả về null nếu không thể parse
                        //roleid = dr["ROLEID"].ToString(),
                        //phong_ban = dr["PHONG_BAN"].ToString(),
                        //anhdaidien = dr["ANHDAIDIEN"].ToString(),
                        //value_token = dr["VALUE_TOKEN"].ToString(),
                        //anhchukynhay = dr["ANHCHUKYNHAY"].ToString(),


                    };

                    //Ảnh đại diện mới:
                    var avatarPath = dr["image_path"] != DBNull.Value
                    ? dr["image_path"].ToString()
                    : null;

                    result.anhdaidien = ImageUrlHelper.BuildUserAvatarUrl(
                        avatarPath,
                        _configuration["ApiBaseUrl"]
                    );

                    return result;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }

        public HT_NGUOIDUNG_Model GET_DM_NGUOIDUNG_byUsername(string username)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            try
            {
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                OracleDataAdapter dap = new OracleDataAdapter();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.get_HT_NGUOIDUNGByUsername";
                cmd.Parameters.Add("p_TEN_DANG_NHAP", username);
                cmd.Parameters.Add("p_getDB", OracleDbType.RefCursor).Direction = ParameterDirection.Output;
                dap.SelectCommand = cmd;
                DataSet ds = new DataSet();
                dap.Fill(ds);

                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }

                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    DataRow dr = ds.Tables[0].Rows[0];
                    HT_NGUOIDUNG_Model result = new HT_NGUOIDUNG_Model()
                    {
                        id = dr["ID"].ToString(),
                        dm_donvi_id = dr["DM_DONVI_ID"].ToString(),
                        dm_phongban_id = dr["DM_PHONGBAN_ID"].ToString(),
                        dm_kieucanbo_id = dr["DM_KIEUCANBO_ID"].ToString(),
                        dm_chucvu_id = dr["DM_CHUCVU_ID"].ToString(),
                        ten_dang_nhap = dr["TEN_DANG_NHAP"].ToString(),
                        mat_khau = null,
                        ho_ten = dr["HO_TEN"].ToString(),
                        email = dr["EMAIL"].ToString(),
                        ldap = dr["LDAP"].ToString(),
                        trang_thai = int.TryParse(dr["TRANG_THAI"].ToString(), out int trangThai) ? trangThai : (int?)null,  // Trả về null nếu không thể parse
                        ngay_tao = dr["NGAY_TAO"] as DateTime?,  // Nếu không có giá trị thì trả về null
                        nguoi_tao = dr["NGUOI_TAO"].ToString(),
                        ngay_cap_nhat = dr["NGAY_CAP_NHAT"] as DateTime?,  // Nếu không có giá trị thì trả về null
                        nguoi_cap_nhat = dr["NGUOI_CAP_NHAT"].ToString(),
                        so_dien_thoai = dr["SO_DIEN_THOAI"].ToString(),
                        gioi_tinh = int.TryParse(dr["GIOI_TINH"].ToString(), out int gioiTinh) ? gioiTinh : (int?)null,  // Trả về null nếu không thể parse
                        so_cmnd = dr["SO_CMND"].ToString(),

                        db_taikhoandangnhap = dr["DB_TAIKHOANDANGNHAP"].ToString(),
                        db_ngay = dr["DB_NGAY"] as DateTime?,  // Trả về null nếu không có giá trị
                        dm_donvi_lamviec_id = dr["DM_DONVI_LAMVIEC_ID"].ToString(),
                        ht_vaitro_id = dr["HT_VAITRO_ID"].ToString(),
                        sign_alias = dr["SIGN_ALIAS"].ToString(),
                        sign_image = dr["SIGN_IMAGE"].ToString(),
                        ma_nvien_cmis = dr["MA_NVIEN_CMIS"].ToString(),
                        //anhdaidien = dr["ANHDAIDIEN"].ToString(),

                        sign_type = int.TryParse(dr["sign_type"].ToString(), out int signType) ? signType : (int?)null,
                        hrms_type = int.TryParse(dr["HRMS_TYPE"].ToString(), out int hrmsType) ? hrmsType : (int?)null,  // Trả về null nếu không thể parse
  


                    };

                    //Ảnh đại diện mới:
                    var avatarPath = dr["image_path"] != DBNull.Value
                    ? dr["image_path"].ToString()
                    : null;

                    result.anhdaidien = ImageUrlHelper.BuildUserAvatarUrl(
                        avatarPath,
                        _configuration["ApiBaseUrl"]
                    );

                    return result;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }



        public string GET_MA_DVIQLY_byUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return null;
            }

            DataTable ds = helper.ExcuteReader(
                "PKG_QLTB_QUANTRI.login_HT_NGUOIDUNG",
                "p_TEN_DANG_NHAP",
                username);

            if (ds == null || ds.Rows.Count == 0
                || !ds.Columns.Contains("MA_DVIQLY")
                || ds.Rows[0]["MA_DVIQLY"] == DBNull.Value)
            {
                return null;
            }

            return ds.Rows[0]["MA_DVIQLY"].ToString()?.Trim();
        }

        public HT_NGUOIDUNG_Model Update_HT_NGUOIDUNG(HT_NGUOIDUNG_Model data)
        {
            using (OracleConnection cn = new ConnectionOracle().getConnectionQLTB())
            {
                cn.Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    using (OracleTransaction transaction = cn.BeginTransaction())
                    {
                        cmd.Connection = cn;
                        cmd.Transaction = transaction;

                        try
                        {
                            cmd.Parameters.Clear();
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.CommandText = @"PKG_QLTB_QUANTRI.update_HT_NGUOIDUNG";
                            cmd.Parameters.Add("p_ID", OracleDbType.Varchar2).Value = data.id;
                            cmd.Parameters.Add("p_DM_DONVI_ID", OracleDbType.Varchar2).Value = data.dm_donvi_id;
                            cmd.Parameters.Add("p_DM_PHONGBAN_ID", OracleDbType.Varchar2).Value = data.dm_phongban_id;
                            cmd.Parameters.Add("p_DM_KIEUCANBO_ID", OracleDbType.Varchar2).Value = data.dm_kieucanbo_id;
                            cmd.Parameters.Add("p_DM_CHUCVU_ID", OracleDbType.Varchar2).Value = data.dm_chucvu_id;
                            cmd.Parameters.Add("p_TEN_DANG_NHAP", OracleDbType.Varchar2).Value = data.ten_dang_nhap;
                            cmd.Parameters.Add("p_MAT_KHAU", OracleDbType.Varchar2).Value = null;
                            cmd.Parameters.Add("p_HO_TEN", OracleDbType.Varchar2).Value = data.ho_ten;
                            cmd.Parameters.Add("p_EMAIL", OracleDbType.Varchar2).Value = data.email;
                            cmd.Parameters.Add("p_LDAP", OracleDbType.Varchar2).Value = data.ldap;
                            cmd.Parameters.Add("p_TRANG_THAI", OracleDbType.Int32).Value = data.trang_thai;
                            cmd.Parameters.Add("p_NGAY_TAO", OracleDbType.Date).Value = data.ngay_tao != DateTime.MinValue ? (object)data.ngay_tao : DBNull.Value;
                            cmd.Parameters.Add("p_NGUOI_TAO", OracleDbType.Varchar2).Value = data.nguoi_tao;
                            cmd.Parameters.Add("p_NGAY_CAP_NHAT", OracleDbType.Date).Value = data.ngay_cap_nhat != DateTime.MinValue ? (object)data.ngay_cap_nhat : DBNull.Value;
                            cmd.Parameters.Add("p_NGUOI_CAP_NHAT", OracleDbType.Varchar2).Value = data.nguoi_cap_nhat;
                            cmd.Parameters.Add("p_SO_DIEN_THOAI", OracleDbType.Varchar2).Value = data.so_dien_thoai;
                            cmd.Parameters.Add("p_GIOI_TINH", OracleDbType.Int32).Value = data.gioi_tinh;
                            cmd.Parameters.Add("p_SO_CMND", OracleDbType.Varchar2).Value = data.so_cmnd;
                            cmd.Parameters.Add("p_TRANG_THAI_DONG_BO", OracleDbType.Int32).Value = data.trang_thai_dong_bo;
                            cmd.Parameters.Add("p_DB_TAIKHOANDANGNHAP", OracleDbType.Varchar2).Value = data.db_taikhoandangnhap;
                            cmd.Parameters.Add("p_DB_NGAY", OracleDbType.Date).Value = data.db_ngay != DateTime.MinValue ? (object)data.db_ngay : DBNull.Value;
                            cmd.Parameters.Add("p_DM_DONVI_LAMVIEC_ID", OracleDbType.Varchar2).Value = data.dm_donvi_lamviec_id;
                            cmd.Parameters.Add("p_HT_VAITRO_ID", OracleDbType.Varchar2).Value = data.ht_vaitro_id;
                            cmd.Parameters.Add("p_SIGN_ALIAS", OracleDbType.Varchar2).Value = data.sign_alias;
                            cmd.Parameters.Add("p_SIGN_USERNAME", OracleDbType.Varchar2).Value = data.sign_username;
                            cmd.Parameters.Add("p_SIGN_PASSWORD", OracleDbType.Varchar2).Value = data.sign_password;
                            cmd.Parameters.Add("p_SIGN_TYPE", OracleDbType.Int32).Value = data.sign_type; // Đảm bảo giá trị là số nguyên
                            cmd.Parameters.Add("p_SIGN_IMAGE", OracleDbType.Varchar2).Value = data.sign_image;
                            cmd.Parameters.Add("p_ANHCHUKYNHAY", OracleDbType.Varchar2).Value = data.anhchukynhay;
                            cmd.Parameters.Add("p_ROLEID", OracleDbType.Varchar2).Value = data.roleid;
                            cmd.Parameters.Add("p_PHONG_BAN", OracleDbType.Varchar2).Value = data.phong_ban;
                            cmd.Parameters.Add("p_ANHDAIDIEN", OracleDbType.Varchar2).Value = data.anhdaidien;
                            cmd.Parameters.Add("p_VALUE_TOKEN", OracleDbType.Varchar2).Value = data.value_token;
                            cmd.Parameters.Add("p_MA_NVIEN_CMIS", OracleDbType.Varchar2).Value = data.ma_nvien_cmis;



                            cmd.ExecuteNonQuery();
                            transaction.Commit();

                            return data;
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                }
            }
        }

        public List<UserResponse> getHT_NGUOIDUNGByMA_DVIQLY(string ma_dviqly,string db_maphongban, string vai_tro)
        {
            try
            {
                DataTable tb = helper.ExcuteReader("PKG_QLTB_QUANTRI.get_HT_NGUOIDUNGByMA_DVIQLY", "p_ma_dviqly", "p_db_maphongban", "p_vai_tro", ma_dviqly, db_maphongban, vai_tro);
                Console.WriteLine(tb);
                if (tb != null && tb.Rows.Count > 0)
                {
                    List<UserResponse> results = new List<UserResponse>();
                    for (int i = 0; i < tb.Rows.Count; i++)
                    {
                        UserResponse result = new UserResponse
                        {
                            ID = tb.Rows[i]["ID"] != DBNull.Value ? tb.Rows[i]["ID"].ToString() : null,
                            HO_TEN = tb.Rows[i]["HO_TEN"] != DBNull.Value ? tb.Rows[i]["HO_TEN"].ToString() : null,
                            TEN_DANG_NHAP = tb.Rows[i]["TEN_DANG_NHAP"] != DBNull.Value ? tb.Rows[i]["TEN_DANG_NHAP"].ToString() : null,
                            TRANG_THAI = tb.Rows[i]["TRANG_THAI"] != DBNull.Value ? Convert.ToInt32(tb.Rows[i]["TRANG_THAI"]) : 0,
                            TEN_DONVI =  null,
                            TEN_PHONGBAN = tb.Rows[i]["TEN_PB"] != DBNull.Value ? tb.Rows[i]["TEN_PB"].ToString() : null,
                            //TEN_CHUCVU =  null,
                            TEN_CHUCVU = tb.Rows[i]["TEN_CHUCVU"] != DBNull.Value ? tb.Rows[i]["TEN_CHUCVU"].ToString() : null,
                            EMAIL = tb.Rows[i]["EMAIL"] != DBNull.Value ? tb.Rows[i]["EMAIL"].ToString() : null,
                            MA_NVIEN_CMIS = tb.Rows[i]["MA_NVIEN_CMIS"] != DBNull.Value ? tb.Rows[i]["MA_NVIEN_CMIS"].ToString() : null,
                        };
                        results.Add(result);
                    }
                    return results;
                }
                else return null;
            }catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }
        public List<UserResponse> get_HT_NGUOIDUNGByDONVIIDS(string donvi_ids)
        {
            try
            {
                DataTable tb = helper.ExcuteReader("PKG_QLTB_QUANTRI.get_HT_NGUOIDUNGByDONVIIDS", "p_donvi_ids", donvi_ids);
                if (tb != null && tb.Rows.Count > 0)
                {
                    List<UserResponse> results = new List<UserResponse>();
                    for (int i = 0; i < tb.Rows.Count; i++)
                    {
                        UserResponse result = new UserResponse
                        {
                            ID = tb.Rows[i]["ID"] != DBNull.Value ? tb.Rows[i]["ID"].ToString() : null,
                            HO_TEN = tb.Rows[i]["HO_TEN"] != DBNull.Value ? tb.Rows[i]["HO_TEN"].ToString() : null,
                            TEN_DANG_NHAP = tb.Rows[i]["TEN_DANG_NHAP"] != DBNull.Value ? tb.Rows[i]["TEN_DANG_NHAP"].ToString() : null,
                            TRANG_THAI = tb.Rows[i]["TRANG_THAI"] != DBNull.Value ? Convert.ToInt32(tb.Rows[i]["TRANG_THAI"]) : 0,
                            TEN_DONVI = null,
                            TEN_PHONGBAN = tb.Rows[i]["TEN_PB"] != DBNull.Value ? tb.Rows[i]["TEN_PB"].ToString() : null,
                            //TEN_CHUCVU =  null,
                            TEN_CHUCVU = tb.Rows[i]["TEN_CHUCVU"] != DBNull.Value ? tb.Rows[i]["TEN_CHUCVU"].ToString() : null,
                            EMAIL = tb.Rows[i]["EMAIL"] != DBNull.Value ? tb.Rows[i]["EMAIL"].ToString() : null,
                            MA_NVIEN_CMIS = tb.Rows[i]["MA_NVIEN_CMIS"] != DBNull.Value ? tb.Rows[i]["MA_NVIEN_CMIS"].ToString() : null,
                        };
                        results.Add(result);
                    }
                    return results;
                }
                else return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        public List<UserResponse> FILTER_HT_NGUOIDUNG(UserFilterRequest request, out int totalRecords)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            try
            {
                cn.Open();
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.search_HT_NGUOIDUNG";

                cmd.Parameters.Add("p_HO_TEN", OracleDbType.Varchar2).Value = string.IsNullOrEmpty(request.HO_TEN) ? (object)DBNull.Value : request.HO_TEN;
                cmd.Parameters.Add("p_TEN_DANG_NHAP", OracleDbType.Varchar2).Value = string.IsNullOrEmpty(request.TEN_DANG_NHAP) ? (object)DBNull.Value : request.TEN_DANG_NHAP;
                cmd.Parameters.Add("p_TRANG_THAI", OracleDbType.Int32).Value = request.TRANG_THAI != -1 ? (object)request.TRANG_THAI.Value : DBNull.Value;
                cmd.Parameters.Add("p_DM_DONVI_ID", OracleDbType.Varchar2).Value = string.IsNullOrEmpty(request.DM_DONVI_ID) ? (object)DBNull.Value : request.DM_DONVI_ID;
                cmd.Parameters.Add("p_DM_PHONGBAN_ID", OracleDbType.Varchar2).Value = string.IsNullOrEmpty(request.DM_PHONGBAN_ID) ? (object)DBNull.Value : request.DM_PHONGBAN_ID;
                cmd.Parameters.Add("p_DM_CHUCVU_ID", OracleDbType.Varchar2).Value = string.IsNullOrEmpty(request.DM_CHUCVU_ID) ? (object)DBNull.Value : request.DM_CHUCVU_ID;

                cmd.Parameters.Add("p_pageNumber", OracleDbType.Int32).Value = request.PageIndex;
                cmd.Parameters.Add("p_pageSize", OracleDbType.Int32).Value = request.PageSize;
                cmd.Parameters.Add("p_MA_DVIQLY", OracleDbType.Varchar2).Value = request.ma_dviqly;
                cmd.Parameters.Add("p_totalRecords", OracleDbType.Decimal).Direction = ParameterDirection.Output;

                cmd.Parameters.Add("p_getDB", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                //bat dau thuc hien truy van
                OracleDataAdapter dap = new OracleDataAdapter(cmd);
                DataSet ds = new DataSet();
                dap.Fill(ds);

                // Lấy tổng số bản ghi từ tham số out
                if (cmd.Parameters["p_totalRecords"].Value != DBNull.Value)
                {
                    var oracleDecimalValue = (Oracle.ManagedDataAccess.Types.OracleDecimal)cmd.Parameters["p_totalRecords"].Value;
                    totalRecords = oracleDecimalValue.ToInt32();
                }
                else
                {
                    totalRecords = 0;
                }

                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    List<UserResponse> results = new List<UserResponse>();
                    foreach (DataRow dr in ds.Tables[0].Rows)
                    {
                        UserResponse result = new UserResponse
                        {
                            ID = dr["ID"] != DBNull.Value ? dr["ID"].ToString() : null,
                            HO_TEN = dr["HO_TEN"] != DBNull.Value ? dr["HO_TEN"].ToString() : null,
                            TEN_DANG_NHAP = dr["TEN_DANG_NHAP"] != DBNull.Value ? dr["TEN_DANG_NHAP"].ToString() : null,
                            TRANG_THAI = dr["TRANG_THAI"] != DBNull.Value ? Convert.ToInt32(dr["TRANG_THAI"]) : 0,
                            TEN_DONVI = dr["TEN_DONVI"] != DBNull.Value ? dr["TEN_DONVI"].ToString() : null,
                            TEN_PHONGBAN = dr["TEN_PHONGBAN"] != DBNull.Value ? dr["TEN_PHONGBAN"].ToString() : null,
                            TEN_CHUCVU = dr["TEN_CHUCVU"] != DBNull.Value ? dr["TEN_CHUCVU"].ToString() : null,
                            EMAIL = dr["EMAIL"] != DBNull.Value ? dr["EMAIL"].ToString() : null,
                            MA_NVIEN_CMIS = dr["MA_NVIEN_CMIS"] != DBNull.Value ? dr["MA_NVIEN_CMIS"].ToString() : null,
                        };
                        results.Add(result);
                    }
                    return results;
                }
                else
                {
                    totalRecords = 0;
                    return new List<UserResponse>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }



        //Đổi mật khẩu người dùng 
        public string Reset_Password_HT_NGUOIDUNG(string ID, string currentPassword, string newPassword)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn;
            OracleTransaction transaction = cn.BeginTransaction();
            cmd.Transaction = transaction;
            try
            {
                string hashedPasswordFromDB = Get_HT_NGUOIDUNG_Password(ID);
                if (!PasswordHasher.VerifyHashedString(hashedPasswordFromDB, currentPassword))
                {
                    return "Mật khẩu hiện tại không chính xác.";
                }

                string hashedNewPassword = PasswordHasher.HashString(newPassword);
                cmd.Parameters.Clear();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.update_password_HT_NGUOIDUNG";
                cmd.Parameters.Add("p_USER_ID", ID);
                cmd.Parameters.Add("p_NEW_PASSWORD", hashedNewPassword);
                cmd.Parameters.Add("p_Error", OracleDbType.NVarchar2, 200).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                transaction.Commit();
                return "Cập nhật mật khẩu thành công.";
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return $"Có lỗi xảy ra: {ex.Message}";
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }

        //Reset về mật khẩu mặc định người dùng 
        public string Reset_DefaultPassword_HT_NGUOIDUNG(string ID, string defaultPassWord)
        {
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = cn;
            OracleTransaction transaction = cn.BeginTransaction();
            cmd.Transaction = transaction;
            try
            {
                string hashedNewPassword = PasswordHasher.HashString(defaultPassWord);
                cmd.Parameters.Clear();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = @"PKG_QLTB_QUANTRI.update_password_HT_NGUOIDUNG";
                cmd.Parameters.Add("p_USER_ID", ID);
                cmd.Parameters.Add("p_NEW_PASSWORD", hashedNewPassword);
                cmd.Parameters.Add("p_Error", OracleDbType.NVarchar2, 200).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                transaction.Commit();
                return "Reset mật khẩu thành công.";
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return $"Có lỗi xảy ra: {ex.Message}";
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }


        public string Get_HT_NGUOIDUNG_Password(string ID)
        {
            string password = null;
            string strErr = "";
            OracleConnection cn = new ConnectionOracle().getConnectionQLTB();
            cn.Open();
            if (strErr != null && strErr != "")
            {
                return null;
            }
            try
            {
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                OracleDataAdapter dap = new OracleDataAdapter();
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.CommandText = @"PKG_QLTB_QUANTRI.get_HT_NGUOIDUNG_byID";
                cmd.Parameters.Add("p_ID", ID);
                cmd.Parameters.Add("p_getDB", OracleDbType.RefCursor).Direction = ParameterDirection.Output;

                dap.SelectCommand = cmd;
                DataSet ds = new DataSet();
                dap.Fill(ds);
                Console.WriteLine(ds);
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }

                if (ds.Tables[0].Rows.Count > 0)
                {
                    password = ds.Tables[0].Rows[0]["MAT_KHAU"].ToString();
                }
                return password;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                if (cn.State != ConnectionState.Closed)
                {
                    cn.Close();
                }
            }
        }


        //delete nguoi dung
        public void Delete_HT_NGUOIDUNG(string id)
        {
            string strErr = "";
            using (OracleConnection cn = new ConnectionOracle().getConnectionQLTB())
            {
                cn.Open();
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                OracleTransaction transaction = cn.BeginTransaction();
                cmd.Transaction = transaction;

                try
                {
                    cmd.Parameters.Clear();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = @"PKG_QLTB_QUANTRI.delete_HT_NGUOIDUNG";

                    cmd.Parameters.Add("p_ID", OracleDbType.Varchar2).Value = id;
                    cmd.Parameters.Add("p_Error", OracleDbType.Varchar2, 200).Direction = ParameterDirection.Output;

                    cmd.ExecuteNonQuery();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex; // Hoặc xử lý lỗi theo cách bạn muốn
                }
                finally
                {
                    if (cn.State != ConnectionState.Closed)
                    {
                        cn.Close();
                    }
                }
            }
        }
        public void updateTrangThai_NguoiDung(string id, int trangthainew)
        {
            string strErr = "";
            using (OracleConnection cn = new ConnectionOracle().getConnectionQLTB())
            {
                cn.Open();
                OracleCommand cmd = new OracleCommand();
                cmd.Connection = cn;
                OracleTransaction transaction = cn.BeginTransaction();
                cmd.Transaction = transaction;

                try
                {
                    cmd.Parameters.Clear();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = @"PKG_QLTB_QUANTRI.update_TT_NGUOIDUNG";

                    cmd.Parameters.Add("p_ID", OracleDbType.Varchar2).Value = id;
                    cmd.Parameters.Add("p_TRANG_THAI", OracleDbType.Int32).Value = trangthainew;

                    cmd.ExecuteNonQuery();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex; // Hoặc xử lý lỗi theo cách bạn muốn
                }
                finally
                {
                    if (cn.State != ConnectionState.Closed)
                    {
                        cn.Close();
                    }
                }
            }
        }

        public List<HT_MENU_Model> BuildMenuTree(List<HT_MENU_Model> menus, int? parentId = null)
        {
            if (menus == null || menus.Count == 0)
                return new List<HT_MENU_Model>();

            return menus
                // 1️⃣ Loại menu không có ID hợp lệ
                .Where(m => m.id.HasValue && m.id > 0)

                // 2️⃣ Lấy đúng các node con của parent hiện tại
                .Where(m => m.parent_id == parentId)

                // 3️⃣ Chặn vòng lặp tự trỏ
                .Where(m => m.parent_id != m.id)

                .Select(m => new HT_MENU_Model
                {
                    id = m.id,
                    ten_menu = m.ten_menu,
                    ghi_chu = m.ghi_chu,
                    ngay_tao = m.ngay_tao,
                    nguoi_tao = m.nguoi_tao,
                    ngay_sua = m.ngay_sua,
                    nguoi_sua = m.nguoi_sua,
                    duong_dan = m.duong_dan,
                    parent_id = m.parent_id,
                    icon = m.icon,
                    sap_xep = m.sap_xep,
                    ma_menu = m.ma_menu,

                    // 4️⃣ Đệ quy nhưng chỉ với ID hợp lệ
                    children = BuildMenuTree(menus, m.id)
                })
                .ToList();
        }

        //public List<HT_MENU_Model> BuildMenuTree(List<HT_MENU_Model> menus, int? parentId = null)
        //{
        //    if (menus == null || !menus.Any()) // Kiểm tra danh sách null hoặc rỗng
        //        return new List<HT_MENU_Model>();

        //    return menus
        //        .Where(m => m.parent_id == parentId)
        //        .Select(m => new HT_MENU_Model
        //        {
        //            id = m.id,
        //            ten_menu = m.ten_menu,
        //            ghi_chu = m.ghi_chu,
        //            ngay_tao = m.ngay_tao,
        //            nguoi_tao = m.nguoi_tao,
        //            ngay_sua = m.ngay_sua,
        //            nguoi_sua = m.nguoi_sua,
        //            duong_dan = m.duong_dan,
        //            parent_id = m.parent_id,
        //            icon = m.icon,
        //            sap_xep = m.sap_xep,
        //            children = BuildMenuTree(menus, m.id) ?? new List<HT_MENU_Model>() // Đảm bảo không trả về null
        //        })
        //        .ToList();
        //}
        public List<HT_MENU_Model> get_HT_MENU_ByIDUser(string userId)
        {
            try
            {
                DataTable tb = helper.ExcuteReader("PKG_QLTB_QUANTRI.get_HT_MENUByUserId", "p_UserID", userId);
                List<HT_MENU_Model> results = new List<HT_MENU_Model>();

                if (tb != null)
                {
                    // Tạo danh sách tất cả các menu
                    foreach (DataRow row in tb.Rows)
                    {
                        HT_MENU_Model model = new HT_MENU_Model
                        {
                            id = row["ID"] != DBNull.Value ? int.Parse(row["ID"].ToString()) : (int?)null,
                            ten_menu = row["TEN_MENU"] != DBNull.Value ? row["TEN_MENU"].ToString() : null,
                            ghi_chu = row["GHI_CHU"] != DBNull.Value ? row["GHI_CHU"].ToString() : null,
                            ngay_tao = row["NGAY_TAO"] != DBNull.Value ? DateTime.Parse(row["NGAY_TAO"].ToString()) : (DateTime?)null,
                            nguoi_tao = row["NGUOI_TAO"] != DBNull.Value ? row["NGUOI_TAO"].ToString() : null,
                            ngay_sua = row["NGAY_SUA"] != DBNull.Value ? DateTime.Parse(row["NGAY_SUA"].ToString()) : (DateTime?)null,
                            nguoi_sua = row["NGUOI_SUA"] != DBNull.Value ? row["NGUOI_SUA"].ToString() : null,
                            duong_dan = row["DUONG_DAN"] != DBNull.Value ? row["DUONG_DAN"].ToString() : null,
                            parent_id = row["PARENT_ID"] != DBNull.Value ? int.Parse(row["PARENT_ID"].ToString()) : (int?)null,
                            icon = row["ICON"] != DBNull.Value ? row["ICON"].ToString() : null,
                            sap_xep = row["SAP_XEP"] != DBNull.Value ? int.Parse(row["SAP_XEP"].ToString()) : (int?)null,
                            ma_menu = row["ma_menu"] != DBNull.Value ? row["ma_menu"].ToString() : null,

                        };
                        results.Add(model);
                    }
                }

                return BuildMenuTree(results);


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }

        public List<MenuWaitSign_Model> GET_MENU_WAIT_SIGN(string username)
        {
            try
            {
                DataTable tb = helper_QLTB.ExcuteReader("PKG_QLTB_THIETBI.GET_MENU_WAIT_SIGN", "p_user_login", username);
                List<MenuWaitSign_Model> results = new List<MenuWaitSign_Model>();

                if (tb != null)
                {
                    // Tạo danh sách tất cả các menu
                    foreach (DataRow row in tb.Rows)
                    {
                        MenuWaitSign_Model model = new MenuWaitSign_Model
                        {
                            id = row["ID"] != DBNull.Value ? int.Parse(row["ID"].ToString()) : (int?)null,
                            ten_menu = row["TEN_MENU"] != DBNull.Value ? row["TEN_MENU"].ToString() : null,
                            username = row["username"] != DBNull.Value ? row["username"].ToString() : null,
                            module_code = row["module_code"] != DBNull.Value ? row["module_code"].ToString() : null,
                            business_code = row["business_code"] != DBNull.Value ? row["business_code"].ToString() : null,
                            so_cho_ky = row["so_cho_ky"] != DBNull.Value ? int.Parse(row["so_cho_ky"].ToString()) : (int?)null,

                        };
                        results.Add(model);
                    }
                }

                return results;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }

        public List<string> get_allowedMenusByUserName(string ten_dang_nhap)
        {
            try
            {
                DataTable tb = helper.ExcuteReader("PKG_QLTB_QUANTRI.get_allowedMenus", "p_ten_dang_nhap", ten_dang_nhap);
                List<string> results = new List<string>();

                if (tb != null)
                {
                    // Tạo danh sách tất cả các menu
                    foreach (DataRow row in tb.Rows)
                    {

                        string duong_dan = row["DUONG_DAN"] != DBNull.Value ? row["duong_dan"].ToString() : null;
                        
                        results.Add(duong_dan);
                    }
                }

                return results;


            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }

    }


}


