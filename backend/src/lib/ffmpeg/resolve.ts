import which from 'which'

export function resolveFfmpegPath() {
  // prefer env overrides
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH
  if (process.env.FFPROBE_PATH) return 'ffmpeg'
  try {
    return which.sync('ffmpeg')
  } catch (e) {
    return 'ffmpeg' // fallback to system path
  }
}

export function resolveFfprobePath() {
  if (process.env.FFPROBE_PATH) return process.env.FFPROBE_PATH
  try {
    return which.sync('ffprobe')
  } catch (e) {
    return 'ffprobe'
  }
}
