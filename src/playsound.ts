import { spawnSync } from "child_process";

const FFPLAY_PATH = "/Users/husong/local/bin/ffplay";

export function playSound(url: string) {
  spawnSync(FFPLAY_PATH, ["-i", url, "-nodisp", "-fast", "-autoexit"]);
}
