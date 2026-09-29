import Breadcrumbs from "@/components/dashboard/layout/Breadcrumbs";
import { useAuth } from "@/context/AuthContext.tsx";

const DashHeader = () => {
  const { user } = useAuth();
  return (
    <>
      <header className="flex justify-between w-full bg-background sticky top-0 px-6 py-4 border-b border-b-gray-300">
        <div>
          <input
            type="text"
            required
            name="search"
            id="search"
            placeholder="Search Here"
            className="border border-gray-400 rounded p-2 min-w-30"
          />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="h-10 aspect-square bg-red-500 rounded-full shadow"></div>

            <div className="absolute w-3 aspect-square bg-green-600 rounded-full shadow top-0 right-0 animate-pulse"></div>
          </div>

          <div className="min-w-0">
            <p className="font-medium">{user?.fullName.split(" ")[0]}</p>
          </div>
        </div>
      </header>
      <Breadcrumbs />
    </>
  );
};

export default DashHeader;
