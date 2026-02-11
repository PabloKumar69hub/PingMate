import { useState } from "react";
import assets from "../assets/assets";

const Avatar = ({ src, size = "w-9 h-9" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${size}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-600 animate-pulse rounded-full"></div>
      )}

      <img
        src={src || assets.avatar_icon}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${size} rounded-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default Avatar;
