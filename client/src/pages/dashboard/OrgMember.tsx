import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getSingleMember, { type Member } from "@/api/org/getSingleMember.api.ts";
import { useToast } from "@/context/ToastProvider.tsx";

const OrgMember = () => {
  const { slug, memberId } = useParams<{ slug: string; memberId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Member | null>(null);

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !memberId) {
        return;
      }
      const res = await getSingleMember(Number(memberId), slug);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.member);
    };
    getResults();
  }, [slug, memberId]);

  return (
    <>
      <main className="bg-gray-50">
        <div className=" flex flex-col items-center gap-4">
          <div className="p-4 border w-full">
            <p>Name: {result?.full_name}</p>
            <p>Role: {result?.role}</p>
            <p>Email: {result?.email}</p>
            <p>Joined At: {result?.joined_at.split("T")[0]}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrgMember;
