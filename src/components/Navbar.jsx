import logo from "../assets/react.svg";
const Navbar = () => {
  return (
    <div className="bg-success md:px-32 px-4 pb-6 pt-4">
      <div className="navbar container mx-auto p-0">
        <div className="flex-1">
          <button className="btn btn-ghost text-xl bg-transparent hover:bg-transparent p-0">
            <img
              alt="Tailwind CSS Navbar component"
              className="h-10 w-auto"
              src={logo}
            />
          </button>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-14 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>

      {/* searching input here */}

      <div className="md:w-1/2 mx-auto">
        <label className="input h-[2.5rem] input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <button className="btn btn-ghost bg-transparent hover:bg-transparent p-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-6 w-6 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </label>
      </div>
    </div>
  );
};

export default Navbar;
