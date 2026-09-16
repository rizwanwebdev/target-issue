import { Worker } from "bullmq";
import redis from "../queue/redis.js";
import { sendEmail } from "../services/email.service.js";

const worker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing email job ${job.id}`);

    const { to, subject, text, html } = job.data;

    console.log(to, text);

    // await sendEmail({
    //   to,
    //   subject,
    //   text,
    //   html,
    // });

    console.log(`Email sent to ${to}`);
  },
  {
    connection: redis,

    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Email job ${job?.id} failed:`, error.message);
});

console.log("Email worker started");
