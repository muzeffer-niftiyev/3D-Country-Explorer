import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      dispatch(setTheme("dark"));
    } else {
      document.documentElement.classList.remove("dark");
      dispatch(setTheme("light"));
    }
  }, [theme, dispatch]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
    localStorage.theme = newTheme;
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex justify-end w-full">
      <button
        onClick={toggleTheme}
        className="p-2.5 cursor-pointer rounded-2xl bg-gray-200 dark:bg-zinc-900 text-gray-800 dark:text-gray-100 my-8 mx-5 absolute z-2 transition-all duration-600"
      >
        {theme === "light" ? <Sun size={25} /> : <Moon size={25} />}
      </button>
    </div>
  );
};

export default ThemeToggle;
