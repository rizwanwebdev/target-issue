import { useToast } from "../../context/ToastProvider.tsx";
import { useNavigate, useParams } from "react-router-dom";
import createTeam from "../../api/team/createTeam.api.ts";

type Params = {
  isAdmin: boolean;
};

const CreateTeamForm = ({ isAdmin }: Params) => {
  const { addToast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAdmin) {
      return;
    }

    if (!slug) {
      navigate("/dashboard");
      return;
    }

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());

      const result = await createTeam(
        slug,
        String(credentials.name),
        String(credentials.description),
        String(credentials.color),
      );

      if (result.error) {
        addToast(result.message, "error");
        return;
      }

      addToast(result.message, "success");
      form.reset();
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Something went wrong",
        "error",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 *:border *:p-2"
    >
      <input type="text" name="name" id="name" required />

      <input type="text" name="description" id="description" required />

      <input
        type="color"
        name="color"
        id="color"
        defaultValue="#000000"
        required
      />

      <button
        type="submit"
        className="cursor-pointer transition-all duration-200 active:scale-95"
      >
        Create Team
      </button>
    </form>
  );
};

export default CreateTeamForm;
