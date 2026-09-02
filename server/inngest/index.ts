import { cron, Inngest } from "inngest";
import { prisma } from "../config/prisma.js";
import sendEmail from "../config/nodemailer.js";

const LOW_STOCK_THRESHOLD = 10;

const normalizeEmails = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

// Cria um cliente para enviar e receber eventos
export const inngest = new Inngest({ id: "mwangole-shop" });

// Alerta de estoque baixo para o e-mail do administrador
const checkLowStock = inngest.createFunction(
  {
    id: "check-low-stock",
    name: "Alerta de Estoque Baixo",
    triggers: [{ event: "inventory/stock.updated" }],
  },
  async ({ event, step }) => {
    const { productId } = event.data;

    const product = await step.run("fetch-product", async () => {
      return await prisma.product.findUnique({
        where: { id: productId },
      });
    });

    if (
      !product ||
      product.stock === null ||
      product.stock >= LOW_STOCK_THRESHOLD
    ) {
      return { skipped: true, stock: product?.stock };
    }

    await step.run("send-low-stock-email", async () => {
      const adminEmails = normalizeEmails(process.env.ADMIN_EMAILS);

      if (adminEmails.length === 0)
        return { skipped: true, reason: "No admin emails" };

      try {
        await sendEmail({
          to: adminEmails.join(","),
          subject: `Alerta de Estoque Baixo: ${product.name}`,
          body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 24px 28px;">
                            <h2 style="color: #fff; margin: 0; font-size: 20px;">Alerta de Estoque Baixo</h2>
                        </div>
                        <div style="padding: 28px;">
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                                ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover;" />` : ""}
                                <div>
                                    <h3 style="margin: 0 0 4px; font-size: 18px; color: #111827;">${product.name}</h3>
                                    <p style="margin: 0; font-size: 14px; color: #6b7280;">${product.category} • ${product.unit}</p>
                                </div>
                            </div>
                            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; text-align: center;">
                                <p style="margin: 0 0 4px; font-size: 13px; color: #991b1b; font-weight: 600;">ESTOQUE ATUAL</p>
                                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #dc2626;">${product.stock}</p>
                                <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">unidades restantes</p>
                            </div>
                            <p style="margin: 20px 0 0; font-size: 13px; color: #9ca3af; text-align: center;">Por favor, reabastece este item o quanto antes.</p>
                        </div>
                    </div>`,
        });
      } catch (error) {
        console.error("Falha ao enviar alerta de estoque baixo", error);
        return { skipped: true, reason: "Falha ao enviar email" };
      }
    });

    return { alerted: true, product: product.name, stock: product.stock };
  },
);

// E-mail mensal de ofertas (1º de cada mês - dia de pagamento)
const sendMonthlyOffers = inngest.createFunction(
  {
    id: "send-monthly-offers",
    name: "Ofertas de Dia de Pagamento",
    triggers: [cron("0 10 1 * *")],
  },
  async ({ step }) => {
    const { deals, users } = await step.run(
      "fetch-deals-and-users",
      async () => {
        const products = await prisma.product.findMany({
          where: { stock: { gt: 0 } },
          take: 20,
        });

        const featuredDeals = products
          .map((product) => {
            const originalPrice = product.originalPrice ?? product.price;
            const discountPercent =
              originalPrice > product.price
                ? ((originalPrice - product.price) / originalPrice) * 100
                : 0;

            return { ...product, discountPercent };
          })
          .sort(
            (a, b) =>
              b.discountPercent - a.discountPercent ||
              (b.originalPrice ?? b.price) - (a.originalPrice ?? a.price),
          )
          .slice(0, 6);

        const allUsers = await prisma.user.findMany({
          select: { name: true, email: true },
        });
        return { deals: featuredDeals, users: allUsers };
      },
    );

    if (users.length === 0 || deals.length === 0) {
      return { skipped: true, reason: "No users or deals" };
    }

    let sentCount = 0;

    // Envia em lotes de 10 para não sobrecarregar o servidor de e-mail
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      await step.run(`send-offers-batch-${i}`, async () => {
        for (const u of batch) {
          try {
            await sendEmail({
              to: u.email,
              subject: `Escolhas Frescas Só Para Ti!`,
              body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                
                <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px 28px;">
                    <h2 style="color: #fff; margin: 0; font-size: 20px;">Escolhas Frescas Só Para Ti!</h2>
                    <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px;">
                        Ofertas exclusivas para começar o mês com tudo
                    </p>
                </div>

                <div style="padding: 28px;">
                    <p style="margin: 0 0 20px; font-size: 15px; color: #374151;">
                        Olá <strong>${u.name}</strong>, confira as melhores escolhas deste mês!
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                        ${deals
                          .reduce((rows: any, _, i: number) => {
                            if (i % 3 === 0) {
                              rows.push(deals.slice(i, i + 3));
                            }
                            return rows;
                          }, [])
                          .map(
                            (row: any) => `
                                <tr>
                                    ${row
                                      .map(
                                        (p: any) => `
                                            <td style="width: 33%; padding: 8px; vertical-align: top;">
                                                <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; text-align: center;">
                                                    ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100px; object-fit: cover;" />` : ""}
                                                    <div style="padding: 10px;">
                                                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">
                                                            ${p.name}
                                                        </p>
                                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #16a34a;">
                                                            $${p.price.toFixed(2)}
                                                            ${p.originalPrice > p.price ? `<span style="font-size: 11px; color: #9ca3af; text-decoration: line-through; margin-left: 4px;">$${p.originalPrice.toFixed(2)}</span>` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>`,
                                      )
                                      .join("")}
                                </tr>`,
                          )
                          .join("")}
                    </table>

                    <div style="text-align: center; margin-top: 24px;">
                        <a href="${getClientUrl()}/products"
                           style="display: inline-block; background: #16a34a; color: #fff; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
                           Ver Todas as Ofertas →
                        </a>
                    </div>
                </div>
            </div>`,
            });
            sentCount += 1;
          } catch (error) {
            console.error(`Falha ao enviar oferta mensal para ${u.email}`, error);
          }
        }
      });
    }
    return { sent: sentCount };
  },
);

// Atribuição automática de entregador após 5 minutos
const autoAssignRider = inngest.createFunction(
  {
    id: "auto-assign-rider",
    name: "Atribuir Automaticamente Entregador Mwangole",
    triggers: [{ event: "order/placed" }],
  },
  async ({ event, step }) => {
    const { orderId } = event.data;

    // Espera 5 minutos antes de tentar a atribuição
    await step.sleep("wait-5-min", "5m");

    const result = await step.run("assign-rider", async () => {
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      // Ignora se o pedido não existir, já estiver atribuído ou cancelado
      if (!order) return { skipped: true, reason: "Pedido não encontrado" };
      if (order.deliveryPartnerId)
        return { skipped: true, reason: "Já atribuído" };
      if (["Cancelled", "Delivered"].includes(order.status as string))
        return { skipped: true, reason: `Pedido é ${order.status}` };

      // Procura um entregador ativo que não esteja em entrega no momento
      const busyOrders = await prisma.order.findMany({
        where: {
          status: { in: ["Assigned", "Packed", "Out for Delivery"] },
          deliveryPartnerId: { not: null },
        },
        select: { deliveryPartnerId: true },
      });

      const busyRiderIds = busyOrders
        .map((o) => o.deliveryPartnerId)
        .filter((id): id is string => Boolean(id));

      const availableRider = await prisma.deliveryPartner.findFirst({
        where: {
          isActive: true,
          ...(busyRiderIds.length > 0 ? { id: { notIn: busyRiderIds } } : {}),
        },
      });

      if (!availableRider)
        return { skipped: true, reason: "Nenhum entregador disponível" };

      // Gera um OTP de 6 dígitos
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const history = (
        Array.isArray(order.statusHistory) ? order.statusHistory : []
      ) as any[];
      history.push({
        status: "Assigned",
        note: `Automaticamente atribuído a ${availableRider.name}`,
        timestamp: new Date(),
      });

      await prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryPartnerId: availableRider.id,
          deliveryOtp: otp,
          status: "Assigned",
          statusHistory: history,
        },
      });

      return {
        assigned: true,
        riderId: availableRider.id,
        riderName: availableRider.name,
        orderId: orderId,
      };
    });

    return result;
  },
);

// Cria um array vazio onde serão exportadas as funções futuras do Inngest
export const functions = [checkLowStock, sendMonthlyOffers, autoAssignRider];
