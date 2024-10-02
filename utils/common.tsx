import toast from "react-hot-toast";
import { AppDispatch } from "@/store";
import { setLoading, setError } from "@/redux_slices/appSlice";
import CoreClient from "./client";

export const handlePrintReceipt = (
    orderId: number,
    event: React.MouseEvent,
    coreClient: CoreClient | null,
    dispatch: AppDispatch
) => {
    event.stopPropagation(); // Prevent row click event

    if (!coreClient) {
        toast.error('Application is not initialized');
        return;
    }

    dispatch(setLoading(true));

    const printReceiptAsync = async () => {
        try {
            const pdfBlob = await coreClient.printReceipt(orderId);

            // Create a URL for the blob
            const url = window.URL.createObjectURL(pdfBlob);

            // Create an iframe
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'fixed';
            printFrame.style.right = '0';
            printFrame.style.bottom = '0';
            printFrame.style.width = '0';
            printFrame.style.height = '0';
            printFrame.style.border = 'none';
            document.body.appendChild(printFrame);

            printFrame.src = url;

            printFrame.onload = () => {
                try {
                    printFrame.contentWindow?.print();
                } catch (error) {
                    console.error('Print failed:', error);
                    dispatch(setError('Failed to open print preview'));
                    toast.error('Failed to open print preview');
                }
            };

            // Clean up function
            const cleanup = () => {
                document.body.removeChild(printFrame);
                window.URL.revokeObjectURL(url);
            };

            // Set up a listener for when the print dialog is closed
            window.addEventListener('focus', function onFocus() {
                // Remove the event listener
                window.removeEventListener('focus', onFocus);
                // Delay cleanup to ensure print dialog has fully closed
                setTimeout(cleanup, 1000);
            });

            toast.success('Opening print preview');
        } catch (error) {
            console.error('Error preparing receipt for print:', error);
            dispatch(setError('Failed to prepare receipt for printing'));
            toast.error('Failed to prepare receipt for printing');
        } finally {
            dispatch(setLoading(false));
        }
    };

    printReceiptAsync();
};