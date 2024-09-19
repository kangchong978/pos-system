interface User {
    id: number;
    username: string;
    email: string;
    accessToken: string;
    phoneNumber: string;
    role: [string];
    accessibleRoute: [RouteAuth];
}

interface Employee {
    username?: string,
    password?: string,
    email?: string,
    phoneNumber?: string,
    role?: string,
    [key: string]: any;
    tempPassword?: string,

}