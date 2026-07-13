import { useEffect, useRef } from "react";
import type { Car } from "../types/car";
import type { CreateCarRequest } from "../types/CreateCar";
import CreateCarForm from "./CreateCarForm";
import Icon from "./Icon";

interface CarFormDrawerProps {
  isOpen: boolean; car?: Car; isSubmitting: boolean; error: string | null;
  onClose: () => void; onSubmit: (request: CreateCarRequest) => Promise<void>;
}

export default function CarFormDrawer({ isOpen, car, isSubmitting, error, onClose, onSubmit }: CarFormDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = dialogRef.current; if (isOpen && !dialog?.open) dialog?.showModal(); if (!isOpen && dialog?.open) dialog.close(); }, [isOpen]);
  const title = car ? "Edit Car" : "Add New Car";
  return <dialog className="drawer" ref={dialogRef} onCancel={(event) => { event.preventDefault(); if (!isSubmitting) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }} aria-labelledby="form-drawer-title">
    <div className="drawer-panel">
      <header className="drawer-header"><div><h2 id="form-drawer-title">{title}</h2><p>{car ? "Update this vehicle's inventory details." : "Enter vehicle details to add to inventory."}</p></div><button className="icon-button" type="button" aria-label={`Close ${title.toLowerCase()}`} title="Close" onClick={onClose} disabled={isSubmitting}><Icon name="close" /></button></header>
      <div className="drawer-body"><CreateCarForm key={car?.id ?? "new"} car={car} isSubmitting={isSubmitting} onSubmit={onSubmit} />{error && <div className="inline-error" role="alert"><Icon name="info" /> {error}</div>}</div>
      <footer className="drawer-footer"><button className="button button-ghost" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button><button className="button button-primary" type="submit" form="vehicle-form" disabled={isSubmitting}>{isSubmitting && <span className="spinner spinner-small" />}{isSubmitting ? (car ? "Saving..." : "Adding...") : (car ? "Save Changes" : "Add Car")}</button></footer>
    </div>
  </dialog>;
}
