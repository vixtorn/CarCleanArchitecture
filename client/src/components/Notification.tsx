import { useEffect } from "react";
import Icon from "./Icon";

export interface Notice { id: number; type: "success" | "error"; message: string; }
interface NotificationProps { notice: Notice | null; onDismiss: () => void; }

export default function Notification({ notice, onDismiss }: NotificationProps) {
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(onDismiss, 5000); return () => window.clearTimeout(timer); }, [notice, onDismiss]);
  if (!notice) return null;
  return <div className={`notification notification-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}><span className="notification-icon"><Icon name={notice.type === "success" ? "check" : "info"} /></span><p>{notice.message}</p><button type="button" aria-label="Dismiss notification" title="Dismiss" onClick={onDismiss}><Icon name="close" size={18} /></button></div>;
}
