using Application.DTO;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repository
{
    public class CarRepository : ICarRepository
    {
        private readonly CarsDbContext _dbContext;

        public CarRepository(CarsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Car>> GetAllAsync(CarQueryParameters query)
        {
            var carsQuery = _dbContext.Cars.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Brand))
            {
                carsQuery = carsQuery.Where(car => car.Brand.Contains(query.Brand));
            }

            if (!string.IsNullOrWhiteSpace(query.Model))
            {
                carsQuery = carsQuery.Where(car => car.Model.Contains(query.Model));
            }

            if (!string.IsNullOrWhiteSpace(query.Color))
            {
                carsQuery = carsQuery.Where(car => car.Color.Contains(query.Color));
            }

            if (query.MinYear.HasValue)
            {
                carsQuery = carsQuery.Where(car => car.Year >= query.MinYear.Value);
            }

            if (query.MaxYear.HasValue)
            {
                carsQuery = carsQuery.Where(car => car.Year <= query.MaxYear.Value);
            }

            if (query.MinHorsepower.HasValue)
            {
                carsQuery = carsQuery.Where(car => car.Horsepower >= query.MinHorsepower.Value);
            }

            if (query.MaxHorsepower.HasValue)
            {
                carsQuery = carsQuery.Where(car => car.Horsepower <= query.MaxHorsepower.Value);
            }

            var isDescending = query.SortDirection?.ToLower() == "desc";

            carsQuery = query.SortBy?.ToLower() switch
            {
                "brand" => isDescending
                    ? carsQuery.OrderByDescending(car => car.Brand)
                    : carsQuery.OrderBy(car => car.Brand),

                "model" => isDescending
                    ? carsQuery.OrderByDescending(car => car.Model)
                    : carsQuery.OrderBy(car => car.Model),

                "color" => isDescending
                    ? carsQuery.OrderByDescending(car => car.Color)
                    : carsQuery.OrderBy(car => car.Color),

                "year" => isDescending
                    ? carsQuery.OrderByDescending(car => car.Year)
                    : carsQuery.OrderBy(car => car.Year),

                "horsepower" => isDescending
                    ? carsQuery.OrderByDescending(car => car.Horsepower)
                    : carsQuery.OrderBy(car => car.Horsepower),

                "doorcount" => isDescending
                    ? carsQuery.OrderByDescending(car => car.DoorCount)
                    : carsQuery.OrderBy(car => car.DoorCount),

                _ => carsQuery.OrderBy(car => car.Brand)
            };

            return await carsQuery.ToListAsync();
        }

        public async Task<Car?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Cars.FirstOrDefaultAsync(car => car.Id == id);
            //CarsDbContext ile oluşturduğumuz Cars tablosundan id'si verilen car'ı bulup döndürüyoruz. Eğer böyle bir car yoksa null dönecek.
        }

        public async Task<Car> CreateAsync(Car car)
        {
            await _dbContext.Cars.AddAsync(car);
            await _dbContext.SaveChangesAsync();

            return car;
        }

        public async Task<Car?> UpdateAsync(Car car)
        {
            var existingCar = await _dbContext.Cars.FirstOrDefaultAsync(x => x.Id == car.Id);

            if (existingCar == null)
            {
                return null;
            }

            existingCar.Brand = car.Brand;
            existingCar.Model = car.Model;
            existingCar.Color = car.Color;
            existingCar.Year = car.Year;
            existingCar.Horsepower = car.Horsepower;
            existingCar.DoorCount = car.DoorCount;

            await _dbContext.SaveChangesAsync();

            return existingCar;
        }

        public async Task<Car?> DeleteAsync(Guid id)
        {
            var car = await _dbContext.Cars.FirstOrDefaultAsync(car => car.Id == id);

            if (car == null)
            {
                return null;
            }

            _dbContext.Cars.Remove(car);
            await _dbContext.SaveChangesAsync();

            return car;
        }
    }
}   