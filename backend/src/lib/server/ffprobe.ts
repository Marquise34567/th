import { runProcess } from './exec'

export type VideoMetadata = { width: number; height: number; duration: number }

export async function getVideoMetadata(inputPath: string): Promise<VideoMetadata> {
  const args = ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', inputPath]
  const res = await runProcess('ffprobe', args)
  if (res.code !== 0) throw new Error(`ffprobe failed: ${res.stderr.slice(-200)}`)
  try {
    const j = JSON.parse(res.stdout)
    const fmt = j.format || {}
    const streams = j.streams || []
    const video = streams.find((s: any) => s.codec_type === 'video') || {}
    const width = Number(video.width || 1920)
    const height = Number(video.height || 1080)
    const duration = Number(fmt.duration || 0)
    return { width, height, duration }
  } catch (e: any) {
    throw new Error(`ffprobe parse error: ${e?.message || String(e)} ${res.stderr.slice(-200)}`)
  }
}
