import createProject from "../../api/project/createProject.api.ts";
import { useToast } from "../../context/ToastProvider.tsx";
import { useNavigate, useParams } from "react-router-dom";

type Params = {
  isAdmin: boolean;
};

const CreateProjectForm = ({ isAdmin }: Params) => {
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
    //  startDate, targetDate
    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());

      const result = await createProject(
        slug,
        String(credentials.name),
        String(credentials.description),
        String(credentials.startDate),
        String(credentials.targetDate),
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
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      aria-label="Project Form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 *:border *:p-2"
    >
      <input type="text" name="name" id="name" required />

      <input type="text" name="description" id="description" required />
      <input
        type="date"
        name="startDate"
        defaultValue={today}
        min={today}
        required
      />

      <input
        type="date"
        name="targetDate"
        defaultValue={today}
        min={today}
        required
      />

      <button
        type="submit"
        className="cursor-pointer transition-all duration-200 active:scale-95"
      >
        Create Project
      </button>
    </form>
  );
};

export default CreateProjectForm;
