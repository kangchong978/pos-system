interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalProductsSold: number;
    revenueByDate: { date: string; revenue: number }[];
}