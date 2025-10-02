import type { ReactNode } from "react";
import { Toaster } from "sonner-native";

interface ToastProviderProps {
	children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
	return (
		<>
			{children}
			<Toaster position="top-center" duration={2000} richColors />
		</>
	);
};

export { ToastProvider };
