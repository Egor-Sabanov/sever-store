import { randomBytes, scryptSync } from "node:crypto";
import { stdin, stdout } from "node:process";
import { emitKeypressEvents } from "node:readline";

if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
  console.error("Запусти команду в обычном интерактивном терминале.");
  process.exit(1);
}

emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdin.resume();
stdout.write("Придумай пароль администратора (ввод скрыт): ");

let password = "";
let finished = false;

function finish() {
  if (finished) return;
  finished = true;
  stdin.setRawMode(false);
  stdin.pause();
  stdin.removeAllListeners("keypress");
  stdout.write("\n");

  if (password.length < 12 || password.length > 256) {
    console.error("Пароль должен быть длиной от 12 до 256 символов.");
    process.exitCode = 1;
    return;
  }

  const salt = randomBytes(16);
  const digest = scryptSync(password, salt, 64);
  console.log("ADMIN_PASSWORD_HASH=scrypt$" + salt.toString("hex") + "$" + digest.toString("hex"));
}

stdin.on("keypress", (input, key) => {
  if (key.ctrl && key.name === "c") {
    password = "";
    finish();
    process.exitCode = 130;
    return;
  }

  if (key.name === "return" || key.name === "enter") {
    finish();
    return;
  }

  if (key.name === "backspace") {
    password = Array.from(password).slice(0, -1).join("");
    return;
  }

  if (!key.ctrl && input) password += input;
});
