import type { Car } from "../types/car";
import Icon from "./Icon";

interface StatsCardsProps { cars: Car[]; }

export default function StatsCards({ cars }: StatsCardsProps) {
  const brands = new Set(cars.map((car) => car.brand.trim().toLocaleLowerCase())).size;
  const averageHorsepower = cars.length
    ? Math.round(cars.reduce((total, car) => total + car.horsepower, 0) / cars.length)
    : 0;
  const newestYear = cars.length ? Math.max(...cars.map((car) => car.year)) : 0;
  const stats = [
    { label: "Total Cars", value: String(cars.length), icon: "car" as const },
    { label: "Total Brands", value: String(brands), icon: "tag" as const },
    { label: "Average HP", value: `${averageHorsepower} HP`, icon: "gauge" as const },
    { label: "Newest Model Year", value: newestYear ? String(newestYear) : "—", icon: "calendar" as const },
  ];

  return (
    <section className="stats-grid" aria-label="Inventory summary">
      {stats.map((stat) => (
        <article className="stat-card" key={stat.label}>
          <span className="stat-label">{stat.label}</span>
          <div className="stat-value-row"><strong>{stat.value}</strong><span className="stat-icon"><Icon name={stat.icon} /></span></div>
        </article>
      ))}
    </section>
  );
}
