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
import useFetch from '@/@core/utils/useFetch'
import { GetChatList } from '@/configs/endpoints'
import { Chat, ChatMessage } from '@/configs/schemas'
import ChatBox from './components/ChatBox'
import Head from 'next/head'

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
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([])
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null)
  const { request } = useFetch<GetChatList.ResponseBody>()
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
  const [lastInbox, setLastInbox] = React.useState<Chat[] | null>(null)
  React.useEffect(() => {
    getLastInbox().then((res) => {
      setLastInbox(res)
    })
  }, [])

  const openProfileDialog = () => {
    setProfileDialogOpen(true)
  }

  const handleListItemClick = (_event: any, index: string) => {
    setChatMessages([])
    setSelectedChat(lastInbox?.find((chat) => chat.id === index) ?? null)
  }

  const [snackbar, setSnackbar] = React.useState<{
    open: boolean
    message: string
  }>({ open: false, message: '' })

  async function getLastInbox(): Promise<Chat[]> {
    const res = await request(GetChatList.method, GetChatList.path)
    if (res.success) {
      return res.data
    } else {
      return []
    }
  }

  const accountLogout = () => {
    saveSettings({ ...settings, user: undefined })
    setSnackbar({ open: true, message: 'Logout success' })
  }

  const [matchingDialogOpen, setMatchingDialogOpen] = React.useState(false)

  return (
    <Box sx={{ display: 'flex' }}>
      <Head>
        (!selectedChat ? (<title>Bookaholic</title>) : null)
      </Head>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {selectedChat?.sender?.name ?? 'Chat'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={true}>
        <Box
          sx={{
            height: 'calc(100% - 60px)',
            overflowY: 'auto',
            overflowX: 'hidden',
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
                <IconButton aria-label="person-add-icon"
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
              <List aria-label="last-inbox-list" component="nav">
                {lastInbox.map((item) => (
                  <ListItemButton
                      aria-label="chat-item"
                    selected={selectedChat?.id === item.id}
                    onClick={(event) => handleListItemClick(event, item.id)}
                    key={item.id}
                  >
                    <ListItemAvatar>
                      <Avatar
                          aria-label="profile-avatar"
                          alt={item.sender.avatar} src={item.sender.avatar}>
                        {item.sender.username[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.sender.name || item.sender.username}
                      secondary={
                        item.lastChatMessage?.sender?.id == settings.user?.id
                          ? 'You: ' +
                            (item.lastChatMessage?.type == 'image'
                              ? 'Photo'
                              : item.lastChatMessage?.content || '')
                          : ''
                      }
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
          <ListItem key="profile-item">
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
              secondary={
                <Typography
                    aria-label="logout-option"
                  variant="caption"
                  noWrap
                  component="div"
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={accountLogout}
                >
                  Logout
                </Typography>
              }
            />
            <IconButton onClick={openProfileDialog}>
              <SettingsSuggestIcon />
            </IconButton>
          </ListItem>
          <Divider sx={{ marginTop: '5px' }} />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, padding: '10px' }}>
        <DrawerHeader />
        {selectedChat ? (
          <ChatBox
            chat={selectedChat}
            setSnackbar={setSnackbar}
            settings={settings}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        ) : null}
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
