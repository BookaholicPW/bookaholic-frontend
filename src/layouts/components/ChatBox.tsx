import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material'
import { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { ApiResponseBodyBase, Chat, ChatMessage } from '@/configs/schemas'
import Head from 'next/head'
import { GetChat, PostChatMessage } from '@/configs/endpoints'
import useFetch from '@/@core/utils/useFetch'
import { useReducer } from 'react'
import { get } from 'cypress/types/lodash'
import { Settings } from '@/@core/context/settingsContext'

export default function ChatBox(props: {
  chat: Chat
  setSnackbar: (value: { open: boolean; message: string }) => void
  settings: Settings
  chatMessages: ChatMessage[]
  setChatMessages: (value: ChatMessage[]) => void
}) {
  const [lastMessage, setLastMessage] = useState<ChatMessage | undefined>()
  const [message, setMessage] = useState<string>('')
  const { request } = useFetch<ApiResponseBodyBase>()

  const getMessages = async () => {
    let url = GetChat.path.replace(':id', props.chat.id.toString())
    let checkLastMessage = props.chatMessages.find(
      (message) => message.id === lastMessage?.id
    );
    if (lastMessage && checkLastMessage) {
      url += '?lastMessageId=' + lastMessage.id + '&isUntil=true'
    }

    let response = (await request(GetChat.method, url)) as GetChat.ResponseBody
    if (response.success) {
      let res = response as GetChat.ResponseBody
      if (res.data.length === 0) {
        props.setChatMessages([])
        return
      }
      let messages = [...props.chatMessages, ...res.data]
      messages = messages.filter(
        (message, index, self) =>
          index === self.findIndex((m) => m.id === message.id)
      )
      messages = messages.sort((a, b) => a.time - b.time)
      props.setChatMessages(messages)
      if (messages.length > 0) {
        setLastMessage(messages[messages.length - 1])
      }
    }
  }

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'fetch':
        return getMessages()
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, 0)

  const sendMessage = async () => {
    console.log(message)
    let content = message.trim()
    setMessage('')
    let formData = new FormData()
    let formMessage = JSON.stringify({
      content: content,
      type: 'text',
    })
    formData.append('message', formMessage)
    let url = PostChatMessage.path.replace(':id', props.chat.id.toString())
    let result = await request(PostChatMessage.method, url, {}, formData)
    if (!result.success) {
      props.setSnackbar({
        open: true,
        message: result.message,
      })
      setMessage(content)
    }
  }
  useEffect(() => {
    setInterval(() => {
      dispatch({ type: 'fetch' })
    }, 1000)
    console.log('set interval')
  }, [])

  useEffect(() => {
    setLastMessage(undefined);
    props.setChatMessages([]);
  }, [props.chat.id]);

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 83px)',
        overflowY: 'auto',
        backgroundColor: '#fff',
        borderRadius: '10px',
        // padding: '10px',
        paddingBottom: '70px',
      }}
      className="chat-panel"
    >
      <Head>
        <title>{props.chat.sender.name} - Bookaholic</title>
      </Head>
      <div className="chat-box">
        <table>
          <colgroup>
            <col
              style={{
                width: '50px',
              }}
            />
            <col
              style={{
                width: 'calc(100% - 50px)',
                maxWidth: 'calc(100% - 50px)',
              }}
            />
          </colgroup>
          {props.chatMessages.map((message, index) => {
            let borderRadius = '0px'
            let currentUserSender =
              message.sender.id === props.settings.user?.id
            if (
              (index === 0 ||
                message.sender.id !== props.chatMessages[index - 1].sender.id) &&
              (index === props.chatMessages.length - 1 ||
                message.sender.id !== props.chatMessages[index + 1].sender.id)
            ) {
              borderRadius = '20px'
            } else if (
              index === 0 ||
              message.sender.id !== props.chatMessages[index - 1].sender.id
            ) {
              borderRadius = currentUserSender
                ? '20px 20px 5px 20px'
                : '20px 20px 20px 5px'
            } else if (
              index === props.chatMessages.length - 1 ||
              message.sender.id !== props.chatMessages[index + 1].sender.id
            ) {
              borderRadius = currentUserSender
                ? '20px 5px 20px 20px'
                : '5px 20px 20px 20px'
            } else {
              borderRadius = currentUserSender
                ? '20px 5px 5px 20px'
                : '5px 20px 20px 5px'
            }

            if (message.sender.id === props.settings.user?.id) {
              return (
                <tr className="user-message">
                  <td className="avatar"></td>
                  <td className="message">
                    <div
                      className="content"
                      style={{
                        borderRadius: borderRadius,
                      }}
                    >
                      {message.content}
                    </div>
                  </td>
                </tr>
              )
            } else {
              return (
                <tr className="bot-message">
                  <td className="avatar">
                    <Avatar src={props.chat.sender.avatar} />
                  </td>
                  <td className="message">
                    {false ? (
                      <div className="content">
                        <CircularProgress
                          color="inherit"
                          sx={{
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="content"
                        style={{
                          borderRadius: borderRadius,
                        }}
                      >
                        {message.content}
                      </div>
                    )}
                  </td>
                </tr>
              )
            }
          })}
        </table>
      </div>
      {false ? (
        <span className="empty-chat">
          Start a new conversation by saying "Hi"
        </span>
      ) : null}
      <Box
        sx={{
          padding: '10px 20px',
          minHeight: '70px',
          borderTop: 'solid 0.5px',
          position: 'absolute',
          bottom: 0,
          background: 'white',
          width: 'calc(100%)',
        }}
      >
        <FormControl
          sx={{
            width: '100%',
          }}
          variant="standard"
        >
          <InputLabel htmlFor="standard-adornment-message">
            Type your message
          </InputLabel>
          <Input
            type="text"
            multiline
            id="standard-adornment-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              } else if (e.key === 'Enter' && e.shiftKey) {
                setMessage((message) => message + '\n')
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="Type your message">
                  <SendIcon
                    onClick={() => {
                      sendMessage()
                    }}
                  />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Box>
  )
}
