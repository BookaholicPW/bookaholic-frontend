import useFetch from '@/@core/utils/useFetch'
import {
  AccountUpdate,
  AccountUpdateAvatar,
  ListBookAuthor,
  ListBookGenres,
  ListBooks,
} from '@/configs/endpoints'
import { Author, Book, BookGenre, User } from '@/configs/schemas'
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from '@mui/material'
import { useSettings } from '@/@core/hooks/useSettings'
import { useEffect, useState } from 'react'

export default function ProfileDialog(props: {
  user: User
  open: boolean
  setOpen: (value: boolean) => void
  setSnackbar: (value: { open: boolean; message: string }) => void
}) {
  const [userInfo, setUserInfo] = useState<User>(props.user)
  const { settings, saveSettings, reloadSettings } = useSettings()
  const { request } = useFetch<AccountUpdate.ResponseBody>()

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
    if (selectedGenres.length !== userInfo.favoriteGenres?.length) {
      setSelectedGenres(userInfo.favoriteGenres || [])
    }
  }, [userInfo.favoriteGenres])

  useEffect(() => {
    if (selectedAuthors.length !== userInfo.favoriteAuthors?.length) {
      setSelectedAuthors(userInfo.favoriteAuthors || [])
    }
  }, [userInfo.favoriteAuthors])

  const saveProfile = () => {
    request(AccountUpdate.method, AccountUpdate.path, undefined, {
      ...userInfo,
      favoriteBooks: selectedBooks.map((book) => book.id),
      favoriteGenres: selectedGenres.map((genre) => genre.id),
      favoriteAuthors: selectedAuthors.map((author) => author.id),
    }).then((res) => {
      if (res && res.success) {
        props.setOpen(false)
        saveSettings({
          ...settings,
          user: { ...res.data, token: settings?.user?.token },
        })
        reloadSettings(true)
        props.setSnackbar({
          open: true,
          message: res.message,
        })
      }
    })
  }

  const setUserAvatar = async (file: File) => {
    console.log(file)
    const formData = new FormData()
    formData.append('file', file)
    let result = await request(
      AccountUpdateAvatar.method,
      AccountUpdateAvatar.path,
      {},
      formData
    )
    if (result && result.success) {
      props.setOpen(false)
      reloadSettings(true)
    }
    props.setSnackbar({
      open: true,
      message: result.message,
    })
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.setOpen(false)
      }}
    >
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Avatar
              alt={props.user.username}
              src={props.user.avatar || './images/default_profile.png'}
              sx={{
                width: 100,
                height: 100,
                margin: 'auto',
              }}
              onClick={() => {
                let input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e) => {
                  let file = (e.target as HTMLInputElement).files?.[0]
                  if (file) {
                    setUserAvatar(file)
                  }
                }
                input.click()
              }}
            />
          </Grid>
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
                label="Email"
                value={userInfo.email}
                aria-readonly={true}
                disabled
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Favorite Books</InputLabel>
            </FormControl>
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
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Favorite Authors</InputLabel>
            </FormControl>
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
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Favorite Book Genres</InputLabel>
            </FormControl>
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
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          type="submit"
          variant="outlined"
          size="large"
          onClick={() => {
            saveProfile()
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
