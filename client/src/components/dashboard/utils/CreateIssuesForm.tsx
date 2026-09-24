import createIssue from "@/api/issues/createIssue.api";
import { useToast } from "@/context/ToastProvider.tsx";

type Params = {
  organizationId: number;
  projectId: number;
};

const CreateIssuesForm = ({ organizationId, projectId }: Params) => {
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());

      const result = await createIssue(
        organizationId,
        projectId,
        String(credentials.name),
        String(credentials.description),
        String(credentials.due_date),
        String(credentials.issue_status),
        String(credentials.priority),
        String(credentials.severity),
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
    <>
      <section className="flex flex-col gap-2">
        <div>
          <p className="text-center text-2xl font-semibold">
            Create Issues For This Project
          </p>
        </div>
        <form
          aria-label="Issue Form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-3  *:flex *:w-full *:flex-col"
        >
          <div>
            <label htmlFor="name">Enter Issue Name</label>
            <input
              className="border p-2"
              type="text"
              name="name"
              id="name"
              required
              placeholder="Enter Issue Name"
            />
          </div>
          <div>
            <label htmlFor="description">Enter Issue Description</label>
            <textarea
              className="border p-2"
              name="description"
              id="description"
              placeholder="Enter Issue Description"
              required
              minLength={10}
              rows={6}
            ></textarea>
          </div>
          <div>
            <label htmlFor="due_date">Enter Issue Due Date</label>

            <input
              className="border p-2"
              type="date"
              name="due_date"
              id="due_date"
              defaultValue={today}
              min={today}
              required
            />
          </div>
          <div>
            <label htmlFor="issue_status">Enter Issue Status</label>
            <select
              className="border p-2"
              name="issue_status"
              defaultValue="orphan"
              id="issue_status"
              required
            >
              <option value="orphan">Orphan</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
              <option value="archive">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority">Enter Issue Priority</label>
            <select
              className="border p-2"
              name="priority"
              defaultValue="low"
              id="priority"
              required
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
            </select>
          </div>
          <div>
            <label htmlFor="severity">Enter Issue Severity</label>

            <select
              className="border p-2"
              name="severity"
              defaultValue="minor"
              id="severity"
              required
            >
              <option value="minor">MINOR</option>
              <option value="major">MAJOR</option>
              <option value="critical">CRITICAL</option>
              <option value="trival">TRIVAL</option>
            </select>
          </div>

          <button
            type="submit"
            className="cursor-pointer border p-2 transition-all duration-200 active:scale-95"
          >
            Create Issue
          </button>
        </form>
      </section>
    </>
  );
};

export default CreateIssuesForm;
