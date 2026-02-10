import admin from 'firebase-admin'

function parseServiceAccount(): admin.ServiceAccount | null {
  const env = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT
  if (!env) return null
  try {
    const raw = env.trim()
    const unq = (raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"')) ? raw.slice(1, -1) : raw
    const parsed = JSON.parse(unq) as any
    if (parsed.private_key) {
      parsed.privateKey = String(parsed.private_key).replace(/\\n/g, '\n')
    }
    if (parsed.client_email) {
      parsed.clientEmail = parsed.client_email
    }
    if (parsed.project_id) {
      parsed.projectId = parsed.project_id
    }
    return parsed as admin.ServiceAccount
  } catch (e) {
    console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', e)
    return null
  }
}

function getCredential() {
  const svc = parseServiceAccount()
  if (svc && svc.privateKey && svc.clientEmail) return admin.credential.cert(svc as admin.ServiceAccount)

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKeyRaw) {
    return undefined
  }
  const privateKey = String(privateKeyRaw).replace(/\n/g, '\n')
  return admin.credential.cert({ projectId, clientEmail, privateKey })
}

if (!admin.apps.length) {
  try {
    const credential = getCredential()
    if (credential) {
      admin.initializeApp({ credential })
    } else {
      console.warn('Firebase admin not initialized: missing service account envs')
    }
  } catch (e) {
    console.warn('Failed to initialize firebase-admin:', e)
  }
}

export const adminAuth: any = new Proxy({}, {
  get(_target, prop: string) {
    const a = admin.auth()
    const val = (a as any)[prop]
    if (typeof val === 'function') return (...args: any[]) => (val as Function).apply(a, args)
    return val
  },
})

export const adminDb: any = new Proxy({}, {
  get(_target, prop: string) {
    const db = admin.firestore()
    const val = (db as any)[prop]
    if (typeof val === 'function') return (...args: any[]) => (val as Function).apply(db, args)
    return val
  },
})

export function getFirestore() {
  return admin.firestore()
}

export function getBucket(name?: string) {
  const bucketName = name || process.env.FIREBASE_STORAGE_BUCKET
  if (!bucketName) throw new Error('FIREBASE_STORAGE_BUCKET not configured')
  return admin.storage().bucket(bucketName)
}

export const adminBucket = (process.env.FIREBASE_STORAGE_BUCKET ? admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET) : null)

export const isAdminInitialized = Boolean(admin.apps && admin.apps.length)

export default admin
