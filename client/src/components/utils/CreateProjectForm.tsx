import createProject from "../../api/project/createProject.api.ts";
import { useToast } from "../../context/ToastProvider.tsx";

type Params = {
  slug: string;
};

const CreateProjectForm = ({ slug }: Params) => {
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        String(credentials.project_status),
      );
      console.log(result);

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
      <input
        type="text"
        name="name"
        id="name"
        required
        placeholder="Enter Project Name"
      />

      <input
        type="text"
        name="description"
        id="description"
        placeholder="Enter Project Description"
        required
      />
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
      <select name="project_status" defaultValue="new" id="project_status">
        <option value="new">New</option>
        <option value="ongoing">On Going</option>
        <option value="completed">Completed</option>
        <option value="archive">Archive</option>
      </select>

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
