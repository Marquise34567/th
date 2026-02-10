import { spawn } from 'child_process'

export function runCommand(cmd: string, args: string[], opts: any = {}) {
  return new Promise<void>((resolve, reject) => {
    const cp = spawn(cmd, args, { stdio: 'inherit', ...opts })
    cp.on('error', (err) => reject(err))
    cp.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
  })
}

export function runProcess(cmd: string, args: string[], opts: any = {}) {
  return new Promise<{ stdout: string; stderr: string; code: number }>((resolve, reject) => {
    const cp = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts })
    let stdout = ''
    let stderr = ''
    cp.stdout?.on('data', (d) => { stdout += d.toString() })
    cp.stderr?.on('data', (d) => { stderr += d.toString() })
    cp.on('error', (err) => reject(err))
    cp.on('close', (code) => resolve({ stdout, stderr, code: code ?? 0 }))
  })
}
