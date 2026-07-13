using Application.DTO;

namespace Application.Interfaces
{
    public interface ICarService
    {
        Task<List<CarDto>> GetAllAsync(CarQueryParameters query);

        Task<CarDto?> GetByIdAsync(Guid id);

        Task<CarDto> CreateAsync(CreateCarDto dto);

        Task<CarDto?> UpdateAsync(Guid id, UpdateCarDto dto);

        Task<bool> DeleteAsync(Guid id);
    }
}