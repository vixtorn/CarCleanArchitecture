using Application.DTO;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class CarService : ICarService
    {
        private readonly ICarRepository _carRepository;

        public CarService(ICarRepository carRepository)
        {
            _carRepository = carRepository;
        }

        // public: Bu servisi API (Controller) katmanından veya başka bir sınıftan çağırabilmemizi sağlar (Access Modifier).
        // async: Metodun asenkron çalıştığını, yani veritabanı (I/O) işlemleri sırasında CPU thread'ini kilitlemeyeceğini derleyiciye bildirir.
        // Task<List<CarDto>>: Asenkron işlemin sonucunda, gelecekte döndürülecek verinin (bir DTO listesi) tipini belirten sözleşmedir.
        // CarQueryParameters query: Parametreleri tek tek yazmak yerine (Parameter Object Pattern) filtre/sayfalama verilerini tek bir nesnede toplayan argüman.
        public async Task<List<CarDto>> GetAllAsync(CarQueryParameters query)
        {
            // var: Sağ taraftaki ifadeden değişkenin tipini (IEnumerable<Car>) derleyicinin otomatik çıkarmasını sağlar (Type Inference).
            // await: Veritabanı sorgusu bitene kadar bekler; ancak bu esnada thread'i bloke etmez, serbest bırakıp diğer isteklere hizmet etmesine izin verir.
            // _carRepository.GetAllAsync: Saf Domain (Car) entity'lerini veri erişim katmanından çeker.
            var cars = await _carRepository.GetAllAsync(query);

            // cars.Select: Bir LINQ metodudur. Koleksiyondaki her bir 'Car' elemanı üzerinde iterasyon yapar (Projection).
            // car => new CarDto: Lambda ifadesi. Gelen her 'car' domain nesnesini alır ve verilerini yeni yaratılan güvenli 'CarDto' nesnesine aktarır (Manuel Mapping).
            return cars.Select(car => new CarDto
            {
                Id = car.Id,
                Brand = car.Brand,
                Model = car.Model,
                Color = car.Color,
                Year = car.Year,
                Horsepower = car.Horsepower,
                DoorCount = car.DoorCount
            })
            // .ToList(): O ana kadar tembel (lazy) bekleyen Select sorgusunu çalışmaya zorlar ve sonuçları bellekte fiziksel bir List koleksiyonuna dönüştürerek metottan döndürür.
            .ToList();
        }

        public async Task<CarDto?> GetByIdAsync(Guid id)
        {
            var car = await _carRepository.GetByIdAsync(id);

            if (car == null)
            {
                return null;
            }

            return new CarDto
            {
                Id = car.Id,
                Brand = car.Brand,
                Model = car.Model,
                Color = car.Color,
                Year = car.Year,
                Horsepower = car.Horsepower,
                DoorCount = car.DoorCount
            };
        }

        public async Task<CarDto> CreateAsync(CreateCarDto dto)
        {
            var car = new Car
            {
                Id = Guid.NewGuid(),
                Brand = dto.Brand,
                Model = dto.Model,
                Color = dto.Color,
                Year = dto.Year,
                Horsepower = dto.Horsepower,
                DoorCount = dto.DoorCount
            };

            var createdCar = await _carRepository.CreateAsync(car);

            return new CarDto
            {
                Id = createdCar.Id,
                Brand = createdCar.Brand,
                Model = createdCar.Model,
                Color = createdCar.Color,
                Year = createdCar.Year,
                Horsepower = createdCar.Horsepower,
                DoorCount = createdCar.DoorCount
            };
        }

        public async Task<CarDto?> UpdateAsync(Guid id, UpdateCarDto dto)
        {
            var existingCar = await _carRepository.GetByIdAsync(id);

            if (existingCar == null)
            {
                return null;
            }

            existingCar.Brand = dto.Brand;
            existingCar.Model = dto.Model;
            existingCar.Color = dto.Color;
            existingCar.Year = dto.Year;
            existingCar.Horsepower = dto.Horsepower;
            existingCar.DoorCount = dto.DoorCount;

            var updatedCar = await _carRepository.UpdateAsync(existingCar);

            if (updatedCar == null)
            {
                return null;
            }

            return new CarDto
            {
                Id = updatedCar.Id,
                Brand = updatedCar.Brand,
                Model = updatedCar.Model,
                Color = updatedCar.Color,
                Year = updatedCar.Year,
                Horsepower = updatedCar.Horsepower,
                DoorCount = updatedCar.DoorCount
            };
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var deletedCar = await _carRepository.DeleteAsync(id);

            return deletedCar != null;
        }
    }
}