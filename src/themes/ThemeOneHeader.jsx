import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { FiShoppingBag } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { APIURL } from "../lib/ApiKey";

const ThemeOneHeader = () => {
  const location = useLocation();
  const { restoSlug, restos, resInfo, customization, table_id } = useMenu();

  return (
    <header
      //   style={{ backgroundColor: customization?.selectedBgColor }}
      className="md:max-w-2xl md:w-full md:top-2 bg-white/80 fixed top-0 z-50 flex items-center justify-between w-screen px-5 py-3 mx-auto shadow"
    >
      <Link
        to={`/menu/${restoSlug}?table_id=${table_id}`}
        className="flex items-center gap-2 text-2xl font-bold"
        style={{ color: customization?.selectedPrimaryColor }}
      >
        <img
          src={`${APIURL}/storage/${resInfo.logo}`}
          alt={restos.name}
          loading="lazy"
          className="hidden object-contain w-10 h-10"
          onError={(e) => (e.target.src = "/assets/placeholder-image.png")}
        />
        <span className="font-[SEGOE-UI]">{restos.name || "Garista"}</span>
      </Link>

      <ul className="flex items-center gap-6">
        <NavLink
          to={`/menu/${restoSlug}/info?table_id=${table_id}`}
          icon={IoInformationCircleOutline}
          activeLink={location.pathname === `/menu/${restoSlug}/info`}
        />

        <NavLink
          to={`/menu/${restoSlug}/Achat?table_id=${table_id}`}
          icon={FiShoppingBag}
          activeLink={location.pathname === `/menu/${restoSlug}/Achat`}
        />
      </ul>
    </header>
  );
};

export default ThemeOneHeader;

const NavLink = ({ to, activeLink, icon: Icon }) => {
  const { customization } = useMenu();

  return (
    <Link to={to}>
      <Icon
        size={30}
        style={{
          color: activeLink
            ? customization?.selectedPrimaryColor
            : customization?.selectedSecondaryColor,
        }}
      />
    </Link>
  );
};
