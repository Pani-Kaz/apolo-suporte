
import dotenv from "dotenv";

dotenv.config();

const { TOKEN, BOT_ID } = process.env;

if (!TOKEN || !BOT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  BOT_ID
};
