import Sales from "../models/Sales.js";

export const fetchSales = async (req, res) => {
  try {
    const { region, paymentMethod, status, productId, startDate, endDate } =
      req.query;

    const filter = {};
    if (region) filter.region = region;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      Sales.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Sales.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: sales,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
