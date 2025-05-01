import { useMemo } from "react";
import { useLocalData } from "../../hooks/useLocalData";
import { FaCheckCircle, FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const findSelectedItem = (list, value) => {
  return list?.find((item) => item.en_name === value || item.name === value);
};

const LocationSelector = ({
  color,
  values,
  handleChange,
  setFieldValue,
  errors,
  touched,
}) => {
  const { data: divisions = [] } = useLocalData("location/divisions.json");
  const { data: districts = [] } = useLocalData("location/districts.json");
  const { data: upazilas = [] } = useLocalData("location/upazilas.json");

  const fieldFocusVariants = {
    focus: {
      boxShadow: `0 0 0 2px ${color.primary}40`,
      borderColor: color.primary,
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

  return (
    <>
      {/* Division Field */}
      <div>
        <label
          htmlFor="division"
          className="block mb-1 font-medium"
          style={{ color: color.textPrimary }}
        >
          Division
        </label>
        <motion.div whileFocus="focus" variants={fieldFocusVariants}>
          <div className="relative">
            <select
              name="division"
              onChange={(e) => {
                handleChange(e);
                setFieldValue("district", "");
                setFieldValue("upazila", "");
              }}
              value={values.division}
              className="w-full p-2 pl-10 border rounded focus:outline-none"
              style={{
                borderColor:
                  errors.division && touched.division
                    ? color.error
                    : !errors.division && touched.division
                    ? color.success
                    : color.border,
                color: color.textPrimary,
              }}
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
              style={{ color: color.icon }}
            />
          </div>
        </motion.div>
        {errors.division && touched.division && (
          <div className="text-sm mt-1" style={{ color: color.error }}>
            {errors.division}
          </div>
        )}
        {!errors.division && touched.division && (
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
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
            style={{ color: color.textPrimary }}
          >
            District
          </label>
          <motion.div whileFocus="focus" variants={fieldFocusVariants}>
            <div className="relative">
              <select
                name="district"
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue("upazila", "");
                }}
                value={values.district}
                className="w-full p-2 pl-10 border rounded focus:outline-none"
                style={{
                  borderColor:
                    errors.district && touched.district
                      ? color.error
                      : !errors.district && touched.district
                      ? color.success
                      : color.border,
                  color: color.textPrimary,
                }}
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
                style={{ color: color.icon }}
              />
            </div>
          </motion.div>
          {errors.district && touched.district && (
            <div className="text-sm mt-1" style={{ color: color.error }}>
              {errors.district}
            </div>
          )}
          {!errors.district && touched.district && (
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
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
            style={{ color: color.textPrimary }}
          >
            Upazila
          </label>
          <motion.div whileFocus="focus" variants={fieldFocusVariants}>
            <div className="relative">
              <select
                name="upazila"
                onChange={handleChange}
                value={values.upazila}
                className="w-full p-2 pl-10 border rounded focus:outline-none"
                style={{
                  borderColor:
                    errors.upazila && touched.upazila
                      ? color.error
                      : !errors.upazila && touched.upazila
                      ? color.success
                      : color.border,
                  color: color.textPrimary,
                }}
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
                style={{ color: color.icon }}
              />
            </div>
          </motion.div>
          {errors.upazila && touched.upazila && (
            <div className="text-sm mt-1" style={{ color: color.error }}>
              {errors.upazila}
            </div>
          )}
          {!errors.upazila && touched.upazila && (
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <FaCheckCircle />
              <span>Upazila selected</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LocationSelector;