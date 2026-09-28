import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import getSingleMember from "@/api/org/getSingleMember.api.ts";

import type { Member } from "@/types/Member";
import { useToast } from "@/context/ToastProvider.tsx";
import type { OrganizationOutletContext } from "@/types/OrganizationOutletContext";

const OrgMember = () => {
  const { slug, memberId, projectId } = useParams<{
    slug: string;
    projectId: string;
    memberId: string;
  }>();
  const { addToast } = useToast();
  const [result, setResult] = useState<Member | null>(null);
  const { organization } = useOutletContext<OrganizationOutletContext>();

  useEffect(() => {
    const getResults = async () => {
      if (!slug || !memberId) {
        return;
      }
      const res = await getSingleMember(memberId, organization.id);
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
        {projectId ? (
          <p>Welcome to this project</p>
        ) : (
          <p>Welcome to this Organization</p>
        )}
        <div className=" flex flex-col items-center gap-4">
          <div className="p-4 border w-full">
            <p>Name: {result?.full_name}</p>
            <p>Role: {result?.role}</p>
            <p>Username: {result?.username}</p>
            <p>Joined At: {result?.joined_at.split("T")[0]}</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrgMember;
