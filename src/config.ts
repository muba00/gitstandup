import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";

export interface Config {
  repos: string[];
}

const CONFIG_DIR = path.join(os.homedir(), ".gitstandup");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

/**
 * Ensure the config directory exists
 */
export async function ensureConfigDir(): Promise<void> {
  if (!existsSync(CONFIG_DIR)) {
    await mkdir(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load configuration from ~/.gitstandup/config.json
 */
export async function loadConfig(): Promise<Config> {
  try {
    const data = await readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty config
    return { repos: [] };
  }
}

/**
 * Save configuration to ~/.gitstandup/config.json
 */
export async function saveConfig(config: Config): Promise<void> {
  await ensureConfigDir();
  await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}
