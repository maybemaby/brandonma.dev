---
title: Creating Encrypted Sessions in SvelteKit with iron-session
publishedAt: 2024-10-18
previewText: Sessions typically store some user-specific data using cookies, but you have to be careful about storing sensitive data in cookies. 
draft: true
---

# Creating Encrypted Sessions in SvelteKit with iron-session

## Why Encrypted Sessions and what is iron-session?

Sessions typically store some user-specific data using cookies, but you have to be careful about storing sensitive data
in cookies. Typically you end up storing a session ID in the cookie and then storing the actual session data in a database.

With encrypted and signed sessions, you can store data directly in the cookie while preventing tampering and reading. [iron-session](https://github.com/vvo/iron-session) is a popular package primarily used with Next.js to accomplish this. 

> **Description from the iron-session GitHub repository:**
> 
> iron-session is a secure, stateless, and cookie-based session library for JavaScript.
>
> The session data is stored in signed and encrypted cookies which are decoded by your server code in a stateless fashion (= no network involved). 

What might surprise you is that iron-session can be used with SvelteKit and many other frameworks. The main function used in iron-session to create and read sessions is `getIronSession`. One of the function signatures accepts a web standard `Request` and `Response`.

```typescript
type RequestType = IncomingMessage | Request;
type ResponseType = Response | ServerResponse;

async function getIronSession<T extends object>(
    req: RequestType,
    res: ResponseType,
    sessionOptions: SessionOptions,
  ): Promise<IronSession<T>>;
```

Thanks to the Javascript ecosystem converging on web standards, this can be used with SvelteKit!

## Getting Started

Use an existing Sveltekit project or create a new one following the official SvelteKit documentation.

Install iron-session:

```bash
npm install iron-session
```