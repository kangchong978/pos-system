import { FeedbackData } from "@/common/type/employeeFeedbackData";
import { Order, OrderStatus, OrderType } from "@/common/type/order";
import { MyFile, Product } from "@/common/type/product";
import { SaleRecord } from "@/common/type/sales";
import toast from "react-hot-toast";

export default class CoreClient {
    static instance: CoreClient | null = null;
    private serverUrl: String = 'http://localhost:6001'; // Load clientInfo from localStorage
    private userInfo: User | null = null; // Load clientInfo from localStorage
    private setting: CompanyInfo | null = null; // Load clientInfo from localStorage


    constructor() {
        // Private constructor to prevent direct instantiation
    }

    async loadClientInfo(): Promise<void> {
        if (typeof window !== 'undefined') {
            const rawClient = localStorage.getItem('userInfo');
            const parsed = rawClient ? JSON.parse(rawClient) : null;
            this.userInfo = parsed;

            if (!this.userInfo?.refreshToken) return; /* not loggin */

            /* update access token if refresh token valid */

            await this.refreshAccessToken();
            await this.loadUserProfile();
            await this.loadSettings();

        }
    }

    async loadUserProfile(): Promise<void> {
        if (typeof window !== 'undefined') {
            await this.getLatestUserInfo();
        }
    }

    async loadSettings(): Promise<void> {
        if (typeof window !== 'undefined') {
            this.setting = await this.getSettings();
            this.loadWhitelabeling();
        }
    }

    public static getInstance(): CoreClient {
        if (!CoreClient.instance) {
            CoreClient.instance = new CoreClient();
        }
        return CoreClient.instance;
    }

