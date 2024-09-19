import toast from "react-hot-toast";

export default class CoreClient {
    private static instance: CoreClient | null = null;
    private serverUrl: String = 'http://localhost:6001'; // Load clientInfo from localStorage
    private userInfo: User | null = null; // Load clientInfo from localStorage



    private constructor() {
        // Private constructor to prevent direct instantiation
        this.loadClientInfo();
    }

    private loadClientInfo(): any | null {
        // Check if running in the browser
        if (typeof window !== 'undefined') { // Ensure code runs in the browser context
            const rawClient = localStorage.getItem('userInfo');
            this.userInfo = rawClient ? JSON.parse(rawClient) : null; // Parse and return userInfo or null
        } else {
            console.warn('loadClientInfo: Not running in a browser context.'); // Log warning if not in browser
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
        } else {

            var res = await result.json();
            var error = res.error ?? 'Undefined Error Occur';
            toast.error(error);
            if (error == 'Invalid token' && this.userInfo) {
                this.logout();
            }

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
        } else {

            var res = await result.json();
            var error = res.error ?? 'Undefined Error Occur';
            toast.error(error);
            if (error == 'Invalid token') {
                this.logout();
            }

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

    async registerUser(payload: Employee) {
        return await this.post('/api/auth/register', payload);
    }

    async removeUser(id: string) {
        await this.post('/api/auth/remove', { id });
    }

    async updateUser(payload: Employee) {
        await this.post('/api/auth/updateUser', payload);
    }

    async logout() {
        await this.post('/api/auth/logout', null);

        localStorage.removeItem('userInfo');
        this.userInfo = null; // Clear clientInfo on logout
    }

    get isLoggedIn(): boolean {
        return this.userInfo != null; // Getter to check if user is logged in
    }

    get getUserInfo(): User | null {
        if (this.userInfo == null) return null;
        return this.userInfo; // Getter to check if user is logged in
    }

    async getEmployees(): Promise<Employee[]> {
        var result = await
            this.get('/api/manage/getUsers');
        return (result) ? result['users'] : [];
    }

    async getRoutesAuth(): Promise<Employee[]> {
        var result = await
            this.get('/api/manage/getRoutesAuth');
        return (result) ? result['routesAuth'] : [];
    }

    async updateRouteAuth(routesAuth: RouteAuth[]) {
        return await this.post('/api/manage/updateRoutesAuth', { routesAuth });
    }

    async getProducts(payload: { searchTerm: string, page: number }): Promise<Product[]> {
        var result = await
            this.post('/api/product/getProducts', payload);
        return (result) ? result['products'] : [];
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
            return; // Handle no files selected case gracefully
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

        const resultString = results.join(','); // Combine results into a comma-separated string
        return resultString;
    }

}