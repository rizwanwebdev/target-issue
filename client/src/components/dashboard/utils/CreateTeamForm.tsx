import { useToast } from "../../../context/ToastProvider.tsx";
import createTeam from "../../../api/team/createTeam.api.ts";
import { useState } from "react";

type Params = {
  slug: string;
};

const CreateTeamForm = ({ slug }: Params) => {
  const { addToast } = useToast();
  const [color, setColor] = useState("#000000");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <>
      <section>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 *:border *:p-2"
        >
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Enter Team Name"
          />

          <input
            type="text"
            name="description"
            id="description"
            required
            placeholder="Enter Team Description"
          />

          <div className="flex items-center flex-row gap-2">
            <input
              type="color"
              name="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />

            <p>{color}</p>
          </div>

          <button
            type="submit"
            className="cursor-pointer transition-all duration-200 active:scale-95"
          >
            Create Team
          </button>
        </form>
      </section>
    </>
  );
};

export default CreateTeamForm;
