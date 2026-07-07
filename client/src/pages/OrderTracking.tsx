import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Order } from "../types"
import { Loading } from "../components/Loading"
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import OrderOTP from "../components/OrderTracking/OrderOTP"
import LiveMap from "../components/OrderTracking/LiveMap"
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine"
import api from "../config/api"
import toast from "react-hot-toast"


export function OrderTracking() {

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "AOA";

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "Placed":
                return "Pedido realizado";
            case "Confirmed":
                return "Confirmado";
            case "Assigned":
                return "Entregador atribuído";
            case "Packed":
                return "Embalado";
            case "Out for Delivery":
                return "Saiu para entrega";
            case "Delivered":
                return "Entregue";
            case "Cancelled":
                return "Cancelado";
            default:
                return status;
        }
    };

    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [liveLocation, setLocation] = useState<{ lat: number, lng: number } | null>(null)

    useEffect(() => {
        api.get(`/orders/${id}`)
            .then((response) => {
                setOrder(response.data.order)
            })
            .catch((error) => {
                console.error("Error fetching order:", error)
                navigate("/orders")
            }).finally (() => setLoading(false))
    }, [id, navigate])

    // Localizacao ao vivo em 10 segundos
    useEffect(() => {
        if(!order || ["Delivered", "Cancelled", "Placed"].includes(order.status)) return

        const fetchLocation = async () => {
            try {
                const  { data } = await api.get(`/orders/${id}/live-location`)
                if(data.liveLocation?.lat && data.liveLocation?.lng && data.liveLocation.updatedAt) {
                    setLocation({
                        lat: data.liveLocation.lat,
                        lng: data.liveLocation.lng
                    })
                }
                // Also update the order status if it has changed
                if(data.status && data.status !== order.status) {
                    setOrder((prevOrder) => prevOrder ? { ...prevOrder, status: data.status } : prevOrder)
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || error.message || "Erro ao obter localização ao vivo.")
            }
        }
        fetchLocation() // initial fetch
        const interval = setInterval(fetchLocation, 10000) // fetch every 10 seconds
        return () => clearInterval(interval)

    }, [id, order?.status])

    if (loading) return <Loading />
    if (!order) return null

    return (
        <div className="min-h-screen mb-20 bg-app-cream">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <button onClick={() => navigate("/orders")} className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors">
                    <ArrowLeftIcon className="size-4" /> Voltar ao Pedido
                </button>
                {/* Order id, date, status */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-app-green">Pedido #{order!.id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm text-app-text-light mt-1">Feito em {new Date(order!.createdAt).toLocaleDateString("pt-BR", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${order.status === "Delivered" ? "bg-red-100 text-green-700" : order!.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-app-orange/10 text-app-orange"}`}>
                        {getStatusLabel(order!.status)}
                    </span>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left side - Timeline + Map Area */}
                    <div className="lg:col-span-2 space-y-6 ">
                        {/*  OTD Card */}
                        <OrderOTP order={order} />

                        {/* Live Tracking Map */}
                        <LiveMap order={order} liveLocation={liveLocation} />

                        {/* Previous Timeline */}
                        <OrderTimeLine order={order} />

                        {/* Delivery Person Details */}
                        {order?.deliveryPartner && order.status !== "Delivered" && order.status !== "Cancelled" && (
                            <div className="bg-white rounded-2xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-full bg-app-green flex-center">
                                        <span className="text-white text-sm font-semibold">
                                            {order.deliveryPartner.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-app-green">
                                            {order.deliveryPartner.name}
                                        </p>
                                        <p className="text-xs text-app-text-light capitalize">
                                            {order.deliveryPartner.vehicleType} * Parceiro de Entrega
                                        </p>
                                    </div>
                                </div>
                                <a href={`tel:${order.deliveryPartner.phone}`} className="p-2.5 bg-app-cream rounded-xl hover:bg-app-green/10 transition-colors">
                                    <PhoneIcon className="size-4 text-app-green" />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right side - Order Details */}
                    <div className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-app-green mb-3 flex items-center gap-2"><MapPinIcon className="size-4 text-app-green" /> Endereço de Entrega</h3>
                            <p className="text-sm text-app-text-light leading-relaxed">
                                {order?.shippingAddress.label}
                                <br />
                                {order?.shippingAddress.address}
                                <br />
                                {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zip}
                                <br />
                                {order.shippingAddress.zip}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="bg-white rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-app-green mb-3">Itens ({order?.items.length})</h3>
                            
                            <div className="space-y-3">
                                {order?.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3" >
                                        <img src={item.image} alt={item.name} className="size-10 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-app-green truncate">{item.name}</p>
                                            <p className="text-xs text-app-text-light">
                                                x{item.quantity}
                                            </p>
                                        </div>
                                        <span>
                                            {currency} {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-app-border space-y-1.5 text-sm">
                            <div className="flex justify-between">
                                    <span className="text-app-text-light">Subtotal</span>
                                    <span>{currency} {order?.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-app-text-light">Entrega</span>
                                    <span>{order?.deliveryFee === 0 ? "Grátis" : `${currency} ${order?.deliveryFee.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-app-text-light">Imposto</span>
                                    <span>{currency} {order?.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-app-text-light">Total</span>
                                    <span>{currency} {order?.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}