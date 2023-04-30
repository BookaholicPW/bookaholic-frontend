import { useSettings } from '@/@core/hooks/useSettings'
import useFetch from '@/@core/utils/useFetch'
import { AccountGet, AccountLogin } from '@/configs/endpoints'
import themeConfig from '@/configs/themeConfig'
import EmptyLayout from '@/layouts/EmptyLayout'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
  Grid,
} from '@mui/material'
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState, MouseEvent, ReactNode } from 'react'

interface State {
  email: string
  password: string
  showPassword: boolean
}

const AccountLoginPage = () => {
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false,
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  })
  const { settings, saveSettings } = useSettings()

  // ** Hook
  const router = useRouter()

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleLogin(event)
    }
  }

  const { request, loading } = useFetch<AccountLogin.ResponseBody>()

  const fetchUserData = async () => {
    const res = await request(AccountGet.method, AccountGet.path)
    if (res && res.success) {
      saveSettings({ ...settings, user: { ...settings.user, ...res.data } })
      router.push('/')
    }
  }

  const handleLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const requestData: AccountLogin.RequestBody = {
      email: values.email,
      password: values.password,
    }
    const res = await request(
      AccountLogin.method,
      AccountLogin.path,
      {},
      requestData
    )
    res?.message && setSnackbar({ open: true, message: res?.message || '' })
    if (res && res.success) {
      if (res.data) {
        saveSettings({ ...settings, user: res.data })
        setTimeout(() => {
          fetchUserData()
        }, 3000)
      }
    }
  }

  return (
    <Grid
      container
      alignContent="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Head>
        <title>Login - {themeConfig.appName}</title>
      </Head>
      <Grid item xs={8} md={6} lg={4}>
        <Box className="content-center">
          <Card sx={{ zIndex: 1 }}>
            <CardContent
              sx={{
                padding: (theme) => `${theme.spacing(4, 4, 0)} !important`,
              }}
            >
              <Box
                sx={{
                  mb: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/images/bookaholic.png"
                  alt="logo"
                  height={50}
                  width={150}
                />
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, marginBottom: 1.5 }}
                >
                  Welcome to {themeConfig.appName}! 👋🏻
                </Typography>
                <Typography variant="body2">
                  Please sign-in to your account and start the adventure
                </Typography>
              </Box>
              <form
                noValidate
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
              >
                <TextField
                  onChange={handleChange('email')}
                  autoFocus
                  fullWidth
                  id="email"
                  label="Email"
                  sx={{ marginBottom: 4 }}
                  onKeyDown={handleKeyDown}
                  inputProps={{
                    minLength: 5,
                  }}
                  type="email"
                />
                <FormControl fullWidth>
                  <InputLabel htmlFor="auth-login-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    value={values.password}
                    id="auth-login-password"
                    onChange={handleChange('password')}
                    type={values.showPassword ? 'text' : 'password'}
                    onKeyDown={handleKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label="toggle password visibility"
                        >
                          {values.showPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {/* Forgot Password */}
                <FormControl>
                  <Link href="/account/forgot-password">
                    <Typography
                      variant="subtitle2"
                      sx={{ mt: 2, display: 'block', textAlign: 'right' }}
                    >
                      Forgot password?
                    </Typography>
                  </Link>
                </FormControl>

                <Box
                  sx={{
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                ></Box>
                <Button
                  disabled={loading}
                  fullWidth
                  size="large"
                  variant="contained"
                  sx={{ marginBottom: 7 }}
                  onClick={(e) => handleLogin(e)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </Button>
                <Snackbar
                  open={snackbar.open}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  autoHideDuration={3000}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  message={snackbar.message}
                />
              </form>
              {/* Register */}
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Don&apos;t have an account?&nbsp;
                </Typography>
                <Link href="/account/register">
                  <Typography variant="subtitle1" color="primary">
                    Register
                  </Typography>
                </Link>
              </Box>
            </CardContent>
          </Card>
          {/* <FooterIllustrationsV1 /> */}
        </Box>
      </Grid>
    </Grid>
  )
}

AccountLoginPage.getLayout = (page: ReactNode) => (
  <EmptyLayout>{page}</EmptyLayout>
)

export default AccountLoginPage
