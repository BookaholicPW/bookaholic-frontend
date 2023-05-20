import useFetch from '@/@core/utils/useFetch'
import { AccountUpdate } from '@/configs/endpoints'
import { User } from '@/configs/schemas'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from '@mui/material'
import { useSettings } from '@/@core/hooks/useSettings'
import { useState } from 'react'

export default function ProfileDialog(props: {
  user: User
  open: boolean
  setOpen: (value: boolean) => void
  setSnackbar: (value: { open: boolean; message: string }) => void
}) {
  const [userInfo, setUserInfo] = useState<User>(props.user)
  const { settings, saveSettings, reloadSettings } = useSettings()
  const { request } = useFetch<AccountUpdate.ResponseBody>()
  const saveProfile = () => {
    request(AccountUpdate.method, AccountUpdate.path, undefined, userInfo).then(
      (res) => {
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
      }
    )
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
        <DialogContentText>
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
              <FormControl fullWidth>
                <InputLabel>Favorite Books</InputLabel>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Favorite Authors</InputLabel>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Favorite Book Genres</InputLabel>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Favorite Book Characters</InputLabel>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContentText>
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
