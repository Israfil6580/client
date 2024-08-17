import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import logo from "../assets/react.svg";
import AuthForm from "./form/AuthForm";
const Navbar = () => {
  const { setSearchQuery, setPage, setSort, sort, user } =
    useContext(AuthContext);

  const handleSearch = (e) => {
    setPage(1); // Reset to first page when searching
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (event) => {
    setPage(1); // Reset to first page when sorting
    setSort(event.target.value);
  };
  return (
    <div className="bg-success">
      <div className="container mx-auto px-4">
        <div className="navbar p-0">
          <div className="flex-1">
            <button className="btn btn-ghost text-xl bg-transparent hover:bg-transparent p-0">
              <img alt="Logo" className="h-10 w-auto" src={logo} />
            </button>
          </div>
          {/* Sort Dropdown */}
          <div className="dropdown dropdown-end">
            {!user ? (
              <div>
                <button
                  className="btn px-5 min-h-[2.5rem] h-[2.5rem]"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  Login
                </button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <AuthForm />
                  </div>
                </dialog>
              </div>
            ) : (
              <div>
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-12 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={user?.photoURL}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" flex py-2 lg:gap-6 gap-2 justify-center px-5 container mx-auto">
        {/* Search Input */}
        <div className="lg:w-1/3 w-2/3">
          <label className="input h-[2.5rem] input-bordered flex items-center gap-2">
            <input
              id="search_input"
              type="text"
              className="grow"
              placeholder="Search"
              onChange={handleSearch}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-7 w-7 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
        <select
          className="border rounded-md p-2 outline-none lg:w-40 w-1/2"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="">Sort</option>
          <option value="price-asc">Low to High</option>
          <option value="price-desc">High to Low</option>
          <option value="date-added-desc">Newest First</option>
        </select>
      </div>
    </div>
  );
};

export default Navbar;
