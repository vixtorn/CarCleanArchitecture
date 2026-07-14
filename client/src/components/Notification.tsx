import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

export interface Notice {
  id: number;
  type: "success" | "error";
  message: string;
}

interface NotificationProps {
  notice: Notice | null;
  onDismiss: () => void;
}

export default function Notification({
  notice,
  onDismiss,
}: NotificationProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const layer = layerRef.current;

    // Popover API destekleniyorsa bildirimi tarayıcının top layer'ına taşır.
    // Desteklenmeyen tarayıcılarda portal + yüksek z-index fallback olarak çalışır.
    if (layer && typeof layer.showPopover === "function") {
      try {
        if (!layer.matches(":popover-open")) {
          layer.showPopover();
        }
      } catch {
        // Portal ve z-index fallback'i bildirimi göstermeye devam eder.
      }
    }

    const timer = window.setTimeout(onDismiss, 5000);

    return () => {
      window.clearTimeout(timer);

      if (layer && typeof layer.hidePopover === "function") {
        try {
          if (layer.matches(":popover-open")) {
            layer.hidePopover();
          }
        } catch {
          // Bildirim zaten kapanmışsa ek işlem gerekmez.
        }
      }
    };
  }, [notice, onDismiss]);

  if (!notice) {
    return null;
  }

  return createPortal(
    <div
      ref={layerRef}
      className="notification-layer"
      popover="manual"
      aria-live={notice.type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div
        className={`notification notification-${notice.type}`}
        role={notice.type === "error" ? "alert" : "status"}
      >
        <span className="notification-icon" aria-hidden="true">
          <Icon
            name={notice.type === "success" ? "check" : "info"}
          />
        </span>

        <p>{notice.message}</p>

        <button
          type="button"
          aria-label="Dismiss notification"
          title="Dismiss"
          onClick={onDismiss}
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>,
    document.body,
  );
}