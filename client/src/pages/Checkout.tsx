import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext";
import type { Address } from "../types";
import { ArrowLeft, CheckIcon, ChevronRight, CreditCardIcon, MapPinIcon } from "lucide-react";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import api from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export function Checkout() {
    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "AOA";

    const { items, cartTotal, clearCart } = useCart()
    const { user } = useAuth()
 
    const [step, setStep] = useState("address")
    const [loading, setLoading] = useState(false)

    const [address, setAddress] = useState<Address>({
        id: "",
        label: "Home",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
        lat: 0,
        lng: 0,
    })

    const [paymentMethod, setPaymentMethod] = useState('card')
    const deliveryFee = cartTotal > 20 ? 0 : 20
    const tax = cartTotal * 0.2
    const total = cartTotal + deliveryFee + tax

    const steps: { key: string; label: string; icon: typeof MapPinIcon }[] = [
        { key: "address", label: "Endereço", icon: MapPinIcon },
        { key: "payment", label: "Pagamento", icon: CreditCardIcon },
        { key: "review", label: "Revisar", icon: CheckIcon },
    ]

    const handlePlaceOrder = async () => {
        setLoading(true)
        try {
            const orderItems = items.map((item) => ({
                productId: item.product?.id,
                quantity: item.quantity,
            }))

            const invalidItem = orderItems.find((item) => !item.productId)
            if (invalidItem) {
                toast.error('Há um item no carrinho sem productId válido. Atualize o carrinho e tente novamente.')
                setLoading(false)
                return
            }

            const orderData = {
                items: orderItems,
                shippingAddress: address,
                paymentMethod,

            }

            const { data } = await api.post("/orders", orderData)
            console.log("Pedido realizado com sucesso:", data)
            //clearCart()

            if(data.url) {
                window.location.href = data.url 
                return
            }
            clearCart()
            toast.success("Pedido realizado com sucesso!")
            navigate(`/orders/${data.order.id}`)
        } catch(error: any) {
            toast.error((error.response?.data?.message || error.message || "Erro ao realizar pedido."))
        } finally {
            setLoading(false)
            scrollTo(0, 0)
        }
    }

    // Populate address from user's default address
    useState(() => {
        if (user?.addresses?.length) {
            const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0]
            setAddress({
                id: defaultAddr?.id,
                label: defaultAddr?.label,
                address: defaultAddr?.address,
                city: defaultAddr?.city,
                state: defaultAddr?.state,
                zip: defaultAddr?.zip,
                isDefault: defaultAddr?.isDefault,
                lat: defaultAddr?.lat,
                lng: defaultAddr?.lng,
            })
        }
    })

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-app-cream flex-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-app-green mb-2">Seu carrinho está vazio</h2>
                    <p className="text-sm text-app-text-light mb-4">Adicione alguns produtos para finalizar a compra</p>
                    <button onClick={() => navigate('/products')} className="px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-colors">
                        Ver Produtos
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-app-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banck button */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors">
                    <ArrowLeft className="size-4" /> Voltar
                </button>

                <h1 className="text-2xl font-semibold text-app-green mb-8">Finalizar Compra</h1>
                {/* Steps */}
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((st, index) => (
                        <div key={st.key} className="flex items-center gap-2">
                            <button onClick={() => setStep(st.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${step === st.key ? "bg-app-green text-white" : "bg-white text-app-text-light"}`}>
                                <st.icon className="size-4" /> {st.label}
                                {index < step.length - 1 && <ChevronRight className="size-4 text-app-text-light" />}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main form */}
                    <div className="md:col-span-2">
                        {step === "address" && <CheckoutAddress address={address} setAddress={setAddress} setStep={setStep} user={user} />}
                        {step === "payment" && <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setStep={setStep} />}
                        {step === "review" && <CheckoutReview address={address} items={items} handlePlaceOrder={handlePlaceOrder} loading={loading} total={total} />}
                    </div>


                    {/* Oder sumery sidebar */}
                    <div className="bg-white rounded-2xl p-5 h-fit sticky top-24">
                        <h3 className="text-sm font-semibold text-app-green mb-4">Resumo do Pedido</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-app-text-light">Subtotal ({items.length} itens)</span>
                                <span>{currency} {cartTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-app-text-light">Entrega</span>
                                <span>{deliveryFee === 0 ? <span className="text-app-success">Grátis</span> : `${currency} ${deliveryFee.toFixed(2)}`}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-app-text-light">Imposto</span>
                                <span>{currency} {tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-app-border text-base font-semibold">
                                <span>Total</span>
                                <span className="text-app-green">{currency} {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}