const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Replace with your Slack Webhook URL
const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

app.use(bodyParser.json());

app.post("/github", async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  let message = "";

  if (event === "push") {
    message = `📦 *Push Event* by ${payload.pusher.name} in \`${payload.repository.full_name}\`\n*${payload.head_commit.message}*\n<${payload.compare}|View Changes>`;
  } else if (event === "issues") {
    message = `🐞 *Issue ${payload.action}* by ${payload.sender.login} in \`${payload.repository.full_name}\`\n*${payload.issue.title}*\n<${payload.issue.html_url}|View Issue>`;
  } else if (event === "pull_request") {
    message = `🚀 *Pull Request ${payload.action}* by ${payload.sender.login} in \`${payload.repository.full_name}\`\n*${payload.pull_request.title}*\n<${payload.pull_request.html_url}|View PR>`;
  } else {
    message = `📢 *${event}* event received. Not handled.`;
  }

  // Send to Slack
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: message
    });
    res.status(200).send("Event received");
  } catch (err) {
    console.error("Error sending to Slack:", err);
    res.status(500).send("Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
