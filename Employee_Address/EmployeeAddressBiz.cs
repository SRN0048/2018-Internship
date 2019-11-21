using AutoMapper;
using IMC.DAL.BOL;
using IMC.DAL.EmployeeDal;
using IMC.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;


namespace IMC.DAL.Biz
{
    public class EmployeeAddressBiz : Profile
    {
        private readonly EmployeeAddressDAL employeeAddressDAL;
        private readonly IMapper mapper;

        public EmployeeAddressBiz(EmployeeAddressDAL employeeAddressDAL, IMapper mapper)
        {
            this.employeeAddressDAL = employeeAddressDAL;
            this.mapper = mapper;
        }
        public IEnumerable<EmployeeAddressModel> GetEmployeeAddressByEmployeeId(int employeeId)
        {
            var listOfEmployeeAddress = new List<EmployeeAddress>();
            listOfEmployeeAddress = this.employeeAddressDAL.GetEmployeeAddressByEmployeeId(employeeId);

            return AdjustFormatEmployeeAddress(listOfEmployeeAddress);
        }

        public EmployeeAddressModel GetEmployeeAddressById(int employeeAddressId)
        {
            var model = employeeAddressDAL.GetEmployeeAddressById(employeeAddressId);

            EmployeeAddressModel employeeAddressModel = mapper.Map<EmployeeAddressModel>(model);
            employeeAddressModel.EmployeeAddressId = model.EmployeeAddressId;
            employeeAddressModel.EmployeeId = model.EmployeeId;
            employeeAddressModel.AddressType = model.AddressType;
            employeeAddressModel.Address = model.Address;
            employeeAddressModel.Subdistrict = model.Subdistrict;
            employeeAddressModel.DistrictId = model.DistrictId;
            employeeAddressModel.ProvinceId = model.ProvinceId;
            employeeAddressModel.PostalCode = model.PostalCode;
            employeeAddressModel.PhoneNo = model.PhoneNo;
            employeeAddressModel.DateCreated = model.DateCreated;
            employeeAddressModel.CreatedBy = model.CreatedBy;
            employeeAddressModel.DateModified = model.DateModified;
            employeeAddressModel.ModifiedBy = model.ModifiedBy;
            employeeAddressModel.NameDistrict = model.District == null ? "" : "อ." + model.District.Name;
            employeeAddressModel.NameProvince = model.Province == null ? "" : "จ." + model.Province.Name;
            employeeAddressModel.NameEmployee = model.Employee == null ? "" : model.Employee.Name;
            employeeAddressModel.CreatedBy = model.CreatedByNavigation.DisplayName;
            employeeAddressModel.ModifiedBy = model.ModifiedByNavigation == null ? "" : model.ModifiedByNavigation.DisplayName;
            return employeeAddressModel;
        }

        public bool AddEmployeeAddress(EmployeeAddressModel[] model)
        {
            bool result = false;
            foreach (var item in model)
            {
            EmployeeAddressModel employeeAddressModel = mapper.Map<EmployeeAddressModel>(item);
            result = employeeAddressDAL.AddEmployeeAddress(employeeAddressModel);
            }
            return result;
        }
        public bool EditEmployeeAddress(EmployeeAddressModel[] model)
        {
            bool result = false;
            foreach (var item in model)
            {
            EmployeeAddressModel employeeAddressModel = mapper.Map<EmployeeAddressModel>(item);
            result = employeeAddressDAL.EditEmployeeAddress(employeeAddressModel);
            }
            return result;
        }

        private List<EmployeeAddressModel> AdjustFormatEmployeeAddress(List<EmployeeAddress> list)
        {
            var listOfEmployeeAddress = new List<EmployeeAddressModel>();

            if (list != null)
            {
                foreach (var item in list)
                {
                    var employeeAddressModel = new EmployeeAddressModel();

                    employeeAddressModel.EmployeeAddressId = item.EmployeeAddressId;
                    employeeAddressModel.EmployeeId = item.EmployeeId;
                    employeeAddressModel.AddressType = item.AddressType;
                    employeeAddressModel.Address = item.Address;
                    employeeAddressModel.Subdistrict = item.Subdistrict;
                    employeeAddressModel.DistrictId = item.DistrictId;
                    employeeAddressModel.ProvinceId = item.ProvinceId;
                    employeeAddressModel.PostalCode = item.PostalCode;
                    employeeAddressModel.PhoneNo = item.PhoneNo;
                    employeeAddressModel.DateCreated = item.DateCreated;
                    employeeAddressModel.CreatedBy = item.CreatedBy;
                    employeeAddressModel.DateModified = item.DateModified;
                    employeeAddressModel.ModifiedBy = item.ModifiedBy;
                    employeeAddressModel.NameDistrict = item.District == null ? "" : "อ." + item.District.Name;
                    employeeAddressModel.NameProvince = item.Province == null ? "" : "จ." + item.Province.Name;
                    employeeAddressModel.NameEmployee = item.Employee == null ? "" : item.Employee.Name;
                    employeeAddressModel.CreatedBy = item.CreatedByNavigation == null ? "" : item.CreatedByNavigation.DisplayName;
                    employeeAddressModel.ModifiedBy = item.ModifiedByNavigation == null ? "" : item.ModifiedByNavigation.DisplayName;
                    listOfEmployeeAddress.Add(employeeAddressModel);
                }
            }
            return listOfEmployeeAddress;
        }
    }
}
