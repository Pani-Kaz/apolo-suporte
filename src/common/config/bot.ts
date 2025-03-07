import dotenv from "dotenv";

dotenv.config();

const {
  TOKEN,
  BOT_ID,
  SUPPORT_ID,
  LOGS_REPORT,
  TICKETS_OPENED,
  TICKETS_CLOSED,
  TICKETS_DATA
} = process.env;

if (
  !TOKEN ||
  !BOT_ID ||
  !SUPPORT_ID ||
  !LOGS_REPORT ||
  !TICKETS_OPENED ||
  !TICKETS_CLOSED ||
  !TICKETS_DATA
) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  BOT_ID,
  SUPPORT_ID,
  LOGS_REPORT,
  TICKETS_OPENED,
  TICKETS_CLOSED,
  TICKETS_DATA
};

