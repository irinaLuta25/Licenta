import React from "react";
import { FaCertificate } from "react-icons/fa";

const BadgeIcon = ({
  level = 1,
  label = "Maestru al timpului",
  filled = true,
  color = "#6366f1",
}) => {
  const textColor = filled ? "text-white" : "text-gray-500";
  const bgColor = filled ? color : "#d1d5db";

  return (
    <div className="relative flex items-center justify-center">
      <FaCertificate size={120} color={bgColor} />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center leading-tight">
        <div className={`text-[14px] font-bold ${textColor}`}>
          Nivel {level}
        </div>
        <div className={`text-[12px] ${textColor}`}>{label}</div>
      </div>
    </div>
  );
};

export default BadgeIcon;
