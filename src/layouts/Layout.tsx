// ** React Imports
import { ReactNode, useEffect, useState } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Hook Import

import router from 'next/router'
import { Button, Grid, Typography } from '@mui/material'
import { useSettings } from '@/@core/hooks/useSettings'
import useFetch from '@/@core/utils/useFetch'
import { AccountGet } from '@/configs/endpoints'

interface Props {
  children: ReactNode
}

const UserLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const { request } = useFetch<AccountGet.ResponseBody>()

  // ** Fetch Account Info
  const [refreshed, setRefreshed] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (settings.user && !refreshed) {
      console.log('Refresh', settings.user, refreshed)

      request(AccountGet.method, AccountGet.path).then((res) => {
        if (res && res.success) {
          saveSettings({
            ...settings,
            user: { ...res.data, token: settings?.user?.token },
          })
          setRefreshed(true)
        } else {
          saveSettings({ ...settings, user: undefined })
        }
      })
    }
  }, [settings.user])

  useEffect(() => {
    if (redirecting) {
      return
    }
    if (
      settings &&
      settings.loaded &&
      (!settings.user || !settings.user.token)
    ) {
      console.log('Login')
      setRedirecting(true)
      saveSettings({ ...settings, user: undefined })
      router.push('/account/login', undefined, { shallow: true })
    }
    if (
      !authenticated &&
      refreshed &&
      settings &&
      settings.loaded &&
      settings.user &&
      refreshed
    ) {
      console.log('Authenticated')
      setAuthenticated(true)
    }
  }, [settings, refreshed])
  // return <Grid>{children}</Grid>;
  return authenticated ? (
    <Grid>
      <Grid>
        <Typography variant="button">
          Logged in as {settings.user?.email}
        </Typography>
        <Button
          onClick={() => {
            setAuthenticated(false)
            saveSettings({ ...settings, user: undefined })
            router.push('/account/login', undefined, { shallow: true })
          }}
        >
          Logout
        </Button>
      </Grid>
      {children}
    </Grid>
  ) : (
    <Grid></Grid>
  )
}

export default UserLayout
