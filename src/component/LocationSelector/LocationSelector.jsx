import { useMemo } from "react";
import { useLocalData } from "../../hooks/useLocalData";
import { FaCheckCircle, FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { COLORS } from "../../utils/colorConfig";

const findSelectedItem = (list, value) => {
  return list?.find((item) => item.en_name === value || item.name === value);
};

const LocationSelector = ({ values, setFieldValue, errors, touched }) => {
  const { data: divisions = [] } = useLocalData("location/divisions.json");
  const { data: districts = [] } = useLocalData("location/districts.json");
  const { data: upazilas = [] } = useLocalData("location/upazilas.json");

  const fieldFocusVariants = {
    focus: {
      boxShadow: `0 0 0 2px ${COLORS.primary}40`,
      borderColor: COLORS.primary,
      transition: { duration: 0.2 },
    },
  };

  const filteredDistricts = useMemo(() => {
    if (!values.division) return [];
    const selectedDivision = findSelectedItem(divisions, values.division);
    return selectedDivision
      ? districts.filter(
          (district) => district.division_id === selectedDivision.id
        )
      : [];
  }, [values.division, divisions, districts]);

  const filteredUpazilas = useMemo(() => {
    if (!values.district) return [];
    const selectedDistrict = findSelectedItem(districts, values.district);
    return selectedDistrict
      ? upazilas.filter(
          (upazila) => upazila.district_id === selectedDistrict.id
        )
      : [];
  }, [values.district, districts, upazilas]);

  const handleDivisionChange = (e) => {
    const value = e.target.value;
    setFieldValue("division", value);
    setFieldValue("district", "");
    setFieldValue("upazila", "");
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setFieldValue("district", value);
    setFieldValue("upazila", "");
  };

  const handleUpazilaChange = (e) => {
    setFieldValue("upazila", e.target.value);
  };

  const getFieldStyle = (fieldName) => ({
    borderColor:
      errors[fieldName] && touched[fieldName]
        ? COLORS.error
        : !errors[fieldName] && touched[fieldName]
        ? COLORS.success
        : COLORS.border,
    color: COLORS.textPrimary,
  });

  return (
    <div className="space-y-4">
      {/* Division Field */}
      <div>
        <label
          htmlFor="division"
          className="block mb-1 font-medium"
          style={{ color: COLORS.textPrimary }}
        >
          Division
        </label>
        <motion.div whileFocus="focus" variants={fieldFocusVariants}>
          <div className="relative">
            <select
              name="division"
              onChange={handleDivisionChange}
              value={values.division}
              className="w-full p-2 pl-10 border rounded focus:outline-none"
              style={getFieldStyle("division")}
            >
              <option value="">Select Division</option>
              {divisions?.map((division) => (
                <option
                  key={division.id}
                  value={division.en_name || division.name}
                >
                  {division.en_name || division.name}
                </option>
              ))}
            </select>
            <FaMapMarkedAlt
              className="absolute left-3 top-3"
              style={{ color: COLORS.icon }}
            />
          </div>
        </motion.div>
        {errors.division && touched.division && (
          <div className="text-sm mt-1" style={{ color: COLORS.error }}>
            {errors.division}
          </div>
        )}
        {!errors.division && touched.division && (
          <div
            className="text-xs mt-1 flex items-center gap-1"
            style={{ color: COLORS.successText }}
          >
            <FaCheckCircle />
            <span>Division selected</span>
          </div>
        )}
      </div>

      {/* District Field */}
      {values.division && (
        <div>
          <label
            htmlFor="district"
            className="block mb-1 font-medium"
            style={{ color: COLORS.textPrimary }}
          >
            District
          </label>
          <motion.div whileFocus="focus" variants={fieldFocusVariants}>
            <div className="relative">
              <select
                name="district"
                onChange={handleDistrictChange}
                value={values.district}
                className="w-full p-2 pl-10 border rounded focus:outline-none"
                style={getFieldStyle("district")}
              >
                <option value="">Select District</option>
                {filteredDistricts?.map((district) => (
                  <option
                    key={district.id}
                    value={district.en_name || district.name}
                  >
                    {district.en_name || district.name}
                  </option>
                ))}
              </select>
              <FaMapMarkedAlt
                className="absolute left-3 top-3"
                style={{ color: COLORS.icon }}
              />
            </div>
          </motion.div>
          {errors.district && touched.district && (
            <div className="text-sm mt-1" style={{ color: COLORS.error }}>
              {errors.district}
            </div>
          )}
          {!errors.district && touched.district && (
            <div
              className="text-xs mt-1 flex items-center gap-1"
              style={{ color: COLORS.successText }}
            >
              <FaCheckCircle />
              <span>District selected</span>
            </div>
          )}
        </div>
      )}

      {/* Upazila Field */}
      {values.district && (
        <div>
          <label
            htmlFor="upazila"
            className="block mb-1 font-medium"
            style={{ color: COLORS.textPrimary }}
          >
            Upazila
          </label>
          <motion.div whileFocus="focus" variants={fieldFocusVariants}>
            <div className="relative">
              <select
                name="upazila"
                onChange={handleUpazilaChange}
                value={values.upazila}
                className="w-full p-2 pl-10 border rounded focus:outline-none"
                style={getFieldStyle("upazila")}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas?.map((upazila) => (
                  <option
                    key={upazila.id}
                    value={upazila.en_name || upazila.name}
                  >
                    {upazila.en_name || upazila.name}
                  </option>
                ))}
              </select>
              <FaMapMarkedAlt
                className="absolute left-3 top-3"
                style={{ color: COLORS.icon }}
              />
            </div>
          </motion.div>
          {errors.upazila && touched.upazila && (
            <div className="text-sm mt-1" style={{ color: COLORS.error }}>
              {errors.upazila}
            </div>
          )}
          {!errors.upazila && touched.upazila && (
            <div
              className="text-xs mt-1 flex items-center gap-1"
              style={{ color: COLORS.successText }}
            >
              <FaCheckCircle />
              <span>Upazila selected</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;