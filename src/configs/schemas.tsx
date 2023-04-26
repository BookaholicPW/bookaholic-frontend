// Description: This file contains all the schemas used in the app
// Path: src/configs/schemas.tsx

export const appConfig: {
    appName: string;
    siteName: string;
    siteUrl: string;
    siteDescription: string;
    siteKeywords: string;
    apiRoot: string;
} = {
    appName: 'bookaholic',
    siteName: 'Bookaholic',
    siteUrl: 'https://bookaholic.pl',
    siteDescription: 'Bookaholic - connect all book lovers',
    siteKeywords: 'bookaholic, book, books, book lovers, book lovers community, bookaholic community, bookaholic.pl, bookaholic.pl community',
    apiRoot: 'https://api.bookaholic.pl',
}

export type ApiRequestBodyBase = any;

export type ApiResponseBodyBase = {
    status: 'success' | 'error';
    message: string;
    data: any;
}

export type ApiEndpoint = {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: {
        [key: string]: string;
    };
    requestBody?: any;
    responseBody?: any;
}

export type Author = {
    id: string; // uuid v4
    name: string;
    characters?: BookCharacter[];
    avatar?: string;
    born?: number;
    died?: number;
    books?: Book[];
    nationality?: string;
    originalLanguage?: string;
}


export type Book = {
    id: string; // uuid v4
    title: string;
    description?: string;
    authors?: Author[];
    genres?: BookGenre[];
    cover?: string;
    pages?: number;
    published?: number;
}

export type BookGenre = {
    id: string; // uuid v4
    name: string;
    books?: Book[];
}

export type BookCharacter = {
    id: string; // uuid v4
    name: string;
    books?: Book[];
}

export type UserBase = {
    id: string; // uuid v4
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    favoriteBooks?: Book[];
    favoriteAuthors?: Author[];
    favoriteGenres?: BookGenre[];
    accessToken?: string;
}

export type User = UserBase & {
    password: string;
    createdAt: number;
    updatedAt: number;
}

export type UserToken = {
    accessToken: string;
    refreshToken: string;
}