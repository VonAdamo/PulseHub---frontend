# PulseHub Frontend Backend Contract

Detta dokument beskriver hur `pulsehub-frontend` ska prata med backendens BFF.

Frontend ska endast anropa BFF:en. Frontend ska inte anropa `auth-service`, `user-service` eller `message-service` direkt.

## Backend Base URL

Lokalt kör BFF på:

```text
http://localhost:8080
```

Alla endpoint-exempel nedan utgår från denna base URL.

## Frontend Origin / CORS

Lokalt antas frontend köras på exempelvis:

```text
http://localhost:5173
```

Backend ska tillåta CORS från frontendens lokala origin.

Frontend ska kunna skicka följande headers:

```http
Content-Type: application/json
Authorization: Bearer <token>
```

## Authentication

Backend använder JWT.

JWT skickas i Authorization-headern:

```http
Authorization: Bearer <token>
```

Öppna endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`

Endpoints som kräver JWT:

- `GET /api/me`
- `POST /api/messages`
- `GET /api/messages?channel=general`

Om backend returnerar `401 Unauthorized` ska frontend behandla användaren som utloggad. Frontend ska då ta bort sparad token och återgå till ett utloggat state.

## Frontend State

Initialt sparar frontend JWT-token i `localStorage`.

Rekommenderad `localStorage`-nyckel:

```text
pulsehub_token
```

Vid anrop till skyddade endpoints ska frontend läsa token från `localStorage` och skicka den i Authorization-headern:

```http
Authorization: Bearer <token>
```

Vid logout ska frontend ta bort token från `localStorage`.

## Date Format

Alla datumfält från backend ska skickas som ISO-8601-strängar.

Exempel:

```json
{
  "createdAt": "2026-06-10T14:30:00Z",
  "updatedAt": "2026-06-10T14:30:00Z"
}
```

Frontend ska kunna tolka dessa med:

```ts
new Date(createdAt)
```

## Error Responses

Backend bör returnera fel i detta format:

```json
{
  "error": "Invalid credentials",
  "status": 401
}
```

Exempel på vanliga fel:

```json
{
  "error": "Username already exists",
  "status": 409
}
```

```json
{
  "error": "Missing or invalid token",
  "status": 401
}
```

```json
{
  "error": "Channel is required",
  "status": 400
}
```

```json
{
  "error": "Content is required",
  "status": 400
}
```

Frontend ska inte vara beroende av exakt feltext för logik, förutom statuskoden. Feltexten kan visas för användaren eller användas för debugging.

## Endpoints

### Register User

Skapar en ny användare.

```http
POST /api/auth/register
```

Kräver JWT: Nej.

#### Request Headers

```http
Content-Type: application/json
```

#### Request Body

```json
{
  "username": "adam",
  "displayName": "Adam",
  "password": "password123"
}
```

#### Validation

- `username` krävs.
- `displayName` krävs.
- `password` krävs.
- `username` måste vara unikt.
- `password` bör vara minst 6 tecken.

#### Success Response

Status:

```text
201 Created
```

Body:

```json
{
  "userId": "uuid",
  "username": "adam",
  "displayName": "Adam"
}
```

#### Error Responses

`400 Bad Request`

Om request body saknar obligatoriska fält eller har ogiltiga värden.

`409 Conflict`

Om användarnamnet redan finns.

#### curl

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"adam","displayName":"Adam","password":"password123"}'
```

### Login User

Loggar in en användare och returnerar en JWT-token.

```http
POST /api/auth/login
```

Kräver JWT: Nej.

#### Request Headers

```http
Content-Type: application/json
```

#### Request Body

```json
{
  "username": "adam",
  "password": "password123"
}
```

#### Success Response

Status:

```text
200 OK
```

Body:

```json
{
  "token": "jwt-token",
  "userId": "uuid",
  "username": "adam",
  "displayName": "Adam"
}
```

Frontend ska spara token i `localStorage`.

#### Error Responses

`400 Bad Request`

Om request body saknar `username` eller `password`.

`401 Unauthorized`

Om användarnamn eller lösenord är fel.

#### curl

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"adam","password":"password123"}'
```

### Get Current User

Hämtar inloggad användare baserat på JWT-token.

```http
GET /api/me
```

Kräver JWT: Ja.

#### Request Headers

```http
Authorization: Bearer <token>
```

#### Success Response

Status:

```text
200 OK
```

Body:

```json
{
  "userId": "uuid",
  "username": "adam",
  "displayName": "Adam"
}
```

#### Error Responses

`401 Unauthorized`

Om token saknas, är ogiltig eller har gått ut.

Frontend ska då ta bort sparad token och visa utloggat state.

#### curl

```bash
curl http://localhost:8080/api/me \
  -H "Authorization: Bearer <token>"
