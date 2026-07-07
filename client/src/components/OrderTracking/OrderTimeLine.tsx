import { ClockIcon, CheckIcon, TruckIcon, PackageIcon } from "lucide-react";
import type { Order } from "../../types";

export default function OrderTimeLine({ order }: { order: Order }) {

    const statusSteps = [
        { key: "Placed", label: "Pedido realizado" },
        { key: "Confirmed", label: "Confirmado" },
        { key: "Assigned", label: "Entregador atribuído" },
        { key: "Packed", label: "Embalado" },
        { key: "Out for Delivery", label: "Saiu para entrega" },
        { key: "Delivered", label: "Entregue" },
    ];
    const currentIdx = statusSteps.findIndex((step) => step.key === order.status);

    const statusIcons: Record<string, typeof ClockIcon> = {
        Placed: ClockIcon,
        Confirmed: CheckIcon,
        Assigned: TruckIcon,
        Packed: PackageIcon,
        "Out for Delivery": TruckIcon,
        Delivered: CheckIcon,
    };

    return (
        <div className="bg-white rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-app-green mb-6">Progresso da entrega</h2>
            <div className="space-y-0">
                {statusSteps.map((step, i) => {
                    const Icon = statusIcons[step.key] || PackageIcon;
                    const isCompleted = i <= currentIdx;
                    const isCurrent = i === currentIdx;

                    const historyEntry = order.statusHistory.find((h) => h.status === step.key);

                    return (
                        <div key={step.key} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`size-9 rounded-full flex-center shrink-0 ${isCompleted ? "bg-app-green text-white" : "bg-app-cream text-app-text-light"} ${isCurrent ? "ring-4 ring-app-green/20" : ""}`}>
                                    <Icon className="size-4" />
                                </div>
                                {i < statusSteps.length - 1 && <div className={`w-0.5 h-12 ${i < currentIdx ? "bg-app-green" : "bg-app-border"}`} />}
                            </div>
                            <div className="pb-6">
                                <p className={`text-sm font-semibold ${isCompleted ? "text-app-green" : "text-app-text-light"}`}>{step.label}</p>
                                {historyEntry && <p className="text-xs text-app-text-light mt-0.5">{new Date(historyEntry.timestamp).toLocaleString("pt-BR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
