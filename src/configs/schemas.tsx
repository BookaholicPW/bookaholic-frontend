// Description: This file contains all the schemas used in the app
// Path: src/configs/schemas.tsx

export const appConfig: {
  appName: string
  siteName: string
  siteUrl: string
  siteDescription: string
  siteKeywords: string
  apiRoot: string
} = {
  appName: 'bookaholic',
  siteName: 'Bookaholic',
  siteUrl: 'https://bookaholic.pl',
  siteDescription: 'Bookaholic - connect all book lovers',
  siteKeywords:
    'bookaholic, book, books, book lovers, book lovers community, bookaholic community, bookaholic.pl, bookaholic.pl community',
  apiRoot: 'https://api.bookaholic.pl',
}

export type ApiRequestBodyBase = any

export type ApiResponseBodyBase = {
  success: boolean
  message: string
  data: any
}

export type ApiEndpoint = {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: {
    [key: string]: string
  }
  requestBody?: any
  responseBody?: any
}

export type Author = {
  id: string // uuid v4
  name: string
  characters?: BookCharacter[]
  avatar?: string
  born?: number
  died?: number
  books?: Book[]
  nationality?: string
  originalLanguage?: string
}

export type Book = {
  id: string // uuid v4
  title: string
  description?: string
  authors?: Author[]
  genres?: BookGenre[]
  cover?: string
  pages?: number
  published?: number
}

export type BookGenre = {
  id: string // uuid v4
  name: string
  books?: Book[]
}

export type BookCharacter = {
  id: string // uuid v4
  name: string
  books?: Book[]
}

export type UserBase = {
  id: string // uuid v4
  username: string
  name: string
  email: string
  avatar?: string
  bio?: string
  favoriteBooks?: Book[]
  favoriteAuthors?: Author[]
  favoriteGenres?: BookGenre[]
  favoriteCharacters?: BookCharacter[]
  token?: string
}

export type User = UserBase & {
  password: string
  createdAt: number
  updatedAt: number
}

export type UserToken = {
  token: string
}

export type UserMatching = {
  id: string // uuid v4
  users: (UserBase & {
    answer?: string
  })[],
  chatId?: string
}

export type ChatMessage = {
  id: string // uuid v4
  time: number // timestamp
  sender: UserBase
  content: string
  imgUrl?: string
}

export type Chat = {
  id: string // uuid v4
  sender: UserBase
  lastMessage?: ChatMessage
  seen?: boolean
}

