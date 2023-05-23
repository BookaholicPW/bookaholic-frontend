import Dialog from '@mui/material/Dialog'
import themeConfig from '@/configs/themeConfig'
import {
  Autocomplete,
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { set } from 'nprogress'
import { Author, Book, BookGenre, User } from '@/configs/schemas'
import { useSettings } from '@/@core/hooks/useSettings'
import useFetch from '@/@core/utils/useFetch'
import {
  AccountUpdate,
  ListBookAuthor,
  ListBookGenres,
  ListBooks,
} from '@/configs/endpoints'

export default function WelcomeDialog(props: {
  open: boolean
  user: User
  setSnackbar: (value: { open: boolean; message: string }) => void
  setOpen: (value: boolean) => void
}) {
  const [step, setStep] = React.useState(0)
  const [userInfo, setUserInfo] = useState<User>(props.user)
  const { settings, saveSettings, reloadSettings } = useSettings()
  const { request } = useFetch()
  const [books, setBooks] = useState<Book[] | undefined>(undefined)
  const [bookGenres, setBookGenres] = useState<BookGenre[] | undefined>(
    undefined
  )
  const [authors, setAuthors] = useState<Author[] | undefined>(undefined)
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [selectedGenres, setSelectedGenres] = useState<BookGenre[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([])

  // Fetch books from API
  useEffect(() => {
    if (books) return
    request(ListBooks.method, ListBooks.path).then((res) => {
      let response = res as ListBooks.ResponseBody
      if (response && response.success) {
        setBooks(response.data)
      }
    })
  }, [books])

  // Fetch book genres from API
  useEffect(() => {
    if (bookGenres) return
    request(ListBookGenres.method, ListBookGenres.path).then((res) => {
      let response = res as ListBookGenres.ResponseBody
      if (response && response.success) {
        setBookGenres(response.data)
      }
    })
  }, [bookGenres])

  // Fetch authors from API
  useEffect(() => {
    if (authors) return
    request(ListBookAuthor.method, ListBookAuthor.path).then((res) => {
      let response = res as ListBookAuthor.ResponseBody
      if (response && response.success) {
        setAuthors(response.data)
      }
    })
  }, [authors])

  useEffect(() => {
    if (selectedBooks.length !== userInfo.favoriteBooks?.length) {
      setSelectedBooks(userInfo.favoriteBooks || [])
    }
  }, [userInfo.favoriteBooks])

  useEffect(() => {
    console.log(userInfo.favoriteGenres)
    if (selectedGenres.length !== userInfo.favoriteGenres?.length) {
      setSelectedGenres(userInfo.favoriteGenres || [])
    }
  }, [userInfo.favoriteGenres])

  useEffect(() => {
    if (selectedAuthors.length !== userInfo.favoriteAuthors?.length) {
      setSelectedAuthors(userInfo.favoriteAuthors || [])
    }
  }, [userInfo.favoriteAuthors])

  const saveInfo = async () => {
    switch (step) {
      case 0:
        setStep(1)
        break
      case 1:
        if (!userInfo.username) {
          props.setSnackbar({
            open: true,
            message: 'Username cannot be empty',
          })
          return
        }
        if (!userInfo.name) {
          props.setSnackbar({
            open: true,
            message: 'Password cannot be empty',
          })
          return
        }
        if (!userInfo.bio) {
          props.setSnackbar({
            open: true,
            message: 'Bio cannot be empty',
          })
          return
        }
        await request(AccountUpdate.method, AccountUpdate.path, undefined, {
          ...userInfo,
          favoriteGenres: selectedGenres.map((genre) => genre.id),
          favoriteAuthors: selectedAuthors.map((author) => author.id),
          favoriteBooks: selectedBooks.map((book) => book.id),
        }).then((res) => {
          let response = res as AccountUpdate.ResponseBody
          if (response && response.success) {
            setStep(2)
          } else {
            props.setSnackbar({
              open: true,
              message: response.message,
            })
          }
        })
        break
      case 2:
      case 3:
      case 4:
        await request(AccountUpdate.method, AccountUpdate.path, undefined, {
          ...userInfo,
          favoriteGenres: selectedGenres.map((genre) => genre.id),
          favoriteAuthors: selectedAuthors.map((author) => author.id),
          favoriteBooks: selectedBooks.map((book) => book.id),
        }).then((res) => {
          let response = res as AccountUpdate.ResponseBody
          if (response && response.success) {
            saveSettings({
              ...settings,
              user: {
                ...settings.user,
                ...response.data,
              },
            })
            if (step === 4) {
              props.setOpen(false)
              reloadSettings(true)
            } else {
              setStep(step + 1)
            }
          } else {
            props.setSnackbar({
              open: true,
              message: response.message,
            })
          }
        })
        break
      default:
        props.setOpen(false)
        break
    }
  }
  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          textAlign: 'center',
        }}
      >
        Welcome to {themeConfig.appName}
      </DialogTitle>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" value={(step / 4) * 100} />
      </Box>
      <Box
        sx={{
          padding: '24px',
        }}
      >
        {step === 0 && (
          <DialogContentText>
            Just a few steps before you can start using {themeConfig.appName}:
          </DialogContentText>
        )}
        {step === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Your name"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfo,
                      name: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Username"
                  value={userInfo.username}
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfo,
                      username: e.target.value,
                    })
                  }
                  disabled={settings.user?.username ? true : false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Bio"
                  value={userInfo.bio}
                  multiline={true}
                  minRows={3}
                  onChange={(e) =>
                    setUserInfo({
                      ...userInfo,
                      bio: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        )}
        {step === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText variant="h6">
                Favorite Book Genres
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={bookGenres || []}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) => {
                    setSelectedGenres(value)
                  }}
                  value={selectedGenres || []}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Favorites Book Genres"
                      placeholder="Favorites"
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        )}
        {step === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText variant="h6">
                Favorite Authors
              </DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={authors || []}
                  getOptionLabel={(option) => option.name}
                  onChange={(e, value) => {
                    setSelectedAuthors(value)
                  }}
                  value={selectedAuthors || []}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Favorites Authors"
                      placeholder="Favorites"
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        )}
        {step === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DialogContentText variant="h6">Favorite Books</DialogContentText>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={books || []}
                  getOptionLabel={(option) => option.title}
                  onChange={(e, value) => {
                    setSelectedBooks(value)
                  }}
                  value={selectedBooks || []}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Favorites Books"
                      placeholder="Favorites"
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Box>
      <DialogActions>
        {step == 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setStep(step + 1)
            }}
          >
            Next
          </Button>
        )}
        {step > 0 && step <= 4 && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              saveInfo()
            }}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