    private async post(url: String, payload: any, contentType: string = 'application/json') {
        console.log(`info:${this.userInfo}`);

        var result = await fetch(`${this.serverUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': contentType,
                'Authorization': `Bearer ${this.userInfo?.accessToken}`
            },
            body: payload != null ? JSON.stringify(payload) : null,
        })

        if (result.ok) {
            var res = await result.json();
            return res;
        } else if (result.status == 401) {
            // handle invalid token
            if (this.userInfo?.refreshToken) {
                this.logout();
            } else {

            }
        } else {
            var res = await result.json();
            var error = res.error ?? 'Undefined Error Occur';
            toast.error(error);

        }

    }

    private async get(url: String) {

        var result = await fetch(`${this.serverUrl}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.userInfo?.accessToken}`
            },
        })

        if (result.ok) {
            var res = await result.json();
            return res;
        } else if (result.status == 401) {
            // handle invalid token
            if (this.userInfo?.refreshToken) {
                this.logout();
            } else {

            }
        }
        else {
            var res = await result.json();
            var error = res.error ?? 'Undefined Error Occur';
            toast.error(error);
        }

    }
    async refreshAccessToken() {
        const refreshToken = this.userInfo?.refreshToken;
        var result = await fetch('http://localhost:6001/api/auth/refreshAccessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        })
        if (result.ok) {
            var res = await result.json();
            if (this.userInfo) {
                this.userInfo.accessToken = res.accessToken; // Set clientInfo after login
                localStorage.setItem('userInfo', JSON.stringify(this.userInfo)); // Store userInfo in localStorage
            }
        } else if (result.status == 401) {
            await this.logout();
        } else {
            var res = await result.json();
            var error = res.error ?? 'Undefined Error Occur';
            toast.error(error);
        }
    }

    async resetPassword(payload: { newPassword: string, newPasswordConfirm: string }) {
        return this.post('/api/auth/resetPassword', payload);
    }

    async login(payload: { username: string; password: string }) {

        var result = await fetch('http://localhost:6001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        if (result.ok) {
            var res = await result.json();
            localStorage.setItem('userInfo', JSON.stringify(res)); // Store userInfo in localStorage
            this.userInfo = res; // Set clientInfo after login
            return res;
        } else {

            var res = await result.json();
            var error = res.error ?? 'Undefined Error Occur';
            toast.error(error);
        }

        return;
    }

    async resetUserPassword(payload: Employee) {
        return await this.post('/api/auth/requestResetPassword', payload);
    }


    async registerUser(payload: Employee) {
        return await this.post('/api/auth/register', payload);
    }

    async removeUser(id: number) {
        await this.post('/api/auth/remove', { id });
    }

    async updateUser(payload: Employee) {
        await this.post('/api/auth/updateUser', payload);
    }

    async logout() {
        try {
            await this.post('/api/auth/logout', null);
        } catch (error: any) {
            toast.error(error.toString());
        } finally {
            localStorage.removeItem('userInfo');
            this.userInfo = null; // Clear clientInfo on logout
            window.location.href = '/logout';
        }
    }

    get isLoggedIn(): boolean {
        return this.userInfo != null; // Getter to check if user is logged in
    }

    get getUserInfo(): User | null {
        if (this.userInfo == null) return null;
        return this.userInfo; // Getter to check if user is logged in
    }
    get getSetting(): CompanyInfo | null {
        if (this.setting == null) return null;
        return this.setting; // Getter to check if user is logged in
    }

    set updateClientFeedback(val: boolean) {
        if (!this.userInfo) return;
        this.userInfo.doneFeedbackToday = val;
    }

    async getLatestUserInfo() {
        const result = await this.get('/api/auth/loadUserInfo');
        if (result) {
            this.userInfo = { ...this.userInfo, ...result }
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo)); // Store userInfo in localStorage
        }
    }

    async getEmployees(): Promise<Employee[]> {
        var result = await
            this.get('/api/manage/getUsers');
        return (result) ? result['users'] : [];
    }

    async getSettings(): Promise<CompanyInfo> {
        const result = await this.get('/api/manage/getSettings');
        return result ? result.settings : {};
    }

    async uploadCompanyLogo(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('company-logo', file);

        const response = await fetch(`${this.serverUrl}/api/manage/uploadCompanyLogo`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.userInfo?.accessToken}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Logo upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.url;
    }

    async updateSettings(companyInfo: CompanyInfo): Promise<boolean> {
        return await this.post('/api/manage/updateSettings', companyInfo);
    }
    async getRoutesAuth(): Promise<RouteAuth[]> {
        var result = await
            this.get('/api/manage/getRoutesAuth');
        return (result) ? result['routesAuth'] : [];
    }


    async updateRouteAuth(routesAuth: RouteAuth[]) {
        return await this.post('/api/manage/updateRoutesAuth', { routesAuth });
    }

    async getProducts(payload: { searchTerm: string, page: number, categoryFilter: string, itemsPerPage: number }): Promise<{ products: Product[], total: number }> {
        var result = await
            this.post('/api/product/getProducts', payload);

        return { products: (result) ? result['products'].map((v: Product) => new Product(v.name, v.image, v.category, v.description, v.code, v.price, v.variation, v.id)) : [], total: result.total };
    }
    async updateProduct(payload: Product) {
        await this.post('/api/product/updateProduct', payload);
        return true;
    }
    async createProduct(payload: Product) {
        var id = await this.post('/api/product/createProduct', payload);
        return id;
    }

    async removeProduct(id: number) {
        await this.post('/api/product/removeProduct', { id });
        return true;
    }

    async uploadProductImage(files: MyFile[]) {
        if (!files || files.length === 0) {
            return []; // Handle no files selected case gracefully
        }

        const results = []; // Array to store upload results

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.file) {
                const formData = new FormData();
                formData.append('upload-image', file.file);

                const response = await fetch(`${this.serverUrl}/api/product/uploadProductImg`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.userInfo?.accessToken}`
                    },
                    body: formData,
                    redirect: "follow"
                });

                if (!response.ok) {
                    throw new Error(`Image upload failed for ${file.file.name}: ${response.statusText}`); // Provide more context
                }

                const data = await response.json();
                if (data['url'])
                    results.push(data['url']); // Assuming the API returns the file path in 'file'
            } else {
                results.push(file.url); // Assuming the API returns the file path in 'file'
            }
        }

        return results; // Combine results into a comma-separated string

    }

    async getProductCategories() {
        var result = await
            this.get('/api/product/getCategories');
        return (result) ? result['categories'] : [];
    }

    async createCategory(name: string) {
        var id = await this.post('/api/product/createCategory', { name });
        return id;
    }

    async removeCategory(id: number) {
        await this.post('/api/product/removeCategory', { id });
        return true;
    }

    async createOrder(orderType: OrderType, tableId?: number, tableName?: string) {
        var id = await this.post('/api/order/createOrder', { orderType, tableId, tableName });
        return id;
    }

    async updateOrder(order: Order) {
        await this.post('/api/order/updateOrder', order);
        return true;
    }

    async getOrders(filters?: { status?: string; id?: number }): Promise<Order[]> {
        let url = '/api/order/getOrders';

        if (filters) {
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.id) queryParams.append('id', filters.id.toString());
            url += `?${queryParams.toString()}`;
        }

        const result = await this.get(url);
        return result ? result['orders'].map((v: Order) => new Order(v.orderType, v.id, v.products, v.subTotal, v.tax, v.total, v.createDate, v.updateDate, v.status, v.tableId)) : [];

    }

    async updateOrderStatus(id: number, status: OrderStatus) {
        await this.post('/api/order/updateOrderStatus', { id, status });
        return true;
    }

    async getTables() {
        var result = await this.get('/api/order/getTables');
        return (result) ? result['tables'] : [];
    }

    async updateTablePosition(x: number, y: number, id: number) {
        await this.post('/api/order/updateTablePosition', { x, y, id });
        return true;
    }

    async updateTableOrderId(id: number, orderId?: number) {
        await this.post('/api/order/updateTableOrderId', { id, orderId });
        return true;
    }
    async addTable(tableName: string) {
        await this.post('/api/order/createTable', { tableName });
        return true;
    }

    async removeTable(id: number) {
        return await this.post('/api/order/removeTable', { id });
    }

    async printOrderList(orderId: number): Promise<Blob> {
        const url = `/api/order/orderList/${orderId}`;
        const response = await fetch(`${this.serverUrl}${url}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.userInfo?.accessToken}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate receipt');
        }

        return await response.blob();
    }
    async printReceipt(saleId: number): Promise<Blob> {
        const url = `/api/sale/receipt/${saleId}`;
        const response = await fetch(`${this.serverUrl}${url}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.userInfo?.accessToken}`
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate receipt');
        }

        return await response.blob();
    }

    async getDashboardStats(payload: { startDate: Date, endDate: Date }): Promise<DashboardStats> {
        const result = await this.post('/api/dashboard/getDashboardStats', payload);
        return result;
    }

    async recordSale(
        orderId: number,
        totalAmount: number,
        taxAmount: number,
        paymentMethod: string
    ) {
        return await this.post('/api/sale/recordSale', { orderId, totalAmount, taxAmount, paymentMethod });

    }

    async getSales(filters?: { status?: string; order_id?: number, payment_method?: string }): Promise<SaleRecord[]> {
        let url = '/api/sale/getSales';

        if (filters) {
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.order_id) queryParams.append('order_id', filters.order_id.toString());
            if (filters.payment_method) queryParams.append('payment_method', filters.payment_method.toString());
            url += `?${queryParams.toString()}`;
        }

        const result = await this.get(url);
        return result ? result['sales'].map((v: SaleRecord) => SaleRecord.fromPlainObject(v)) : [];
    }

    async submitEmployeeFeedback(payload: FeedbackData): Promise<boolean> {
        return await this.post('/api/feedback/recordEmployeeFeedback', payload);
    }

    async getFeedbacks() {
        var result = await
            this.get('/api/feedback/getEmployeeFeedbacks');
        return (result) ? result['feedbacks'] : [];
    }

    async loadWhitelabeling() {
        const settings = this.getSetting;
        if (settings && typeof settings.company_logo === 'string') {
            /* this faivcon is handled saperatly for login page */
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                (link as any).rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            (link as any).href = `http://localhost:6001${settings.company_logo}`;

            // Set dynamic title
            const dynamicTitle = settings.company_name || "POS System"; // Fallback to a default title
            document.title = dynamicTitle;
        }

    }


}