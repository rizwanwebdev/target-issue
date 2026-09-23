import { useAuth } from "../../../context/AuthContext.tsx";

const DashHeader = () => {
  const { user } = useAuth();
  return (
    <>
      <header className="flex justify-between w-full sticky top-0 px-6 py-4 border-b border-b-gray-300">
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

        <div className="flex gap-2">
          <div className="relative">
            <div className=" h-full aspect-square bg-red-500 rounded-full shadow"></div>
            <div className="absolute w-3 animate-pulse aspect-square bg-green-600 rounded-full shadow  top-0 right-0"></div>
          </div>
          <div>
            <p className="font-medium">{user?.fullName}</p>
          </div>
        </div>
      </header>
    </>
  );
};

export default DashHeader;
