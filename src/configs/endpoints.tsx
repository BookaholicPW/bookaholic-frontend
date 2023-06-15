import {
  ApiResponseBodyBase,
  Book,
  BookCharacter,
  BookGenre,
  Chat,
  ChatMessage,
  UserBase,
  UserMatching,
  UserToken,
} from './schemas'

/**
 * @description
 * This file contains all the endpoints of the API.
 */

export namespace AccountRegister {
  /**
   * @description
   * This endpoint is used to register a new user.
   */

  export const path = '/account/register'
  export const method = 'POST'
  export type RequestBody = {
    email: string
    password: string
  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: UserBase
  }
}

export namespace AccountLogin {
  /**
   * @description
   * This endpoint is used to login a user.
   * It returns user information with a JWT token that can be used to authenticate the user.
   */

  export const path = '/account/login'
  export const method = 'POST'
  export type RequestBody = {
    email: string
    password: string
  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: UserToken
  }
}

export namespace AccountUpdate {
  /**
   * @description
   * This endpoint is used to update current user's account information.
   * If any of the fields is not provided, it will not be updated.
   * if any fields set to null, it will be removed (empty).
   */
  export const path = '/account'
  export const method = 'PUT'
  export type RequestBody = {
    username?: string
    bio?: string
    avatar?: string
    favoriteBooks?: Book[]
    favoriteAuthors?: string[]
    favoriteGenres?: string[]
  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: UserBase
  }
}

export namespace AccountGet {
  /**
   * @description
   * This endpoint is used to get current user's account information.
   */
  export const path = '/account'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: UserBase
  }
}

export namespace AccountLogout {
  /**
   * @description
   * This endpoint is used to logout current user.
   * It will invalidate the JWT token.
   */
  export const path = '/account/logout'
  export const method = 'POST'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: undefined
  }
}

export namespace AccountResetPassword {
  /**
   * @description
   * This endpoint is used to reset user's password.
   * It requires the user to provide the email address.
   * Backend will send an email to the email, with a link to confirm reset password.
   * If user click the link, generate a new password and send it to the email.
   * The link will be valid for 1 hour.
   * Without authentication.
   */
  export const path = '/account/reset-password'
  export const method = 'POST'
  export type RequestBody = {
    email: string
  }
  export type ResponseBody = ApiResponseBodyBase
}

export namespace AccountChangePassword {
  /**
   * @description
   * This endpoint is used to change user's password.
   * It requires the user to be authenticated.
   * It requires the user to provide the current password.
   */
  export const path = '/account/change-password'
  export const method = 'POST'
  export type RequestBody = {
    currentPassword: string
    newPassword: string
  }
  export type ResponseBody = ApiResponseBodyBase
}

export namespace AccountUpdateAvatar {

  export const path = '/account/avatar'
  export const method = 'POST'
  export type RequestBody = {

  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: UserBase
  }
}

export namespace ListBooks {
  /**
   * @description
   * This endpoint is used to get a list of books.
   */
  export const path = '/books'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: Book[]
  }
}

export namespace GetBook {
  /**
   * @description
   * This endpoint is used to get a book by its id.
   */
  export const path = '/books/:id'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: Book
  }
}

export namespace FindBooks {
  /**
   * @description
   * This endpoint is used to find books by their title.
   */
  export const path = '/books/find'
  export const method = 'POST'
  export type RequestBody = {
    term: string
  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: Book[]
  }
}

export namespace ListBookGenres {
  /**
   * @description
   * This endpoint is used to get a list of book genres.
   * Without return books that belong to each genre.
   */
  export const path = '/book-genres'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: BookGenre[]
  }
}

export namespace GetBookGenre {
  /**
   * @description
   * This endpoint is used to get a book genre by its id.
   * It will also return a list of books that belong to this genre.
   */
  export const path = '/book-genres/:id'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: BookGenre
  }
}

export namespace ListBookCharacters {
  /**
   * @description
   * This endpoint is used to get a list of book characters.
   */
  export const path = '/book-characters'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: BookCharacter[]
  }
}

export namespace GetBookCharacter {
  /**
   * @description
   * This endpoint is used to get a book character by its id.
   * It will also return a list of books that this character belongs to.
   */
  export const path = '/book-characters/:id'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: BookCharacter
  }
}

export namespace ListBookAuthor {
  /**
   * @description
   * This endpoint is used to get a list of book authors.
   */
  export const path = '/book-authors'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: string[]
  }
}

export namespace GetBookAuthor {
  /**
   * @description
   * This endpoint is used to get a book author by its id.
   * It will also return a list of books that this author wrote.
   */
  export const path = '/book-authors/:id'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: string
  }
}

// --------- Matching APIs ---------
export namespace GetSuggestedMatching {
  /**
   * @description
   * This endpoint is used to get a suggested profile for the current user.
   * It will return a user that has the most matching with the current user.
   * If there is no matching user, it will return a random user.
   */
  export const path = '/matching/suggested-profile'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: UserMatching
  }
}

export namespace PostSuggestedProfileAnswer {
  /**
   * @description
   * This endpoint is used to post an answer for the suggested profile.
   * The answer can be either like or dislike.
   * If the answer is like, waiting for the other user to like back.
   * If the answer is dislike, the other user will not be suggested again.
   * If the other user likes back, they will be matched, and the chat will be created.
   */
  export const path = '/matching/suggested-profile/answer'
  export const method = 'POST'
  export type RequestBody = {
    id: string // the id of the suggested matching
    answer: 'like' | 'dislike'
  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: {
      matched: boolean // true if the other user likes back and they are matched
    }
  }
}

// --------- Chat APIs ---------
export namespace GetChatList {
  /**
   * @description
   * This endpoint is used to get a list of chats that the current user is in.
   * It will return a list of chats, with the last message of each chat.
   * The list is sorted by the last message's created date.
   */
  export const path = '/chats'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: Chat[]
  }
}

export namespace GetChat {
  /**
   * @description
   * This endpoint is used to get a chat by its id. 
   * It will return a chat with all messages.
   * The messages are sorted by the created date.
   * The chat will be marked as read.
   */
  export const path = '/chats/:id'
  export const method = 'GET'
  export type RequestBody = undefined
  export type ResponseBody = ApiResponseBodyBase & {
    data?: ChatMessage[]
  }
}

export namespace PostChatMessage {
  /**
   * @description
   * This endpoint is used to post a message to a chat.
   * It will return the posted message.
   */
  export const path = '/chats/:id/messages'
  export const method = 'POST'
  export type RequestBody = {
    content: string, // if the message type is img, this will be base64 string
    type: 'text' | 'image'
  }
  export type ResponseBody = ApiResponseBodyBase & {
    data?: ChatMessage
  }
}
