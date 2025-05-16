// components/ConfirmationToast/ConfirmationToast.jsx
import { motion } from "framer-motion";
import { FaHeartbeat, FaEnvelope, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import SecondaryBtn from "../../Buttons/SecondaryBtn";
import PrimaryBtn from "../../Buttons/PrimaryBtn";
import toast from "react-hot-toast";

const ConfirmationToast = ({
  t,
  title,
  description,
  items = [],
  contactEmail,
  onConfirm,
  onCancel,
  isProcessing,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon = "heartbeat",
  iconColor = "text-red-500",
  iconBgColor = "bg-red-100",
}) => {
  const icons = {
    heartbeat: FaHeartbeat,
    trash: FaTrash,
    check: FaCheck,
    times: FaTimes,
  };
  
  const IconComponent = icons[icon] || FaHeartbeat;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.5,
        },
      }}
      exit={{
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.2 },
      }}
      className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-auto p-4 sm:p-6 space-y-4 z-[9999] backdrop-blur-sm"
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-md"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            transition: { repeat: Infinity, duration: 1.5 },
          }}
          className={`${iconBgColor} p-2 rounded-full`}
        >
          <IconComponent className={`${iconColor} text-xl`} />
        </motion.div>
      </motion.div>

      <div className="flex items-start gap-3 sm:gap-4">
        <div>
          <motion.h3 className="font-bold text-lg sm:text-xl text-gray-800">
            {title}
          </motion.h3>
          {description && (
            <motion.p className="text-gray-600 text-sm mt-1">
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <motion.div className="space-y-3 pt-2">
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center"
            >
              <span className="text-gray-500 text-xs md:text-sm">
                {item.label}
              </span>
              <span className="text-gray-700 font-medium text-right break-all">
                {item.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {contactEmail && (
        <motion.div className="flex justify-between items-center pt-2">
          <span className="text-gray-500 text-xs md:text-sm">
            Contact Requester:
          </span>
          <a
            href={`mailto:${contactEmail}`}
            className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
          >
            <FaEnvelope className="mr-1.5" />
            <span>Send Email</span>
          </a>
        </motion.div>
      )}

      <motion.div className="flex flex-wrap justify-end gap-3 pt-4">
        <SecondaryBtn
          onClick={onCancel || (() => toast.dismiss(t.id))}
          type="button"
          style="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 px-3 sm:px-4 rounded-md cursor-pointer py-1.5 sm:py-2"
        >
          {cancelText}
        </SecondaryBtn>
        <PrimaryBtn
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span>{confirmText}</span>
          )}
        </PrimaryBtn>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationToast;