import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInAnonymously, signInWithCustomToken, type User } from 'firebase/auth'
import { collection, doc, getFirestore } from 'firebase/firestore'

const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:demo',
}

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value.startsWith('demo'))
  .map(([key]) => key)

if (missingConfig.length && !USE_LOCAL_STORAGE) {
  console.warn(
    `Firebase config missing values for: ${missingConfig.join(', ')}. ` +
      'Add them to your Vite env (e.g. VITE_FIREBASE_API_KEY) or set VITE_USE_LOCAL_STORAGE=true',
  )
}

const firebaseApp = !USE_LOCAL_STORAGE && getApps().length 
  ? getApps()[0] 
  : !USE_LOCAL_STORAGE 
    ? initializeApp(firebaseConfig) 
    : null as any

export const db = USE_LOCAL_STORAGE ? null as any : getFirestore(firebaseApp)
export const auth = USE_LOCAL_STORAGE ? null as any : getAuth(firebaseApp)

const APP_ID = import.meta.env.VITE_APP_ID ?? 'ExpenseTrackerINR'

type CustomWindow = Window & { __initial_auth_token?: string }

export const ensureAuth = async (): Promise<User> => {
  if (USE_LOCAL_STORAGE) {
    return { uid: 'local-user' } as User
  }
  
  if (auth.currentUser) return auth.currentUser

  const token = (window as CustomWindow).__initial_auth_token
  if (token) {
    const { user } = await signInWithCustomToken(auth, token)
    delete (window as CustomWindow).__initial_auth_token
    return user
  }

  const { user } = await signInAnonymously(auth)
  return user
}

export const expensesCollectionRef = (userId: string) =>
  collection(db, 'artifacts', APP_ID, 'users', userId, 'expenses_data')

export const summaryDocRef = (userId: string) => doc(expensesCollectionRef(userId), 'summary')
