import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { FaSearch, FaTimes, FaTint } from "react-icons/fa";
import LocationSelector from "../../component/LocationSelector/LocationSelector";

const COLORS = {
  primary: "#E53E3E",
  primaryHover: "#C53030",
  secondary: "#3182CE",
  background: "#F7FAFC",
  cardBg: "#FFFFFF",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  error: "#E53E3E",
  success: "#38A169",
  border: "#E2E8F0",
  icon: "#718096",
};

const fieldFocusVariants = {
  focus: {
    boxShadow: `0 0 0 2px ${COLORS.primary}40`,
    borderColor: COLORS.primary,
    transition: { duration: 0.2 },
  },
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
        `/search-results?bloodGroup=${values.bloodGroup}&division=${values.division}&district=${values.district}&upazila=${values.upazila}`
      );
    },
  });

  return (
    <dialog id="searchModal" className="modal">
      <div className="modal-box max-w-sm relative">
        <button
          onClick={() => document.getElementById("searchModal").close()}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          <FaTimes />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <h3 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
            Find Blood Donors
          </h3>

          <form onSubmit={formik.handleSubmit} className="space-y-4 mt-6">
            {/* Blood Group Field */}
            <div className="form-group">
              <label
                htmlFor="bloodGroup"
                className="block mb-1 font-medium"
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
                    className="w-full p-2 pl-10 border rounded focus:outline-none"
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
                    className="absolute left-3 top-3"
                    style={{ color: COLORS.icon }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Location Selector */}
            <LocationSelector
              color={COLORS}
              values={formik.values}
              handleChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              errors={formik.errors}
              touched={formik.touched}
            />

            {/* Search Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-3 rounded-md text-white font-medium flex items-center justify-center"
                style={{
                  backgroundColor: COLORS.primary,
                  hoverBackgroundColor: COLORS.primaryHover,
                }}
              >
                <FaSearch className="mr-2" /> Search Donors
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Search;