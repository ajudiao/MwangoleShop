import { useEffect, useState } from "react"
import type { Order } from "../types"
import { Link, useSearchParams } from "react-router-dom"
import { dummyDashboardOrdersData, statusColors } from "../assets/assets"
import { useCart } from "../contexts/CartContext"
import { Loading } from "../components/Loading"
import { CalendarIcon, ChevronRightIcon, PackageIcon } from "lucide-react"

export function MyOrders() {

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "AOA";

    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")
    const [searchParams, setSearchParams] = useSearchParams()

    const tabs = ["all", "Pendente", "Enviado", "Saiu para Entrega", "Entregue"]

    const { clearCart } = useCart()

    const fetchOrders = async () => {
        setOrders(dummyDashboardOrdersData as any)
        setLoading(false)
    }

    useEffect(() => {
        if (searchParams.get("clearCart")) {
            clearCart()
            setSearchParams({})
            setTimeout(() => {
                fetchOrders()
            }, 2000)
        } else {
            fetchOrders()
        }
        // setLoading(false)
    }, [activeTab])

    return (
        <div className="min-h-screen bg-app-cream mb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-app-green mb-6">  Meus Pedidos</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-auto pb-2">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${activeTab === tab ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-app-cream"}`}>{tab === "all" ? "Todos os pedidos" : tab}</button>
                    ))}
                </div>

                {/* Orders List */}
                {loading ? (
                    <Loading />
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <PackageIcon className="size-16 text-app-border mx-auto mb-4" />
                        <h2 className="text-lg font-medium text-app-green mb-4">Sem pedidos ainda</h2>
                        <p className="text-sm text-app-text-light mb-4">  Faça as suas compras para ver os seus pedidos aqui.</p>
                        <Link to="/products" className="inline-flex px-4 py-2 bg-app-green text-white text-sm rounded-lg"> Começar a Comprar</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link key={order.id} to={`/orders/${order.id}`} className="block max-w-4xl bg-white rounded-2xl p-5  hover:shadow transition-all">
                                {/* Order id, date & status */}
                                <div className="flex items-start justify-between mb-3">
                                    {/* Left side */}
                                    <div>
                                        <p className="text-sm font-medium text-app-green">Order #{order.id.slice(-8).toUpperCase()} </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <CalendarIcon className="size-3 text-app-text-light" />
                                            <span className="text-xs text-app-text-light">{new Date(order.createdAt).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" })}</span>
                                        </div>
                                    </div>
                                    {/* Right side */}
                                    <div className="flex items-center gap-2">
                                        <span className={`px-4 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                            {order.status}
                                        </span>
                                        <ChevronRightIcon className="size-4 text-app-text-light" />
                                    </div>
                                </div>
                                {/* Item thmbnails */}
                                <div className="flex items-center gap-2  mb-3">
                                    {order.items.slice(0, 4).map((item, index) => (
                                        <img src={item.image} key={index} alt={item.name} className="size-12 sm:size-16 rounded-lg object-cover border border-app-border" />
                                    ))}
                                    {order.items.length > 4 && <div className="size-12 sm:size-16 rounded-lg bg-app-cream flex-center text-xs font-semibold text-app-text-light">
                                        +{order.items.length - 4}
                                    </div>}
                                </div>

                                {/* Total item & price */}
                                <div className="flex justify-between items-center pt-3">
                                    <span className="">
                                        {order.items.length} itens
                                    </span>
                                    <span className="font-semibold text-app-green">
                                        {currency} {order.total.toFixed(2)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}