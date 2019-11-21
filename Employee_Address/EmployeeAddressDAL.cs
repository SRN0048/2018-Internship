using IMC.DAL.BOL;
using Microsoft.EntityFrameworkCore;
using Prism.Common.DataService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using IMC.DAL.Models;
using System.Data;
using System.Data.Common;


namespace IMC.DAL.EmployeeDal
{
    public class EmployeeAddressDAL
    {
        public List<EmployeeAddress> GetEmployeeAddressByEmployeeId(int employeeId)
        {
            List<EmployeeAddress> result = new List<EmployeeAddress>();

            using (var context = new IMC2Context())
            {
                try {
                    result = context.EmployeeAddress.Include("District")
                        .Include("Employee")
                        .Include("Province")
                        .Include("CreatedByNavigation")
                        .Include("ModifiedByNavigation").Where(e => e.EmployeeId == employeeId).ToList();
                }
                catch(Exception e) {
                    return null;
                }
            }
            return result;
        }

        public EmployeeAddress GetEmployeeAddressById(int employeeAddressId)
        {
            EmployeeAddress result = new EmployeeAddress();

            using (var context = new IMC2Context())
            {
                result = context.EmployeeAddress.Include("District")
                    .Include("Employee")
                    .Include("Province")
                    .Include("CreatedByNavigation")
                    .Include("ModifiedByNavigation").First(e => e.EmployeeAddressId == employeeAddressId);
            }
            return result;
        }
        public bool AddEmployeeAddress(EmployeeAddress model)
        {
            bool result = true;

            using (var context = new IMC2Context())
            {
                try
                {
                    context.EmployeeAddress.Add(model);
                    context.SaveChanges();
                }
                catch (Exception e)
                {

                    result = false;
                }
            }

            return result;
        }
        public bool EditEmployeeAddress(EmployeeAddress model)
        {
            bool result = true;
            using (var context = new IMC2Context())
            {
                try
                {

                    var employeeAddressModel = context.EmployeeAddress.First(m => m.EmployeeAddressId == model.EmployeeAddressId);
                    employeeAddressModel.EmployeeAddressId = model.EmployeeAddressId;
                    employeeAddressModel.EmployeeId = model.EmployeeId;
                    employeeAddressModel.AddressType = model.AddressType;
                    employeeAddressModel.Address = model.Address;
                    employeeAddressModel.Subdistrict = model.Subdistrict;
                    employeeAddressModel.DistrictId = model.DistrictId;
                    employeeAddressModel.ProvinceId = model.ProvinceId;
                    employeeAddressModel.PostalCode = model.PostalCode;
                    employeeAddressModel.PhoneNo = model.PhoneNo;
                    employeeAddressModel.DateModified = DateTime.Now;
                    employeeAddressModel.ModifiedBy = model.ModifiedBy;
                    context.SaveChanges();
                }
                catch (Exception e)
                {

                    result = false;
                }
            }

            return result;
        }
    }
}
