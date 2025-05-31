import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTint } from "react-icons/fa";
import LocationSelector from "../../component/LocationSelector/LocationSelector";
import { COLORS } from "../../utils/colorConfig";
import CloseBtn from "../../Buttons/CloseBtn";

const fieldFocusVariants = {
  focus: {
    boxShadow: `0 0 0 2px ${COLORS.primary}40`,
    borderColor: COLORS.primary,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

const Search = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      bloodGroup: "",
      division: "",
      district: "",
      upazila: "",
    },
    onSubmit: (values) => {
      document.getElementById("searchModal").close();
      navigate(
        `/search?bloodGroup=${values.bloodGroup}&division=${values.division}&district=${values.district}&upazila=${values.upazila}`
      );
    },
  });

  return (
    <dialog id="searchModal" className="modal modal-middle">
      <AnimatePresence>
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <form method="dialog">
            <button className="absolute inset-0 w-full h-full" />
          </form>
        </motion.div>
      </AnimatePresence>

      <div className="modal-box max-w-sm relative p-0">
        <AnimatePresence>
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6 overflow-x-hidden"
          >
            <div className="absolute top-3 right-3">
              <CloseBtn
                onClick={() => document.getElementById("searchModal").close()}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.1 },
              }}
              className="py-4"
            >
              <div className="flex flex-col items-center">
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mr-3"
                >
                  <FaTint size={24} style={{ color: COLORS.primary }} />
                </motion.button>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  Find Blood Donors
                </h3>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-red-500 to-red-300 mt-2 rounded-full"
              />
            </motion.div>

            <form onSubmit={formik.handleSubmit} className="space-y-5 mt-6">
              {/* Blood Group Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.4 },
                }}
              >
                <div className="form-group">
                  <label
                    htmlFor="bloodGroup"
                    className="block mb-2 font-medium"
                    style={{ color: COLORS.textPrimary }}
                  >
                    Blood Group
                  </label>
                  <motion.div whileFocus="focus" variants={fieldFocusVariants}>
                    <div className="relative">
                      <select
                        name="bloodGroup"
                        onChange={formik.handleChange}
                        value={formik.values.bloodGroup}
                        className="w-full p-3 pl-10 border rounded-lg focus:outline-none transition-all duration-200"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.textPrimary,
                        }}
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          )
                        )}
                      </select>
                      <FaTint
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: COLORS.icon }}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Location Selector */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.5 },
                }}
              >
                <LocationSelector
                  color={COLORS}
                  values={formik.values}
                  setFieldValue={formik.setFieldValue}
                  errors={formik.errors}
                  touched={formik.touched}
                />
              </motion.div>

              {/* Search Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.6 },
                }}
                className="pt-2"
              >
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: COLORS.primaryHover,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                  className="w-full p-3 rounded-lg text-white font-medium flex items-center justify-center cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: COLORS.primary,
                  }}
                >
                  <motion.span
                    animate={{
                      x: [0, 3, -2, 0],
                      y: [0, 2, -1, 0],
                      rotate: [0, 5, -5, 0],
                      transition: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 3,
                        ease: "easeInOut",
                      },
                    }}
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <FaSearch className="mr-2" />
                  </motion.span>
                  Search Donors
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </dialog>
  );
};

export default Search;
