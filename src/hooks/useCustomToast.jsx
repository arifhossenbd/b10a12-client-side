import toast from "react-hot-toast";
import ConfirmationToast from "../component/ConfirmationToast/ConfirmationToast";

const useCustomToast = () => {
  const showConfirmationToast = ({
    title,
    description,
    items = [],
    contactEmail,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon = "heartbeat",
    iconColor = "text-red-500",
    iconBgColor = "bg-red-100",
  }) => {
    return new Promise((resolve) => {
      toast.custom(
        (t) => (
          <ConfirmationToast
            t={t}
            title={title}
            description={description}
            items={items}
            contactEmail={contactEmail}
            onConfirm={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
            onCancel={() => {
              toast.dismiss(t.id);
              resolve(false);
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
    });
  };

  return { showConfirmationToast };
};

export default useCustomToast;