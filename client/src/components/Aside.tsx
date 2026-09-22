import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useToast } from "../context/ToastProvider.tsx";
export const Aside = () => {
  const { logout } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();

    if (result.error) {
      addToast(result.message, "error");
      return;
    }

    addToast(result.message, "success");
    navigate("/", { replace: true });
  };

  const asideLink = [
    { linkName: "Organizations", to: "/dashboard/organizations" },
    { linkName: "Projects", to: "/dashboard/organizations" },
    { linkName: "Teams", to: "/dashboard/organizations" },
    { linkName: "Issues", to: "/dashboard/organizations" },
  ];
  return (
    <>
      <aside className="max-h-screen flex py-6 flex-col gap-6 items-center border border-gray-300  max-lg:hidden  w-fit">
        <div className="px-6">
          <Link
            to="/dashboard"
            className="flex justify-center  items-center flex-col"
          >
            <img
              src="/target-issue.png"
              className="object-cover object-center w-15"
              alt="Target Issue"
            />
            <span>Target Issue</span>
          </Link>
        </div>
        <div className="w-full h-px bg-gray-200 rounded-full"></div>
        <div className="flex-1 flex gap-4 flex-col px-6">
          {asideLink.map((l) => (
            <Link
              key={l.linkName}
              to={l.to}
              className="px-5 py-2 active:bg-black bg-indigo-500 rounded-full text-white font-medium"
            >
              {l.linkName}
            </Link>
          ))}
        </div>
        <div className="w-full flex px-6">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-indigo-500 w-full text-center rounded-full text-white font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
