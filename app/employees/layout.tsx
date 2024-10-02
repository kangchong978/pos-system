import { CheckUserInfo } from "@/components/authComponent"

export default function EmployeesLayout({
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