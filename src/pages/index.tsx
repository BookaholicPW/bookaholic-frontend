import Image from 'next/image'
import { Inter } from 'next/font/google'
import React from 'react'
import Head from 'next/head'
import themeConfig from '@/configs/themeConfig'
import { useSettings } from '@/@core/hooks/useSettings'
import WelcomeDialog from '@/layouts/components/WelcomeDialog'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { settings, saveSettings, reloadSettings } = useSettings()
  const [welcomeDialogOpen, setWelcomeDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (settings && settings.user && settings.user.id) {
      if (!settings.user.username) {
        setWelcomeDialogOpen(true)
      }
    }
  }, [settings]);
  return (
    <main>
      <Head>
        <title>{themeConfig.appName}</title>
      </Head>
      <h1>Hello World</h1>
      <WelcomeDialog
        open={welcomeDialogOpen}
        setOpen={setWelcomeDialogOpen}
      ></WelcomeDialog>
    </main>
  )
}
