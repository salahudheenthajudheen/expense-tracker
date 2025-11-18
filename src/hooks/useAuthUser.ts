import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, ensureAuth } from '../firebase'

const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true'

export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(USE_LOCAL_STORAGE ? { uid: 'local-user' } as User : auth?.currentUser || null)
  const [loading, setLoading] = useState(!USE_LOCAL_STORAGE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (USE_LOCAL_STORAGE) {
      setUser({ uid: 'local-user' } as User)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    ensureAuth().catch((err) => {
      console.error('Auth error', err)
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, loading, error }
}
