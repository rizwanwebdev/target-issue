import apiFetch from "@/api/auth/client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  organizationId: number;
  slug: string;
};

type Member = {
  id: number;
  full_name: string;
  username: string;
};
const SearchMembers = ({ organizationId, slug }: Props) => {
  const [query, setQuery] = useState("");
  const requestId = useRef(0);
  const [members, setMembers] = useState<Member[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setMembers([]);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) return;

    const controller = new AbortController();
    const id = ++requestId.current;

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch(
          `/api/v1/org/search?query=${encodeURIComponent(
            searchQuery,
          )}&organizationId=${organizationId}`,
          {
            signal: controller.signal,
          },
        );

        const data = await res.json();

        // Ignore an older request if a newer one already completed.
        if (id !== requestId.current) return;
        setMembers(data.users);
        console.log(data.users);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, organizationId]);

  return (
    <div ref={searchRef} className="relative">
      <div className="flex items-center gap-1 rounded-lg border border-gray-300 p-2 focus-within:border-indigo-500">
        <span className="text-gray-500">@</span>

        <input
          type="search"
          value={query}
          onChange={handleChange}
          name="search"
          placeholder="Enter name or username"
          id="search"
          className="flex-1 border-none text-gray-700 outline-none"
        />
      </div>

      {members.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {members.map((member) => (
            <Link
              key={member.id}
              to={`/dashboard/organizations/${slug}/members/${member.username}`}
              className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-600">
                {member.full_name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {member.full_name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  @{member.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchMembers;
