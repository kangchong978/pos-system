interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProductsSold: number;
    salesOverview: { date: string; revenue: number }[];
    topSellingItems: { name: string; quantity: number }[];
    dailyTransactions: { date: string; count: number }[];
}