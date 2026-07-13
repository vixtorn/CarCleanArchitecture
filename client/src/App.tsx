import { useCallback, useEffect, useState } from "react";
import "./App.css";
import CarDetails from "./components/CarDetails";
import CarFilterForm from "./components/CarFilterForm";
import CarFormDrawer from "./components/CarFormDrawer";
import CarList from "./components/CarList";
import DashboardHeader from "./components/DashboardHeader";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import Notification, { type Notice } from "./components/Notification";
import StatsCards from "./components/StatsCards";
import { createCar, deleteCar, getCarById, getCars, updateCar } from "./services/carApi";
import type { Car } from "./types/car";
import type { CarQueryParameters } from "./types/CarQueryParameters";
import type { CreateCarRequest } from "./types/CreateCar";

function safeMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error) || error instanceof TypeError || error.message === "Failed to fetch") return fallback;
  return error.message;
}

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [query, setQuery] = useState<CarQueryParameters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"closed" | "create" | "edit">("closed");
  const [editingCar, setEditingCar] = useState<Car | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailCar, setDetailCar] = useState<Car | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadCars = useCallback(async (activeQuery: CarQueryParameters) => {
    setIsLoading(true); setListError(null);
    try { setCars(await getCars(activeQuery)); }
    catch (error) { setListError(safeMessage(error, "We couldn't load the inventory. Please try again.")); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    let ignore = false;
    void getCars().then((data) => { if (!ignore) setCars(data); }).catch((error: unknown) => {
      if (!ignore) setListError(safeMessage(error, "We couldn't load the inventory. Please try again."));
    }).finally(() => { if (!ignore) setIsLoading(false); });
    return () => { ignore = true; };
  }, []);
  const showNotice = useCallback((type: Notice["type"], message: string) => setNotice({ id: Date.now(), type, message }), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  function openCreate() { setEditingCar(undefined); setFormError(null); setFormMode("create"); }
  function openEdit(car: Car) { setDetailsOpen(false); setEditingCar(car); setFormError(null); setFormMode("edit"); }
  function closeForm() { if (!isSubmitting) { setFormMode("closed"); setEditingCar(undefined); setFormError(null); } }

  async function handleFormSubmit(request: CreateCarRequest) {
    setIsSubmitting(true); setFormError(null);
    try {
      if (formMode === "edit" && editingCar) { await updateCar(editingCar.id, request); showNotice("success", `${request.brand} ${request.model} was updated.`); }
      else { await createCar(request); showNotice("success", `${request.brand} ${request.model} was added to inventory.`); }
      setFormMode("closed"); setEditingCar(undefined); await loadCars(query);
    } catch (error) { const message = safeMessage(error, "The vehicle couldn't be saved. Please try again."); setFormError(message); }
    finally { setIsSubmitting(false); }
  }

  async function openDetails(car: Car) {
    setDetailsOpen(true); setDetailCar(null); setDetailError(null); setDetailLoading(true);
    try { setDetailCar(await getCarById(car.id)); }
    catch (error) { setDetailError(safeMessage(error, "We couldn't load this vehicle. Please try again.")); }
    finally { setDetailLoading(false); }
  }

  function requestDelete(car: Car) { setDetailsOpen(false); setCarToDelete(car); }
  async function confirmDelete() {
    if (!carToDelete || isDeleting) return;
    setIsDeleting(true);
    try { const deleted = carToDelete; await deleteCar(deleted.id); setCarToDelete(null); setCars((current) => current.filter((car) => car.id !== deleted.id)); showNotice("success", `${deleted.brand} ${deleted.model} was deleted.`); }
    catch (error) { showNotice("error", safeMessage(error, "The car couldn't be deleted. Please try again.")); }
    finally { setIsDeleting(false); }
  }

  return <>
    <DashboardHeader onAdd={openCreate} />
    <main className="dashboard-container">
      <StatsCards cars={cars} />
      <CarFilterForm isLoading={isLoading} onApply={(nextQuery) => { setQuery(nextQuery); void loadCars(nextQuery); }} onReset={() => { setQuery({}); void loadCars({}); }} />
      <CarList cars={cars} isLoading={isLoading} error={listError} onView={(car) => void openDetails(car)} onEdit={openEdit} onDelete={requestDelete} onRetry={() => void loadCars(query)} />
    </main>
    <CarFormDrawer isOpen={formMode !== "closed"} car={formMode === "edit" ? editingCar : undefined} isSubmitting={isSubmitting} error={formError} onClose={closeForm} onSubmit={handleFormSubmit} />
    <CarDetails isOpen={detailsOpen} car={detailCar} isLoading={detailLoading} error={detailError} onClose={() => setDetailsOpen(false)} onEdit={openEdit} onDelete={requestDelete} />
    <DeleteConfirmationModal car={carToDelete} isDeleting={isDeleting} onCancel={() => { if (!isDeleting) setCarToDelete(null); }} onConfirm={() => void confirmDelete()} />
    <Notification notice={notice} onDismiss={dismissNotice} />
  </>;
}

export default App;
