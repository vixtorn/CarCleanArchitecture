import Icon from "./Icon";

interface DashboardHeaderProps { onAdd: () => void; }

export default function DashboardHeader({ onAdd }: DashboardHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-lockup">
          <div className="brand-title"><span className="brand-icon"><Icon name="car" size={24} /></span><span>Car Inventory</span></div>
          <p>Manage, filter, add, update, and remove vehicles from your inventory.</p>
        </div>
        <button className="button button-primary header-action" type="button" onClick={onAdd}>
          <Icon name="plus" size={18} /> Add New Car
        </button>
      </div>
    </header>
  );
}
