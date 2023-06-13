import Image from 'next/image'
import { Inter } from 'next/font/google'
import React from 'react'
import themeConfig from '@/configs/themeConfig'
import { useSettings } from '@/@core/hooks/useSettings'
import WelcomeDialog from '@/layouts/components/WelcomeDialog'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      style={{
        padding: '0 0 0 0',
        margin: '0 0 0 0',
      }}
    ></main>
  )
}
