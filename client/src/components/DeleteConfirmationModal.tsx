import { useEffect, useRef } from "react";
import type { Car } from "../types/car";
import Icon from "./Icon";

interface DeleteConfirmationModalProps { car: Car | null; isDeleting: boolean; onCancel: () => void; onConfirm: () => void; }

export default function DeleteConfirmationModal({ car, isDeleting, onCancel, onConfirm }: DeleteConfirmationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = dialogRef.current; if (car && !dialog?.open) dialog?.showModal(); if (!car && dialog?.open) dialog.close(); }, [car]);
  return <dialog className="modal confirmation-modal" ref={dialogRef} onCancel={(event) => { event.preventDefault(); if (!isDeleting) onCancel(); }} onClick={(event) => { if (event.target === event.currentTarget && !isDeleting) onCancel(); }} aria-labelledby="delete-title">
    <div className="confirmation-card"><span className="danger-icon"><Icon name="trash" size={24} /></span><h2 id="delete-title">Delete {car?.brand} {car?.model}?</h2><p>This permanently removes the car from your inventory. This action cannot be undone.</p><div className="modal-actions"><button className="button button-ghost" type="button" onClick={onCancel} disabled={isDeleting}>Cancel</button><button className="button button-danger" type="button" onClick={onConfirm} disabled={isDeleting}>{isDeleting && <span className="spinner spinner-small" />}{isDeleting ? "Deleting..." : "Delete Car"}</button></div></div>
  </dialog>;
}
