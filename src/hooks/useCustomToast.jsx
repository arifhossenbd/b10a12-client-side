import toast from "react-hot-toast";
import ConfirmationToast from "../component/ConfirmationToast/ConfirmationToast";

const useCustomToast = () => {
  const showConfirmationToast = ({
    title,
    description,
    items = [],
    contactEmail,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon = "heartbeat",
    iconColor = "text-red-500",
    iconBgColor = "bg-red-100",
  }) => {
    return toast.custom(
      (t) => (
        <ConfirmationToast
          t={t}
          title={title}
          description={description}
          items={items}
          contactEmail={contactEmail}
          onConfirm={async () => {
            try {
              if (onConfirm) {
                await onConfirm();
              }
              toast.dismiss(t.id);
            } catch (error) {
              console.error("Error:", error);
              toast.error(
                error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong"
              );
            }
          }}
          onCancel={() => {
            if (onCancel) {
              onCancel();
            }
            toast.dismiss(t.id);
          }}
          confirmText={confirmText}
          cancelText={cancelText}
          icon={icon}
          iconColor={iconColor}
          iconBgColor={iconBgColor}
        />
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  return { showConfirmationToast };
};

export default useCustomToast;