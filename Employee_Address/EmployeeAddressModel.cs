using IMC.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace IMC.DAL.BOL
{
    public class EmployeeAddressModel : EmployeeAddress
    {
        public string NameDistrict { get; set; }
        public string NameProvince { get; set; }
        public string NameEmployee { get; set; }

    }
}
