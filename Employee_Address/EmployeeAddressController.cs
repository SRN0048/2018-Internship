using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IMC.DAL.Biz;
using IMC.DAL.BOL;
using IMC.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IMC.API.Controllers
{
    [Authorize]
    [EnableCors("IMCPolicy")]
    [Route("api/[controller]/[action]")]
    public class EmployeeAddressController : Controller
    {
        private readonly EmployeeAddressBiz employeeAddressBiz;

        public EmployeeAddressController(EmployeeAddressBiz employeeAddressBiz)
        {
            this.employeeAddressBiz = employeeAddressBiz;
        }

        [HttpGet("{employeeAddressId}")]
        public EmployeeAddressModel GetEmployeeAddressById(int employeeAddressId)
        {
            return this.employeeAddressBiz.GetEmployeeAddressById(employeeAddressId);
        }

        [HttpGet("{employeeId}")]
        public IEnumerable<EmployeeAddressModel> GetEmployeeAddressByEmployeeId(int employeeId)
        {
            return this.employeeAddressBiz.GetEmployeeAddressByEmployeeId(employeeId);
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployeeAddress([FromBody]EmployeeAddressModel[] model)
        {
            foreach (var item in model)
            {
            item.CreatedBy = User.Claims.Where(c => c.Type == "sub").Select(c => c.Value).SingleOrDefault();
            }
            var result = this.employeeAddressBiz.AddEmployeeAddress(model);
            return Ok(true);
        }
        [HttpPost]
        public async Task<IActionResult> EditEmployeeAddress([FromBody]EmployeeAddressModel[] model)
        {
            foreach (var item in model)
            {
            item.ModifiedBy = User.Claims.Where(c => c.Type == "sub").Select(c => c.Value).SingleOrDefault();
            }
            var result = this.employeeAddressBiz.EditEmployeeAddress(model);     
            return Ok(true);
        }
    }
}
