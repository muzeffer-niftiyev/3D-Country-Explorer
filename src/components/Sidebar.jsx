import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-white dark:bg-[#0f0f18] h-full p-6 flex items-center flex-col">
      <div className="mb-8">
        <NavLink
          to={"country-details"}
          className={({ isActive }) =>
            `text-[#333] py-2 px-3 rounded-tl-lg rounded-bl-lg  ${
              isActive ? "bg-[#e4e4e9] font-semibold" : "bg-[#eeeef1]"
            }`
          }
        >
          Explore
        </NavLink>
        <NavLink
          to={"liked"}
          className={({ isActive }) =>
            `text-[#333] py-2 px-3 rounded-tr-lg rounded-br-lg  ${
              isActive ? "bg-[#e4e4e9] font-semibold" : "bg-[#eeeef1]"
            }`
          }
        >
          Liked
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
