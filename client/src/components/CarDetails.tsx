import { useEffect, useRef } from "react";
import carPlaceholder from "../assets/car-placeholder.png";
import type { Car } from "../types/car";
import Icon from "./Icon";

interface CarDetailsProps {
  isOpen: boolean;
  car: Car | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export default function CarDetails({ isOpen, car, isLoading, error, onClose, onEdit, onDelete }: CarDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog?.open) dialog?.showModal();
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  return <dialog className="modal details-modal" ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="details-title">
    <div className="modal-card">
      <div className="details-image"><img src={carPlaceholder} alt={car ? `${car.brand} ${car.model} vehicle placeholder` : "Vehicle placeholder"} /><button className="modal-close" type="button" aria-label="Close vehicle details" title="Close" onClick={onClose}><Icon name="close" /></button></div>
      {isLoading && <div className="loading-state"><span className="spinner" /> Loading vehicle details...</div>}
      {error && <div className="details-content error-state" role="alert"><h2 id="details-title">Vehicle unavailable</h2><p>{error}</p></div>}
      {car && !isLoading && !error && <div className="details-content">
        <div className="details-heading"><span className="eyebrow"><Icon name="car" size={16} /> Vehicle details</span><h2 id="details-title">{car.brand} {car.model}</h2><p>Inventory record</p></div>
        <dl className="spec-grid"><div><dt>Year</dt><dd>{car.year}</dd></div><div><dt>Color</dt><dd>{car.color}</dd></div><div><dt>Horsepower</dt><dd>{car.horsepower} HP</dd></div><div><dt>Door Count</dt><dd>{car.doorCount} doors</dd></div></dl>
        <div className="technical-details"><span>Technical ID</span><code>{car.id}</code></div>
        <div className="modal-actions"><button className="button button-danger-soft" type="button" onClick={() => onDelete(car)}><Icon name="trash" size={18} /> Delete</button><button className="button button-secondary" type="button" onClick={() => onEdit(car)}><Icon name="edit" size={18} /> Edit Car</button></div>
      </div>}
    </div>
  </dialog>;
}
