using Application.DTO;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllAsync(
            [FromQuery] CarQueryParameters query)
        {
            var cars = await _carService.GetAllAsync(query);

            return Ok(cars);
        }

        [AllowAnonymous]
        [HttpGet("{id:guid}", Name = "GetCarById")]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var car = await _carService.GetByIdAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            return Ok(car);
        }

        [Authorize(
            Policy = SupabaseAuthenticationExtensions.AdminOnlyPolicy)]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(
            [FromBody] CreateCarDto dto)
        {
            var car = await _carService.CreateAsync(dto);

            return CreatedAtRoute(
                "GetCarById",
                new { id = car.Id },
                car);
        }

        [Authorize(
            Policy = SupabaseAuthenticationExtensions.AdminOnlyPolicy)]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateAsync(
            Guid id,
            [FromBody] UpdateCarDto dto)
        {
            var car = await _carService.UpdateAsync(id, dto);

            if (car == null)
            {
                return NotFound();
            }

            return Ok(car);
        }

        [Authorize(
            Policy = SupabaseAuthenticationExtensions.AdminOnlyPolicy)]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await _carService.DeleteAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}