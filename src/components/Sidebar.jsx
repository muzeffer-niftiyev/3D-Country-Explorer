import { useSelector } from "react-redux";
import { toSlug } from "../utils/slug";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const tabClass = (isActive, shape) =>
  `text-neutral-900 dark:text-[#eee] py-2 px-3 transition-colors duration-600 border-1 border-[#ccc3c3] ${shape} ${
    isActive
      ? "bg-amber-100 dark:bg-[#141416] font-semibold"
      : "bg-[#fffbeb] dark:bg-[#222225]"
  }`;

const Sidebar = () => {
  const { pathname } = useLocation();
  const selectedName = useSelector(
    (state) => state.country.selectedCountryData?.name
  );
  const exploreLink = selectedName
    ? `/country/${toSlug(selectedName)}`
    : "/country-details";
  const isExploreActive = pathname.startsWith("/country");

  return (
    <div className="bg-[#faf3d2] dark:bg-zinc-900 h-full overflow-y-auto rounded-md lg:rounded-none p-4 lg:p-6 flex items-center flex-col transition-all duration-600">
      <nav className="mb-5 flex" aria-label="Sections">
        <NavLink
          to={exploreLink}
          className={() =>
            tabClass(isExploreActive, "rounded-l-lg border-r-0")
          }
          aria-current={isExploreActive ? "page" : undefined}
        >
          Explore
        </NavLink>
        <NavLink
          to="/liked"
          className={({ isActive }) => tabClass(isActive, "border-x-0")}
        >
          Liked
        </NavLink>
        <NavLink
          to="/quiz"
          className={({ isActive }) =>
            tabClass(isActive, "rounded-r-lg border-l-0")
          }
        >
          Quiz
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default Sidebar;
