import * as React from 'react'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import { Settings } from '@/@core/context/settingsContext'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import ProfileDialog from './components/ProfileDialog'
import { ListItemAvatar, Snackbar } from '@mui/material'
import WelcomeDialog from './components/WelcomeDialog'
import MatchingDialog from './components/MatchingDialog'

const drawerWidth = 340

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

function generateExampleLastInbox() {
  return [
    {
      id: '1',
      username: 'John Doe',
      lastMessage: {
        id: '1',
        content: 'Hello',
        time: new Date().getTime() / 1000,
      },
      seen: false,
    },
    {
      id: '2',
      username: 'Jane Doe',
      lastMessage: {
        id: '2',
        content: 'Hello',
        time: new Date().getTime() / 1000,
      },
      seen: false,
    },
    {
      id: '3',
      username: 'John Smith',
      lastMessage: {
        id: '3',
        content: 'How are you?',
        time: new Date().getTime() / 1000,
      },
      seen: true,
    },
  ]
}

export default function MiniDrawer(props: {
  children: React.ReactNode
  settings: Settings
  saveSettings: (settings: Settings) => void
}) {
  const { children, settings, saveSettings } = props
  const theme = useTheme()
  const open = true
  const [profileDialogOpen, setProfileDialogOpen] = React.useState(false)
  const [welcomeDialogOpen, setWelcomeDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (settings && settings.user && settings.user.id) {
      if (
        !settings.user.username ||
        !settings.user.favoriteBooks ||
        settings.user.favoriteBooks.length === 0 ||
        !settings.user.favoriteAuthors ||
        settings.user.favoriteAuthors.length === 0 ||
        !settings.user.favoriteGenres ||
        settings.user.favoriteGenres.length === 0
      ) {
        setWelcomeDialogOpen(true)
      }
    }
  }, [settings])
  const [lastInbox, setLastInbox] = React.useState<
    | {
        id: string
        username: string
        avatar?: string
        lastMessage: { id: string; content: string; time: number }
        seen: boolean
      }[]
    | null
  >(generateExampleLastInbox())

  const openProfileDialog = () => {
    setProfileDialogOpen(true)
  }

  const [selectedIndex, setSelectedIndex] = React.useState<string | null>(null)

  const handleListItemClick = (_event: any, index: string) => {
    setSelectedIndex(index)
  }

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean
    message: string
  }>({ open: false, message: '' })

  const [matchingDialogOpen, setMatchingDialogOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={true}>
        <Box
          sx={{
            height: 'calc(100% - 60px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            // '&::-webkit-scrollbar': {
            //   width: '0.4em',
            // },
            // '&::-webkit-scrollbar-track': {
            //   boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            //   webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            // },
            // '&::-webkit-scrollbar-thumb': {
            //   backgroundColor: 'rgba(0,0,0,.1)',
            //   outline: '1px solid slategrey',
            // },
          }}
        >
          <Box
            sx={{
              margin: '20px',
            }}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography variant="subtitle1">
                  Matching new friends
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    whiteSpace: 'normal',
                  }}
                >
                  Start finding friends with similar interests
                </Typography>
              </Grid>
              <Grid item xs={2} display={'flex'} alignItems={'center'}>
                <IconButton
                  onClick={() => {
                    setMatchingDialogOpen(true)
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>

          <Divider />
          {lastInbox ? (
            <Box
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            >
              <List component="nav">
                {lastInbox.map((item) => (
                  <ListItemButton
                    selected={selectedIndex === item.id}
                    onClick={(event) => handleListItemClick(event, item.id)}
                  >
                    <ListItemAvatar>
                      <Avatar alt={item.username} src={item.avatar}>
                        {item.username[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.username}
                      secondary={item.lastMessage.content}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" noWrap component="div">
                No new friends
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            alignItems: 'center',
            bottom: 0,
            display: 'block',
            position: 'fixed',
            width: drawerWidth,
          }}
        >
          <Divider sx={{ marginBottom: '15px' }} />
          <ListItem>
            <ListItemAvatar>
              <Avatar alt={settings.user?.username} src={settings.user?.avatar}>
                {settings.user?.username ? settings.user?.username[0] : null}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="overline" noWrap component="div">
                  {settings.user?.username || 'Usermame'}
                </Typography>
              }
              // secondary={item.lastMessage.content}
            />
            <IconButton onClick={openProfileDialog}>
              <SettingsSuggestIcon />
            </IconButton>
          </ListItem>
          <Divider sx={{ marginTop: '5px' }} />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
        {settings.user && (
          <ProfileDialog
            user={settings.user}
            open={profileDialogOpen}
            setOpen={setProfileDialogOpen}
            setSnackbar={setSnackbar}
          />
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        autoHideDuration={6000}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      {settings && settings.user && settings.user.id && (
        <WelcomeDialog
          open={welcomeDialogOpen}
          setOpen={setWelcomeDialogOpen}
          user={settings.user}
          setSnackbar={setSnackbar}
        ></WelcomeDialog>
      )}
      {settings.user && settings.user.id && (
        <MatchingDialog
          user={settings.user}
          open={matchingDialogOpen}
          setOpen={setMatchingDialogOpen}
          setSnackbar={setSnackbar}
        ></MatchingDialog>
      )}
    </Box>
  )
}
