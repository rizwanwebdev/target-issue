import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import getSingleMember, { type Member } from "@/api/org/getSingleMember.api.ts";
import { useToast } from "@/context/ToastProvider.tsx";
import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";

const OrgMember = () => {
  const { slug, memberId } = useParams<{ slug: string; memberId: string }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Member | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !memberId) {
        return;
      }
      const res = await getSingleMember(Number(memberId), organization.id);
      if (res.error) {
        addToast(res.message, "error");
      }
      setResult(res.member);
    };
    getResults();
  }, [slug, memberId]);

  return (
    <>
      <title>Member | About</title>
      <main>
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
