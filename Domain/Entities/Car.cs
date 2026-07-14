namespace Domain.Entities
{
    public class Car
    {
        public Guid Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;

        public string Color { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Horsepower { get; set; }
        public int DoorCount { get; set; }

        public string? ImagePath { get; set; } // Optional property for the image path
    }
}