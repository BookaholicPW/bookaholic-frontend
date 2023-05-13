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
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import { Settings } from '@/@core/context/settingsContext'
import Grid from '@mui/material/Grid'
import CustomAvatar from './components/Avatar'
import Avatar from '@mui/material/Avatar'
import ProfileDialog from './components/ProfileDialog'
import { ListItemAvatar, ListItemSecondaryAction } from '@mui/material'

const drawerWidth = 240

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

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

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
          <Box>Matching new friends</Box>

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
                {settings.user?.username[0]}
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
          />
        )}
      </Box>
    </Box>
  )
}
