using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTO
{
    public class CarQueryParameters
    {
        /*
         Burada programımızda çalışmasını istediğimiz filtreleme ve sıralama parametrelerini tanımlıyoruz.
         Bu parametreler, API üzerinden gelen sorgularda kullanılacak ve veritabanından çekilecek verileri filtrelemek ve sıralamak için kullanılacak.
         Clean Architecture prensiplerine uygun olarak, bu parametreleri bir DTO (Data Transfer Object) olarak tanımlıyoruz.
         Daha öncesinde DTO olmadan direkt olarak API üzerinden gelen sorgularda kullanılacak parametreleri Controller'da tanımlıyorduk. 
         Ancak bu yaklaşım, kodun okunabilirliğini ve bakımını zorlaştırıyordu. Bu yüzden bu parametreleri ayrı bir DTO olarak tanımladık.
         */
        public string? Brand { get; set; }

        public string? Model { get; set; }

        public string? Color { get; set; }

        public int? MinYear { get; set; }

        public int? MaxYear { get; set; }

        public int? MinHorsepower { get; set; }

        public int? MaxHorsepower { get; set; }

        public string? SortBy { get; set; }

        public string? SortDirection { get; set; }
    }
}
