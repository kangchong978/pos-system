interface RouteAuth {
    route?: string,
    role?: string,
}

interface CompanyInfo {
    company_name: string;
    company_logo: string | File | null;
    tax: number;
    address: string;
    email: string;
    website: string;
    phone_number: string;
    receipt_footer_text: string;
    theme: string;
}
