import mongoose from 'mongoose';
import { TOrderHistory } from "./orderHistory.interface";
import OrderHistoryModel from "./orderHistory.model";


 const createOrderHistory = async ( productData: TOrderHistory ) => {
    const orderHistory = await OrderHistoryModel.create(productData);
    return orderHistory;
}; 

 const getOrderHistory = async () => {
    const orderHistory = await OrderHistoryModel.find();
    return orderHistory;
};

 const getOrderHistoryById = async (id: string) => {
    const orderHistory = await OrderHistoryModel.findById(id);
    return orderHistory;
};

// Aggregate analytics for a single client
const getClientAnalytics = async (clientId: string) => {
    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid clientId');
    }

    const matchStage: mongoose.PipelineStage.Match = {
        $match: { clientID: new mongoose.Types.ObjectId(clientId) },
    };

    const baseStages: mongoose.PipelineStage[] = [
        matchStage,
        {
            $lookup: {
                from: 'products',
                localField: 'productID',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $set: {
                monthKey: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                month: { $dateToString: { format: '%b', date: '$createdAt' } },
                numProducts: { $size: { $ifNull: ['$products', []] } },
            },
        },
        {
            $set: {
                perProductShare: {
                    $cond: [
                        { $gt: ['$numProducts', 0] },
                        { $divide: ['$totalPrice', { $max: ['$numProducts', 1] }] },
                        0,
                    ],
                },
            },
        },
    ];

    const pipeline: mongoose.PipelineStage[] = [
        ...baseStages,
        {
            $facet: {
                metrics: [
                    {
                        $group: {
                            _id: null,
                            totalOrders: { $sum: 1 },
                            totalSpent: { $sum: '$totalPrice' },
                            pendingOrders: {
                                $sum: {
                                    $cond: [
                                        { $in: ['$status', ['pending', 'processing', 'shipped']] },
                                        1,
                                        0,
                                    ],
                                },
                            },
                            completedOrders: {
                                $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
                            },
                            canceledOrders: {
                                $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                            },
                        },
                    },
                ],
                spendingTrends: [
                    {
                        $group: {
                            _id: '$monthKey',
                            month: { $first: '$month' },
                            amount: { $sum: '$totalPrice' },
                        },
                    },
                    { $sort: { _id: 1 } },
                ],
                orderStatusByMonth: [
                    {
                        $group: {
                            _id: { mk: '$monthKey', month: '$month', status: '$status' },
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { '_id.mk': 1 } },
                ],
                categorySpending: [
                    { $unwind: { path: '$products', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$products.catagory', preserveNullAndEmptyArrays: true } },
                    {
                        $lookup: {
                            from: 'catagories',
                            localField: 'products.catagory',
                            foreignField: '_id',
                            as: 'categoryDoc',
                        },
                    },
                    { $unwind: { path: '$categoryDoc', preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: '$categoryDoc.title',
                            amount: { $sum: '$perProductShare' },
                        },
                    },
                    { $sort: { amount: -1 } },
                ],
            },
        },
    ];

    const [agg] = await OrderHistoryModel.aggregate(pipeline);
    const metrics = agg?.metrics?.[0] ?? {
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        completedOrders: 0,
        canceledOrders: 0,
    };

    const totalOrders: number = metrics.totalOrders ?? 0;
    const totalSpent: number = Number(metrics.totalSpent ?? 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Spending trends - map to desired shape
    const spendingTrends = (agg?.spendingTrends ?? []).map((d: any) => ({
        month: d.month,
        amount: d.amount,
    }));

    // Order analytics: reshape status by month into single objects
    const orderAnalyticsMap = new Map<string, { month: string; pending: number; completed: number; canceled: number }>();
    for (const row of agg?.orderStatusByMonth ?? []) {
        const mk: string = row?._id?.mk ?? '';
        const month: string = row?._id?.month ?? '';
        const status: string = row?._id?.status ?? '';
        const count: number = row?.count ?? 0;
        if (!mk) continue;
        if (!orderAnalyticsMap.has(mk)) {
            orderAnalyticsMap.set(mk, { month, pending: 0, completed: 0, canceled: 0 });
        }
        const entry = orderAnalyticsMap.get(mk)!;
        if (['pending', 'processing', 'shipped'].includes(status)) entry.pending += count;
        else if (status === 'delivered') entry.completed += count;
        else if (status === 'cancelled') entry.canceled += count;
    }
    const orderAnalytics = Array.from(orderAnalyticsMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, v]) => v);

    // Category spending with percentages
    const categorySpendingRaw: Array<{ _id: string; amount: number }> = agg?.categorySpending ?? [];
    const categorySpending = categorySpendingRaw
        .filter((c) => c._id)
        .map((c) => ({
            category: c._id,
            amount: c.amount,
            percentage: totalSpent > 0 ? Math.round((c.amount / totalSpent) * 100) : 0,
        }));

    return {
        metrics: {
            totalOrders,
            pendingOrders: metrics.pendingOrders ?? 0,
            completedOrders: metrics.completedOrders ?? 0,
            canceledOrders: metrics.canceledOrders ?? 0,
            totalSpent,
            averageOrderValue,
            loyaltyPoints: Math.max(0, Math.round(totalSpent / 2)),
        },
        spendingTrends,
        categorySpending,
        orderAnalytics,
    };
};


const getOrdersForClient = async (
    clientId: string,
    {
        page = 1,
        limit = 10,
        status,
        search,
        category,
        sort = 'date-desc',
    }: {
        page?: number;
        limit?: number;
        status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        search?: string;
        category?: string;
        sort?: 'date-desc' | 'date-asc' | 'total-desc' | 'total-asc';
    }
) => {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
        throw new Error('Invalid clientId');
    }

    const matchStage: Record<string, unknown> = {
        clientID: new mongoose.Types.ObjectId(clientId),
    };

    if (status) {
        matchStage.trackingSteps = status; // Match if any step equals the given status
    }

    // Build sort stage
    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'date-asc') sortStage = { createdAt: 1 };
    if (sort === 'total-desc') sortStage = { totalPrice: -1 };
    if (sort === 'total-asc') sortStage = { totalPrice: 1 };

    // Aggregation pipeline
    const pipeline: mongoose.PipelineStage[] = [
        // { $match: matchStage },
        {
            $lookup: {
                from: 'products',
                localField: 'productID',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $lookup: {
                from: 'catagories',
                localField: 'products.catagory',
                foreignField: '_id',
                as: 'categories',
            },
        },
        {
            $lookup: {
                from: 'shippingaddresses',
                localField: 'shipping',
                foreignField: '_id',
                as: 'shippingInfo',
            },
        },
        {
            $unwind: {
                path: '$shippingInfo',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                itemCount: { $size: { $ifNull: ['$products', []] } },
                _idStr: { $toString: '$_id' },
                currentStatus: { $arrayElemAt: ['$trackingSteps', -1] } // last step in trackingSteps
            },
        },
        {
            $addFields: {
                displayId: {
                    $let: {
                        vars: {
                            year: { $year: '$createdAt' },
                            len: { $strLenCP: '$_idStr' },
                        },
                        in: {
                            $concat: [
                                'ORD-',
                                { $toString: '$$year' },
                                '-',
                                {
                                    $toUpper: {
                                        $substrCP: [
                                            '$_idStr',
                                            { $subtract: ['$$len', 6] },
                                            6,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
    ];

    // Search and category filters
    const andFilters: Record<string, unknown>[] = [];
    if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        andFilters.push({
            $or: [
                { _idStr: { $regex: regex } },
                { displayId: { $regex: regex } },
                { 'products.title': { $regex: regex } },
            ],
        });
    }

    if (category && category.trim() !== '') {
        const catRegex = new RegExp(category.trim(), 'i');
        andFilters.push({ 'categories.title': { $regex: catRegex } });
    }

    if (andFilters.length > 0) {
        pipeline.push({ $match: { $and: andFilters } });
    }

    // Sort and paginate
    pipeline.push(
        { $sort: sortStage },
        {
            $facet: {
                docs: [{ $skip: skip }, { $limit: safeLimit }],
                totalCount: [{ $count: 'count' }],
            },
        },
    );

    const aggResult = await OrderHistoryModel.aggregate(pipeline);
    const docs = aggResult[0]?.docs ?? [];
    const total = aggResult[0]?.totalCount?.[0]?.count ?? 0;

    // Map to response shape
    const orders = docs.map((doc: any) => {
        const createdAt: Date = doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt);
        const year = createdAt.getUTCFullYear();
        const idStr = String(doc._id);
        const short = idStr.slice(-6).toUpperCase();
        const trackingShort = idStr.slice(-9).toUpperCase();

        const products = Array.isArray(doc.products)
            ? doc.products.map((p: any) => ({
                  id: String(p._id),
                  name: p.title,
                  quantity: 1,
                  price: p.discountPrice ?? p.regularPrice ?? 0,
                  image: p.primaryImage ?? '',
              }))
            : [];

        return {
            id: `ORD-${year}-${short}`,
            date: createdAt.toISOString(),
            trackingSteps: doc.trackingSteps ?? [],
            currentStatus: doc.currentStatus ?? null,
            total: doc.totalPrice,
            currency: 'USD',
            itemCount: doc.quantity ?? doc.itemCount ?? (products?.length ?? 0),
            trackingNumber: `TRK${trackingShort}`,
            products,
            shipping: doc.shippingInfo
                ? {
                      id: String(doc.shippingInfo._id),
                      name: doc.shippingInfo.name,
                      address: doc.shippingInfo.address,
                      city: doc.shippingInfo.city,
                      state: doc.shippingInfo.state,
                      zip: doc.shippingInfo.zip,
                      country: doc.shippingInfo.country,
                      phone: doc.shippingInfo.phone,
                  }
                : null,
        };
    });

    const totalPages = Math.max(1, Math.ceil(total / safeLimit) || 1);

    return {
        orders,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages,
            hasNext: safePage < totalPages,
            hasPrev: safePage > 1,
        },
    };
};



export const OrderServices = {
    createOrderHistory,
    getOrderHistory,
    getOrderHistoryById,
    getOrdersForClient,
    getClientAnalytics,
};