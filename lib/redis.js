import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".pastebin-data");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Directory already exists
  }
}

// Encode key to be filesystem-safe (Windows doesn't allow colons in filenames)
function encodeKey(key) {
  return Buffer.from(key).toString("hex");
}

const kv = {
  async get(key) {
    await ensureDataDir();
    const encodedKey = encodeKey(key);
    const filePath = path.join(DATA_DIR, `${encodedKey}.json`);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  },

  async set(key, value, options = {}) {
    await ensureDataDir();
    const encodedKey = encodeKey(key);
    const filePath = path.join(DATA_DIR, `${encodedKey}.json`);
    await fs.writeFile(filePath, JSON.stringify(value), "utf-8");
    
    // Handle TTL
    if (options.ex) {
      setTimeout(async () => {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          // File already deleted or doesn't exist
        }
      }, options.ex * 1000);
    }
    
    return "OK";
  },

  async delete(key) {
    await ensureDataDir();
    const encodedKey = encodeKey(key);
    const filePath = path.join(DATA_DIR, `${encodedKey}.json`);
    try {
      await fs.unlink(filePath);
      return 1;
    } catch (err) {
      return 0;
    }
  },

  async ping() {
    return "PONG";
  },
};

export default kv;

