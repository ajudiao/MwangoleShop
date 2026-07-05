import { useEffect, useState } from "react";
import type { Address } from "../types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import { Loading } from "../components/Loading";
import { AddressCard } from "../components/AddressCard";
import { AddressForm } from "../components/AddressForm";
import { useAuth } from "../contexts/AuthContext";
import api from "../config/api";
import toast from "react-hot-toast";


export function Addresses() {
    const { updateUser } = useAuth()

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<Address>({
        id: "",
        label: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
        lat: 0,
        lng: 0,
    });

    const resetForm = () => {
        setForm({
            id: "",
            label: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            isDefault: false,
            lat: 0,
            lng: 0,
        })
        setShowForm(false)
        setEditingId(null)
    }
    const getLocation = (retries = 3): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocalização não suportada pelo navegador."));
                return;
            }

            const attempt = (remainingRetries: number) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        // Se o utilizador negou explicitamente, para imediatamente
                        if (error.code === error.PERMISSION_DENIED) {
                            reject(new Error("Permissão de localização recusada pelo utilizador."));
                            return;
                        }

                        // Tenta novamente apenas para TIMEOUT ou POSITION_UNAVAILABLE
                        if (remainingRetries > 0) {
                            setTimeout(() => attempt(remainingRetries - 1), 1000);
                        } else {
                            reject(
                                new Error(
                                    "Não foi possível obter a localização após várias tentativas. Insira manualmente."
                                )
                            );
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000, // Reduzido para 10s para responder mais rápido entre tentativas
                        maximumAge: 60000,
                    }
                );
            };

            attempt(retries);
        });
    };


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const coords = await getLocation();
            const payload = {
                ...form,
                ...coords
            };

            if (editingId) {
                // Update existing address
                const { data } = await api.put(`/addresses/${editingId}`, payload);
                setAddresses(data.addresses);
                updateUser({ addresses: data.addresses });
                toast.success("Endereço atualizado com sucesso!");
            } else {
                // Create new address
                const { data } = await api.post("/addresses", payload);
                setAddresses(data.addresses);
                updateUser({ addresses: data.addresses });
                toast.success("Endereço adicionado com sucesso!");
            }
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao obter localização.");
        }
    }

    const onEditHandler = (add: Address) => {
        setForm({
            id: add.id,
            label: add.label,
            address: add.address,
            city: add.city,
            state: add.state,
            zip: add.zip,
            isDefault: add.isDefault,
            lat: add.lat,
            lng: add.lng,
        });
        setEditingId(add.id)
        setShowForm(true)
    }

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const { data } = await api.get("/addresses");
                setAddresses(data.addresses);
            } catch (error: any) {
                toast.error(error.response?.data?.message || error.message || "Erro ao carregar endereços.");
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [])

    return (
        <div className="min-h-screen bg-app-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold text-app-green">Meus Endereços</h1>
                    <button className="px-4 py-2 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2" onClick={() => { resetForm(); setShowForm(true) }}>
                        <PlusIcon className="size-4" />
                        Adicionar Novo Endereço
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && <AddressForm resetForm={resetForm} handleSubmit={handleSubmit} form={form} setForm={setForm} editingId={editingId} />}

                {/* Address List */}
                {
                    loading ? (
                        <Loading />
                    ) : addresses.length === 0 ? (
                        <div className="text-center py-16">
                            <MapPinIcon className="size-16 text-app-border mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-app-green mb-2">Nenhum endereço encontrado</h2>
                            <p className="text-sm text-app-text-light">Você ainda não adicionou nenhum endereço.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <AddressCard key={address.id} addr={address} onEditHandler={onEditHandler} setAddresses={setAddresses} />
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    )
}
