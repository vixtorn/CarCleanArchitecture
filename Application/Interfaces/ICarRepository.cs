using Application.DTO;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces
{
    public interface ICarRepository
    {
        Task<List<Car>> GetAllAsync(CarQueryParameters query);

        Task<Car?> GetByIdAsync(Guid id); //Burada Car? null olabileceği için nullable olarak işaretledik.

        Task<Car> CreateAsync(Car car);

        Task<Car?> UpdateAsync(Car car);    

        Task<Car?> DeleteAsync(Guid id); //Burada Car? null olabileceği için nullable olarak işaretledik.
    }
}