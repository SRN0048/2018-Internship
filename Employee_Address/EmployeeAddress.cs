using System;
using System.Collections.Generic;

namespace IMC.DAL.Models
{
    public partial class EmployeeAddress
    {
        public int EmployeeAddressId { get; set; }
        public int EmployeeId { get; set; }
        public short AddressType { get; set; }
        public string Address { get; set; }
        public string Subdistrict { get; set; }
        public int? DistrictId { get; set; }
        public short? ProvinceId { get; set; }
        public string PostalCode { get; set; }
        public string PhoneNo { get; set; }
        public DateTime DateCreated { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? DateModified { get; set; }
        public string ModifiedBy { get; set; }

        public SysUserInfo CreatedByNavigation { get; set; }
        public SysDistricts District { get; set; }
        public Employee Employee { get; set; }
        public SysUserInfo ModifiedByNavigation { get; set; }
        public SysProvinces Province { get; set; }
    }
}
