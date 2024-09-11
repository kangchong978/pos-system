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

    private async post(url: String, payload: any) {
        console.log(`info:${this.userInfo}`);

        var result = await fetch(`${this.serverUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

        // var result = await fetch('http://localhost:6001/api/auth/resetPassword', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(payload),
        // })

        // if (result.ok) {
        //     var res = await result.json();
        //     // localStorage.setItem('userInfo', JSON.stringify(res)); // Store userInfo in localStorage
        //     // this.userInfo = res; // Set clientInfo after login
        //     return res;
        // } else {

        //     var res = await result.json();
        //     var error = res.error ?? 'Undefined Error Occur';
        //     toast.error(error);
        // }

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

}