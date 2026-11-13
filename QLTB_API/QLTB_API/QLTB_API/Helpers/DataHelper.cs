using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace APIPCHY.Helpers
{
    public enum DbConnectionType
    {
        QLTB
    }
    public class DataHelper
    {
        OracleConnection cn;

        public DataHelper(string conn)
        {
            cn = new OracleConnection(conn);

        }

        public DataHelper()
        {
            cn = new ConnectionOracle().getConnectionQLTB();
        }


        // Constructor chỉ định database
        public DataHelper(DbConnectionType dbType)
        {
            if (dbType == DbConnectionType.QLTB)
            {
                cn = new ConnectionOracle().getConnectionQLTB();
            }
            else
            {
                throw new ArgumentException("Kiểu kết nối không hợp lệ");
            }
        }

        public bool Open()
        {
            try
            {
                if (cn.State != ConnectionState.Open)
                {
                    cn.Open();
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public void Close()
        {
            if (cn.State != ConnectionState.Closed)
            {
                cn.Close();
            }
        }

        //public DataTable ExcuteReader
        public string ExcuteNonQuery(string procedureName, string paramOut, params object[] param_list)
        {

            OracleCommand cmd = new OracleCommand { CommandText = procedureName, CommandType = CommandType.StoredProcedure, Connection = cn };

            OracleTransaction transaction;
            var isOpen = Open();
            string strErr = "";
            transaction = cn.BeginTransaction();
            cmd.Transaction = transaction;
            try
            {
                int paramInput = (param_list.Length) / 2;
                cmd.Parameters.Clear();
                for (int i = 0; i < paramInput; i++)
                {
                    string paramKey = Convert.ToString(param_list);
                    object paramValue = param_list[i + paramInput];
                    cmd.Parameters.Add(new OracleParameter(paramKey, paramValue));
                }
                cmd.Parameters.Add(paramOut, OracleDbType.Varchar2, 200).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                transaction.Commit();
            }
            catch (Exception err)
            {
                strErr = err.ToString();
                transaction.Rollback();
            }
            finally
            {
                Close();
            }

            return strErr;
        }

        public string ExcuteNonQuery_v2(string procedureName, string paramOut, params object[] param_list)
        {

            OracleCommand cmd = new OracleCommand { CommandText = procedureName, CommandType = CommandType.StoredProcedure, Connection = cn };

            OracleTransaction transaction;
            var isOpen = Open();
            string strErr = "";
            string result = "";
            transaction = cn.BeginTransaction();
            cmd.Transaction = transaction;
            try
            {
                int paramInput = (param_list.Length) / 2;
                cmd.Parameters.Clear();
                for (int i = 0; i < paramInput; i++)
                {
                    string paramKey = Convert.ToString(param_list[i]);
                    // Nếu là chuỗi dài (JSON), dùng CLOB
                    object paramValue = param_list[i + paramInput];
                    var param = new OracleParameter();
                    param.ParameterName = paramKey;
                    if (paramValue is string strValue)
                    {

                        if (strValue.Length > 4000)
                        {
                            param.OracleDbType = OracleDbType.Clob;
                        }
                        param.Value = paramValue;
                    }
                    else
                    {
                        param.Value = paramValue ?? DBNull.Value;
                    }

                    cmd.Parameters.Add(param);
                }
                cmd.Parameters.Add(paramOut, OracleDbType.Varchar2, 200).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                transaction.Commit();
                result = cmd.Parameters[paramOut].Value?.ToString().Trim();
            }
            catch (Exception err)
            {
                strErr = err.ToString();
                transaction.Rollback();
            }
            finally
            {
                Close();
            }

            return string.IsNullOrEmpty(result) ? strErr : result;
        }


        //public DataTable ExcuteReader(string ProcedureName, params object[] param_list)
        //{
        //    DataTable tb = new DataTable();
        //    try
        //    {
        //        OracleCommand cmd = new OracleCommand { CommandType = CommandType.StoredProcedure, CommandText = ProcedureName, Connection = cn };
        //        Open();
        //        int paramterInput = (param_list.Length) / 2;
        //        for (int i = 0; i < paramterInput; i++)
        //        {
        //            string paramName = Convert.ToString(param_list[i]);
        //            object paramValue = param_list[i + paramterInput];
        //            if (paramName.ToLower().Contains("json"))
        //            {
        //                cmd.Parameters.Add(new OracleParameter
        //                {
        //                    ParameterName = paramName,
        //                    OracleDbType = OracleDbType.NVarchar2,
        //                    Value = paramValue ?? DBNull.Value
        //                });
        //            }
        //            else
        //            {
        //                cmd.Parameters.Add(new OracleParameter(paramName, paramValue ?? DBNull.Value));
        //            }
        //        }

        //        OracleParameter refCursor = new OracleParameter
        //        {
        //            ParameterName = "p_getDB",
        //            OracleDbType = OracleDbType.RefCursor,
        //            Direction = ParameterDirection.Output
        //        };
        //        cmd.Parameters.Add(refCursor);


        //        OracleDataAdapter ad = new OracleDataAdapter(cmd);
        //        ad.Fill(tb);
        //        ad.Dispose();
        //        cmd.Dispose();
        //        //cn.Dispose();
        //    }
        //    catch (Exception ex)
        //    {
        //        tb = null;
        //        throw ex;
        //        // Log lỗi nếu cần
        //    }
        //    finally
        //    {
        //        Close();
        //    }
        //    return tb;
        //}

        public DataTable ExcuteReader(string ProcedureName, params object[] param_list)
        {
            DataTable tb = new DataTable();

            try
            {
                OracleCommand cmd = new OracleCommand
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandText = ProcedureName,
                    Connection = cn,
                    InitialLONGFetchSize = -1
                };

                Open();

                int paramterInput = (param_list.Length) / 2;

                for (int i = 0; i < paramterInput; i++)
                {
                    string paramName = Convert.ToString(param_list[i]);
                    object paramValue = param_list[i + paramterInput];

                    cmd.Parameters.Add(
                        new OracleParameter(
                            paramName,
                            paramValue ?? DBNull.Value
                        )
                    );
                }

                OracleParameter refCursor = new OracleParameter
                {
                    ParameterName = "p_getDB",
                    OracleDbType = OracleDbType.RefCursor,
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(refCursor);

                OracleDataAdapter ad = new OracleDataAdapter(cmd);

                ad.Fill(tb);

                // Convert OracleClob -> string
                foreach (DataColumn col in tb.Columns)
                {
                    foreach (DataRow row in tb.Rows)
                    {
                        if (row[col] is Oracle.ManagedDataAccess.Types.OracleClob clob)
                        {
                            row[col] = clob.Value;
                        }
                    }
                }

                ad.Dispose();
                cmd.Dispose();
            }
            catch
            {
                tb = null;
                throw;
            }
            finally
            {
                Close();
            }

            return tb;
        }

        public object ExecuteScalar(string procedureName, params object[] param_list)
        {
            object result = null;
            try
            {
                OracleCommand cmd = new OracleCommand
                {
                    CommandType = CommandType.StoredProcedure,
                    CommandText = procedureName,
                    Connection = cn
                };

                Open();
                int paramCount = param_list.Length / 2;

                for (int i = 0; i < paramCount; i++)
                {
                    string paramName = Convert.ToString(param_list[i]);
                    object paramValue = param_list[i + paramCount];

                    cmd.Parameters.Add(new OracleParameter(paramName, paramValue ?? DBNull.Value));
                }

                // Thêm tham số OUT
                OracleParameter outputParam = new OracleParameter
                {
                    ParameterName = "p_getDB",
                    OracleDbType = OracleDbType.Int32,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(outputParam);

                cmd.ExecuteNonQuery();

                // Lấy giá trị từ tham số OUT
                result = cmd.Parameters["p_getDB"].Value;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                throw ex;
            }
            finally
            {
                Close();
            }
            return result;
        }

        public Dictionary<string, object> ExecuteProcedureMultiOut(
            string procedureName,
            List<OracleParameter> parameters)
        {
            var result = new Dictionary<string, object>();
            OracleTransaction transaction = null;

            try
            {
                Open();

                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.CommandText = procedureName;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Connection = cn;

                    transaction = cn.BeginTransaction();
                    cmd.Transaction = transaction;

                    // ================= ADD PARAMS =================
                    foreach (var p in parameters)
                    {
                        cmd.Parameters.Add(p);
                    }

                    cmd.ExecuteNonQuery();

                    // ================= READ OUT PARAMS =================
                    foreach (OracleParameter p in cmd.Parameters)
                    {
                        if (p.Direction != ParameterDirection.Output &&
                            p.Direction != ParameterDirection.InputOutput)
                            continue;

                        object value = p.Value;

                        // ================= NULL HANDLING =================
                        if (value == null || value == DBNull.Value)
                        {
                            result[p.ParameterName] = null;
                            continue;
                        }

                        // ================= FORCE STRING =================
                        string strValue = Convert.ToString(value)?.Trim();

                        // ================= NORMALIZE NULL TEXT =================
                        if (string.IsNullOrWhiteSpace(strValue) ||
                            strValue.Equals("null", StringComparison.OrdinalIgnoreCase))
                        {
                            result[p.ParameterName] = null;
                        }
                        else
                        {
                            result[p.ParameterName] = strValue;
                        }
                    }

                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                transaction?.Rollback();

                result.Clear();
                result["p_ERROR"] = ex.Message;
            }
            finally
            {
                Close();
            }

            return result;
        }
    }

}
