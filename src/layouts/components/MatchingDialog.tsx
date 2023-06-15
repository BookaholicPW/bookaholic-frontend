import useFetch from '@/@core/utils/useFetch'
import {
  GetSuggestedMatching,
  PostSuggestedProfileAnswer,
} from '@/configs/endpoints'
import { User, UserMatching } from '@/configs/schemas'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CancelIcon from '@mui/icons-material/Cancel'
import { useEffect, useState } from 'react'

export default function MatchingDialog(props: {
  user: User
  open: boolean
  setOpen: (value: boolean) => void
  setSnackbar: (value: { open: boolean; message: string }) => void
}) {
  const [matching, setMatching] = useState<UserMatching | undefined>(undefined)
  const [opponent, setOpponent] = useState<User | undefined>(undefined)
  const { request } = useFetch()
  const reloadMatching = async () => {
    await request(GetSuggestedMatching.method, GetSuggestedMatching.path)
      .then((response) => {
        let res = response as GetSuggestedMatching.ResponseBody
        if (res.success) {
          setMatching(res.data)
          if (res.data.firstUser.id === props.user.id) {
            setOpponent(res.data.secondUser)
          } else {
            setOpponent(res.data.firstUser)
          }
        }
      })
      .catch((error) => {
        props.setSnackbar({
          open: true,
          message: error.message,
        })
        props.setOpen(false)
      })
  }
  const answerMatching = async (answer: string) => {
    await request(
      PostSuggestedProfileAnswer.method,
      PostSuggestedProfileAnswer.path,
      undefined,
      {
        id: matching?.id,
        answer: answer,
      }
    ).then((reponse) => {
      let res = reponse as PostSuggestedProfileAnswer.ResponseBody
      if (res.success) {
        let data = res.data
        if (data.matched) {
          props.setSnackbar({
            open: true,
            message: "You have a new match! Let's start a conversation!",
          })
          setOpponent(undefined)
          setMatching(undefined)
          props.setOpen(false)
        } else {
          setOpponent(undefined)
          setMatching(undefined)
        }
      }
    })
  }
  useEffect(() => {
    if (!matching && props.open) {
      reloadMatching()
    }
  }, [matching, props.open])

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      {matching && opponent ? (
        <Card sx={{ maxWidth: '350px' }}>
          <CardMedia
            component="img"
            height={'350px'}
            width={'350px'}
            image={opponent.avatar || '/images/default_profile.png'}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {opponent.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {opponent.bio}
            </Typography>
          </CardContent>
          <CardActions>
            <Box
              sx={{
                margin: 'auto',
              }}
            >
              <IconButton
                size="large"
                onClick={() => {
                  answerMatching('like')
                }}
              >
                <FavoriteIcon />
              </IconButton>
              <IconButton
                size="large"
                onClick={() => {
                  answerMatching('dislike')
                }}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      ) : (
        <Box margin={'30px'}>
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  )
}
