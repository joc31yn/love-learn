'use client'

import { createClient } from '@/utils/supabase/client'
import { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
  }
}

const OneTapComponent = () => {
  const supabase = createClient()
  const router = useRouter()
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const generateNonce = async (): Promise<string[]> => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const nonce = btoa(String.fromCharCode(...Array.from(array)))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
  }

  useEffect(() => {
    console.log("bruh")
    // Wait until the Google script is fully loaded
    const checkGoogleScript = () => {
      if (window.google && window.google.accounts) {
        setIsScriptLoaded(true)
      }
    }
    console.log("yes");
    window.addEventListener('load', checkGoogleScript)

    return () => {
      window.removeEventListener('load', checkGoogleScript)
    }
  }, [])

  useEffect(() => {
    if (!isScriptLoaded) return

    const initializeGoogleOneTap = async () => {
      const [nonce, hashedNonce] = await generateNonce()
      const { data, error } = await supabase.auth.getSession()
      if (error || data.session) return router.push('/')

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: CredentialResponse) => {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
            nonce,
          })
          if (!error) router.push('/')
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      })
      window.google.accounts.id.prompt()
    }

    initializeGoogleOneTap()
  }, [isScriptLoaded])

  return <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
}

export default OneTapComponent
