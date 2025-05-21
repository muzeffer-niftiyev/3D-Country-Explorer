import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-[#faf3d2] dark:bg-zinc-900 h-full overflow-hidden p-6 flex items-center flex-col transition-all duration-600">
      <div className="mb-5">
        <NavLink
          to={"country-details"}
          className={({ isActive }) =>
            `text-neural-900 dark:text-[#eee] py-2 px-3 rounded-tl-lg  transition-colors duration-600 rounded-bl-lg border-1 border-r-0 border-[#ccc3c3] ${
              isActive
                ? "bg-amber-100 dark:bg-[#141416]  font-semibold"
                : "bg-[#fffbeb] dark:bg-[#222225]"
            }`
          }
        >
          Explore
        </NavLink>
        <NavLink
          to={"liked"}
          className={({ isActive }) =>
            `text-neural-900 dark:text-[#eee] py-2 px-3 rounded-tr-lg transition-colors duration-600 rounded-br-lg border-1 border-l-0 border-[#ccc3c3] ${
              isActive
                ? "bg-amber-100 dark:bg-[#141416] font-semibold"
                : "bg-[#fffbeb] dark:bg-[#222225]"
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
