import admin from 'firebase-admin'

let initialized = false

export function initFirebaseAdmin() {
  if (initialized) return admin
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp()
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      admin.initializeApp({ credential: admin.credential.cert(key as any) })
    } catch (e) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON')
      throw e
    }
  } else {
    // Fallback to default credentials; caller must ensure env is set
    admin.initializeApp()
  }
  initialized = true
  return admin
}

export function getFirestore() {
  const a = initFirebaseAdmin()
  return a.firestore()
}

export function getAuth() {
  const a = initFirebaseAdmin()
  return a.auth()
}

export default { initFirebaseAdmin, getFirestore, getAuth }