```

### Create Message

Skapar ett nytt meddelande i en kanal.

```http
POST /api/messages
```

Kräver JWT: Ja.

#### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "channel": "general",
  "content": "hej bot"
}
```

#### Validation

- `channel` krävs.
- `content` krävs.
- `content` får inte vara tom eller bara whitespace.
- `channel` bör vara en enkel sträng, till exempel `general`.

#### Success Response

Status:

```text
201 Created
```

Body:

```json
{
  "id": "uuid",
  "senderId": "uuid",
  "username": "adam",
  "displayName": "Adam",
  "channel": "general",
  "content": "hej bot",
  "createdAt": "2026-06-10T14:30:00Z",
  "updatedAt": "2026-06-10T14:30:00Z"
}
```

#### Error Responses

`400 Bad Request`

Om `channel` eller `content` saknas eller är ogiltigt.

`401 Unauthorized`

Om token saknas, är ogiltig eller har gått ut.

#### curl

```bash
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"channel":"general","content":"hej bot"}'
```

### List Messages

Hämtar meddelanden för en kanal.

```http
GET /api/messages?channel=general
```

Kräver JWT: Ja.

#### Request Headers

```http
Authorization: Bearer <token>
```

#### Query Parameters

| Parameter | Required | Example | Description |
| --- | --- | --- | --- |
| `channel` | Ja | `general` | Kanalen vars meddelanden ska hämtas. |

#### Sorting

Meddelanden returneras äldst först baserat på `createdAt`.

Det betyder att nyare meddelanden ligger längre ner i listan.

#### Success Response

Status:

```text
200 OK
```

Body:

```json
[
  {
    "id": "uuid",
    "senderId": "uuid",
    "username": "adam",
    "displayName": "Adam",
    "channel": "general",
    "content": "hej bot",
    "createdAt": "2026-06-10T14:30:00Z",
    "updatedAt": "2026-06-10T14:30:00Z"
  }
]
```

Om kanalen inte har några meddelanden returneras en tom lista:

```json
[]
```

#### Error Responses

`400 Bad Request`

Om `channel` saknas eller är ogiltig.

`401 Unauthorized`

Om token saknas, är ogiltig eller har gått ut.

#### curl

```bash
curl "http://localhost:8080/api/messages?channel=general" \
  -H "Authorization: Bearer <token>"
```

## Recommended Frontend Flow

### App Startup

När frontend startar:

1. Läs token från `localStorage`.
2. Om token saknas, visa login/register.
3. Om token finns, anropa `GET /api/me`.
4. Om `/api/me` returnerar `200`, sätt användaren som inloggad.
5. Om `/api/me` returnerar `401`, ta bort token och visa login/register.

### Register Flow

1. Användaren fyller i `username`, `displayName` och `password`.
2. Frontend anropar `POST /api/auth/register`.
3. Vid lyckad registrering kan frontend antingen skicka användaren till login eller automatiskt anropa login direkt efter registrering.

Backend returnerar inte token från register i detta kontrakt.

### Login Flow

1. Användaren fyller i `username` och `password`.
2. Frontend anropar `POST /api/auth/login`.
3. Vid `200 OK`, spara token i `localStorage`.
4. Sätt användaren som inloggad i frontend state.
5. Hämta meddelanden för standardkanalen, exempelvis `general`.

### Logout Flow

1. Ta bort token från `localStorage`.
2. Rensa användare från frontend state.
3. Rensa eventuell skyddad data från frontend state.
4. Visa login/register.

### Messages Flow

Standardkanal:

```text
general
```

När användaren är inloggad:

1. Frontend anropar `GET /api/messages?channel=general`.
2. Backend returnerar en lista med meddelanden.
3. Frontend visar meddelanden i ordning från äldst till nyast.
4. När användaren skickar ett meddelande anropar frontend `POST /api/messages`.
5. Vid lyckad response kan frontend lägga till det returnerade meddelandet direkt i listan.

### Handling 401 Globally

Frontend bör hantera `401 Unauthorized` globalt för alla skyddade endpoints.

Vid `401`:

1. Ta bort token från `localStorage`.
2. Rensa inloggad användare från frontend state.
3. Skicka användaren till login-vyn.

## API Summary

| Method | Endpoint | JWT Required | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Nej | Skapar användare. |
| `POST` | `/api/auth/login` | Nej | Loggar in och returnerar JWT. |
| `GET` | `/api/me` | Ja | Hämtar inloggad användare. |
| `POST` | `/api/messages` | Ja | Skapar meddelande. |
| `GET` | `/api/messages?channel=general` | Ja | Hämtar meddelanden i kanal. |

## Contract Notes

- `displayName` finns även i `login`, `/api/me` och messages.
- Statuskoder är tydliga.
- Felrespons är definierad.
- CORS nämns.
- Datumformat är bestämt.
- Frontend-flöden är beskrivna så den som bygger frontend slipper gissa.
