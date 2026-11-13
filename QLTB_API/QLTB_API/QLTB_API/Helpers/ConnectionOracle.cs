using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Oracle.ManagedDataAccess.Client;
namespace APIPCHY.Helpers
{
    public class ConnectionOracle
    {
        private static IConfiguration _configuration;

        public static void SetConfiguration(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public OracleConnection getConnectionQLTB()
        {
            try
            {
                OracleConnection connection = new OracleConnection(_configuration.GetConnectionString("QLTB"));
                return connection;
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}
