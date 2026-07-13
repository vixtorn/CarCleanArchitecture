using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Application.DTO
{
    public class CreateCarDto
    {
        [Required]
        [MaxLength(100)]
        public string Brand { get; set; } = string.Empty;
        [Required]
        [MaxLength (100)]
        public string Model { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string Color { get; set; } = string.Empty;
        [Required]
        [Range(1886,2026)]
        public int Year { get; set; }
        [Required]
        [Range(1,3600)]
        public int Horsepower { get; set; }
        [Required]
        [Range(2,5)]
        public int DoorCount { get; set; }
    }
}
