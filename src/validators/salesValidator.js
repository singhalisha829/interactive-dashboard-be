import { z } from "zod";

export const createSalesSchema = z.object({
  orderId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  region: z.enum(["North America", "Europe", "Asia Pacific", "Latin America"]),
  paymentMethod: z.enum(["Credit Card", "PayPal", "UPI", "Crypto"]),
  status: z.enum(["Completed", "Pending", "Refunded"]),
  createdAt: z.coerce.date().optional(),
});
