import themeConfig from '@/configs/themeConfig'
import UserLayout from '@/layouts/Layout'
import '@/styles/globals.scss'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const App = (props: ExtendedAppProps) => {
  const { Component, pageProps } = props

  // Variables
  const getLayout =
    Component.getLayout ?? ((page: any) => <UserLayout>{page}</UserLayout>)

  return getLayout(<Component {...pageProps} />)
}

export default App
