import { spawn } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import process from "node:process"

function stripJsonComments(source) {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "")
}

const [command, ...args] = process.argv.slice(2)

if (!command) {
    console.error("Uso: node scripts/run-cloudflare-command.mjs <comando> [...args]")
    process.exit(1)
}

const wranglerConfigPath = path.join(process.cwd(), "wrangler.jsonc")

if (!existsSync(wranglerConfigPath)) {
    console.error(`Arquivo não encontrado: ${wranglerConfigPath}`)
    process.exit(1)
}

const rawConfig = readFileSync(wranglerConfigPath, "utf8")
const parsedConfig = JSON.parse(stripJsonComments(rawConfig))
const wranglerVars = Object.fromEntries(
    Object.entries(parsedConfig.vars ?? {}).map(([key, value]) => [key, String(value)]),
)

const child = spawn(command, args, {
    stdio: "inherit",
    env: {
        ...wranglerVars,
        ...process.env,
    },
    shell: process.platform === "win32",
})

child.on("exit", (code) => {
    process.exit(code ?? 1)
})

child.on("error", (error) => {
    console.error(`Falha ao executar ${command}:`, error)
    process.exit(1)
})
