import Icon from "./Icon";

interface DashboardHeaderProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  userEmail?: string;
  onLogin: () => void;
  onLogout: () => void;
  onAdd: () => void;
}

export default function DashboardHeader({
  isAuthenticated,
  isAuthLoading,
  userEmail,
  onLogin,
  onLogout,
  onAdd,
}: DashboardHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-lockup">
          <div className="brand-title">
            <span className="brand-icon">
              <Icon name="car" size={24} />
            </span>

            <span>Car Inventory</span>
          </div>

          <p>
            Manage, filter, add, update, and remove
            vehicles from your inventory.
          </p>
        </div>

        <div className="header-actions">
          {isAuthLoading ? (
            <button
              type="button"
              className="button header-action"
              disabled
            >
              Checking session...
            </button>
          ) : isAuthenticated ? (
            <>
              {userEmail && (
                <span className="header-user-email">
                  {userEmail}
                </span>
              )}

              <button
                type="button"
                className="button header-action"
                onClick={onLogout}
              >
                Logout
              </button>

              <button
                type="button"
                className="button button-primary header-action"
                onClick={onAdd}
              >
                <Icon name="plus" size={18} />
                Add New Car
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button button-primary header-action"
              onClick={onLogin}
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}