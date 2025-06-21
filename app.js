const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

app.use(express.json());

app.post("/github", async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log("📬 GitHub Event:", event);
  console.log("🧾 Payload:", JSON.stringify(payload, null, 2));

  let message = "";

  if (event === "push") {
    message = `📦 *Push Event* by ${payload.pusher.name} in \`${payload.repository.full_name}\`\n*${payload.head_commit.message}*\n<${payload.compare}|View Changes>`;
  } else if (event === "issues") {
    message = `🐞 *Issue ${payload.action}* by ${payload.sender.login} in \`${payload.repository.full_name}\`\n*${payload.issue.title}*\n<${payload.issue.html_url}|View Issue>`;
  } else if (event === "pull_request") {
    message = `🚀 *Pull Request ${payload.action}* by ${payload.sender.login} in \`${payload.repository.full_name}\`\n*${payload.pull_request.title}*\n<${payload.pull_request.html_url}|View PR>`;
  } else if (event === "star") {
    message = `⭐ *${payload.sender.login} starred* \`${payload.repository.full_name}\``;
  } else {
    message = `📢 *${event}* event received. Not handled.`;
  }

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message
    });
    res.status(200).send("✅ GitHub event received and sent to Slack.");
  } catch (err) {
    console.error("❌ Error sending to Slack:", err.message);
    res.status(500).send("Error sending to Slack");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
