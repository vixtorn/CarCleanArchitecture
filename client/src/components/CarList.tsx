import carPlaceholder from "../assets/car-placeholder.png";
import type { Car } from "../types/car";
import Icon from "./Icon";

interface CarListProps {
  cars: Car[];
  isLoading: boolean;
  error: string | null;
  onView: (car: Car) => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
  onRetry: () => void;
}

function Actions({ car, onView, onEdit, onDelete }: Pick<CarListProps, "onView" | "onEdit" | "onDelete"> & { car: Car }) {
  return <div className="row-actions">
    <button className="icon-button" type="button" aria-label={`View details for ${car.brand} ${car.model}`} title="View details" onClick={() => onView(car)}><Icon name="eye" size={18} /></button>
    <button className="icon-button" type="button" aria-label={`Edit ${car.brand} ${car.model}`} title="Edit car" onClick={() => onEdit(car)}><Icon name="edit" size={18} /></button>
    <button className="icon-button icon-button-danger" type="button" aria-label={`Delete ${car.brand} ${car.model}`} title="Delete car" onClick={() => onDelete(car)}><Icon name="trash" size={18} /></button>
  </div>;
}

function LoadingState() {
  return <div className="loading-state" role="status" aria-live="polite"><span className="spinner" /><span>Loading vehicle inventory...</span></div>;
}

export default function CarList(props: CarListProps) {
  const { cars, isLoading, error, onView, onEdit, onDelete, onRetry } = props;
  if (isLoading) return <LoadingState />;
  if (error) return <section className="state-card error-state" role="alert"><Icon name="info" size={28} /><h2>Inventory unavailable</h2><p>{error}</p><button className="button button-secondary" type="button" onClick={onRetry}>Try Again</button></section>;
  if (!cars.length) return <section className="state-card"><span className="state-icon"><Icon name="car" size={30} /></span><h2>No cars found</h2><p>Try adjusting or resetting the current filters.</p></section>;

  return (
    <section className="inventory-section" aria-labelledby="results-heading">
      <p className="results-count" id="results-heading"><strong>{cars.length}</strong> {cars.length === 1 ? "car" : "cars"} found</p>
      <div className="table-shell">
        <table>
          <thead>
            <tr><th>Vehicle</th><th>Brand</th><th>Model</th><th>Color</th><th>Year</th><th>Horsepower</th><th>Doors</th><th className="actions-heading">Actions</th></tr>
          </thead>
          <tbody>
            {cars.map((car) => <tr key={car.id}>
              <td><img className="vehicle-thumbnail" src={carPlaceholder} alt={`${car.brand} ${car.model} vehicle placeholder`} /></td>
              <td className="cell-strong">{car.brand}</td><td>{car.model}</td><td><span className="color-badge">{car.color}</span></td><td>{car.year}</td><td><span className="hp-badge">{car.horsepower} HP</span></td><td>{car.doorCount}</td>
              <td><Actions car={car} onView={onView} onEdit={onEdit} onDelete={onDelete} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="mobile-car-list">{cars.map((car) => <article className="car-card" key={car.id}>
        <img src={carPlaceholder} alt={`${car.brand} ${car.model} vehicle placeholder`} />
        <div className="car-card-body"><div className="car-card-heading"><div><span>{car.year}</span><h2>{car.brand} {car.model}</h2></div><span className="hp-badge">{car.horsepower} HP</span></div>
          <dl><div><dt>Color</dt><dd>{car.color}</dd></div><div><dt>Doors</dt><dd>{car.doorCount}</dd></div></dl>
          <Actions car={car} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </article>)}</div>
    </section>
  );
}
