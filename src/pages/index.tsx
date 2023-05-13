import Image from 'next/image'
import { Inter } from 'next/font/google'
import React from 'react'
import Head from 'next/head'
import themeConfig from '@/configs/themeConfig'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <Head>
        <title>{themeConfig.appName}</title>
      </Head>
      <h1>Hello World</h1>
    </main>
  )
}
