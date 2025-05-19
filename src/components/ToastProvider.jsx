import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const ToastProvider = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 3000,
        removeDelay: 1000,
        style: {
          background: theme === "light" ? "#e5e7eb" : "#18181b",
          color: theme === "light" ? "#18181b" : "#e5e7eb",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#56C179",
            secondary: theme === "light" ? "#e5e7eb" : "#18181b",
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: "#F6475E",
            secondary: theme === "light" ? "#e5e7eb" : "#18181b",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
