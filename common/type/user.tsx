interface User {
    profile: {
        id: number;
        username: string;
        email: string;
        phoneNumber: string;
        role: [string];
        gender?: string,
        address?: string,
        dob?: string,
    }
    accessibleRoute: [RouteAuth];
    doneFeedbackToday: boolean;
    updatePasswordRequired: boolean;
    refreshToken: string;
    accessToken: string;
}

interface Employee {
    username?: string,
    password?: string,
    email?: string,
    phoneNumber?: string,
    role?: string,
    // [key: string]: any;
    tempPassword?: string,
    gender?: string,
    address?: string,
    dob?: string,
    id?: number,


}