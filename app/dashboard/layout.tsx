import { CheckUserInfo } from "@/components/authComponent"

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <nav></nav>
            {children}
        </section>
    )
}