# Node.js-Based Game "Alias" with Chat and Word Checking

## Table of Contents

1. [Description](#description)
2. [System requirements](#system-requirements)
3. [Base URL](#base-url)
4. [API Documentation](#api-documentation)

   4.1 [User Management](#user-management)

   - User data model.
   - Endpoint **/api/v1/auth/register**
   - Endpoint **/api/v1/auth/login**
   - Endpoint **/api/v1/auth/refresh**
   - Endpoint **/api/v1/auth/logout**
   - Endpoint **/api/v1/users**
   - Endpoint **/api/v1/users/{userId}**
   - Endpoint **/api/v1/leaderboards**

   4.2 [Room Management](#room-management)

   - Room data model
   - Endpoint **POST /api/v1/room**
   - Endpoint **PATCH /api/v1/room/:roomId**
   - Endpoint **GET /api/v1/rooms**
   - Endpoint **GET /api/v1/rooms/:roomId**
   - Endpoint **DELETE /api/v1/rooms/:roomId**

   4.3 [Team Management](#team-management)

   - Team data model.
   - Endpoint **/api/v1/rooms/{roomId}/teams**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/players**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/describer**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/leader**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/chat**
   
   4.4 [Chat Management](#chat-management)

   - Chat data model.
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/chat**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}**
   - Endpoint **/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}**

   4.5 [Message Management](#message-management)

   - Message data model.
   - Endpoint
     **/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}/user/{userId}/message**
   - Endpoint
     **/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}/user/{userId}/messages**

   4.6 [Word Management](#word-management)
   - Word data model
   - Endpoint **POST /api/v1/word**
   - Endpoint **GET /api/v1/words**
   - Endpoint **GET /api/v1/words/:wordId**
   - Endpoint **PATCH /api/v1/words/:wordId**
   - Endpoint **DELETE /api/v1/words/:wordId**

5. [Security](#security)
6. [Testing](#testing)
6. [Deployment](#deployment)
7. [Future Enhancements](#future-enhancements)

## Description

Alias is a word-guessing game where players form teams. Each team takes turns
where one member describes a word and others guess it. The game includes a chat
for players to communicate and a system to check for similar words.

### Objective

Teams try to guess as many words as possible from their teammates' descriptions.

### Turns

Each turn is timed. Describers cannot use the word or its derivatives.

### Scoring

Points are awarded for each correct guess. Similar words are checked for
validation.

### End Game

The game concludes after a predetermined number of rounds, with the
highest-scoring team winning.

## System Requirements

- **Programming language**: JavaScript, TypeScript
- **Backend**: Node.js framework - Nest.js
- **Frontend framework**: React.js
- **Database**: MongoDB
- **Containerization**: Docker

## Base URL

The base URL for accessing the Game "Alias" with Chat and Word Checking API is:

`http://localhost:8080/api/v1/`

All endpoints for the Game "Alias" API can be accessed through this base URL.

**Example Usage** To make a request to the API, prepend the base URL to the
endpoint path. For instance, to access the registration endpoint:

`GET http://localhost:8080/api/v1/auth/register`

## API Documentation

### User Management

#### 1. User data model

Information about users.

| Column Name    | Data Type | Description                                  |
| :------------- | :-------- | :------------------------------------------- |
| userId         | ObjectId  | Unique identifier for each user              |
| username       | string    | Username chosen by the user (must be unique) |
| hashedPassword | string    | Hashed password for user authentication      |
| score          | int       | Total points scored by the user in the game  |
| played         | int       | Number of games the user has participated in |
| wins           | int       | Number of games the user has won             |

#### 2. Register a new user

Endpoint

- URL Path: **_/api/v1/auth/register_**
- Description: This endpoint registers a new user. It accepts user details in
  the request body and returns a response indicating the result of the
  registration process.
- Authentication: No authentication required for this endpoint.

**Request Body**

The request body must be in JSON format and include the following fields:

- username (string, required): The username of the new user. Must be unique and
  between 3-20 characters;
- password (string, required): The password for the new user. It should meet the
  following security requirements: a minimum length of 8 characters, and must
  include at least one number, one uppercase letter, one lowercase letter, and
  at least one symbol (e.g., !@#$%^&\*).

**Example Request**

Description: A `POST` request to the user registration endpoint. It includes a
JSON payload in the request body with the user's name, and password for
registration.

```

curl -X POST http://localhost:8080/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "Alex",
  "password": "SecurePass!123"
}'

```

**Example Responses**

Status code: **201 Created**

Description: The user has been successfully registered. The response includes a
success message and the data with the userId of the newly created user.

```
{
    "message": "User registered successfully.",
    "data": {
        "userId": 1
    }
}
```

Status code: **400 Bad Request**

Description: The request was invalid because one or more of the provided fields
(username, or password) did not meet the required format or were missing.

```
{
    "message": "All fields are required and must be in a valid format."
}
```

Status code: **409 Conflict**

Description: This response indicates that the request could not be processed
because the username is already in use.

```
{
    "message": "Username already in use."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
registration process.

```
{
    "message": "An unexpected error occurred during registration."
}
```

#### 3. Logs a user into the system

Endpoint

- URL Path: **_/api/v1/auth/login_**
- Description: This endpoint logs a user into the system by validating their
  username and password. Upon successful authentication, the user receives both
  an access token and a refresh token. The access token is used for subsequent
  authenticated requests, while the refresh token is used to obtain a new access
  token when the original expires.
- Authentication: No authentication required for this endpoint.

**Request Body**

The request body should be in JSON format and include the following fields:

- username: The user's username;
- password: The user's password.

**Example Request**

Description: A `POST` request to the login endpoint for user authentication. It
includes a JSON payload in the request body with the user's username and
password.

```

curl -X POST http://localhost:8080/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "Alex",
  "password": "SecurePass!123"
}'

```

**Example Responses**

Status code: **200 OK**

Description: This status indicates that the login request was successful. The
server responds with a JSON object containing an access token, a refresh token,
and a success message.

```
{
    "message": "User logged successfully.",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiO5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "refresh_token": "d1Gh9zG8eXpz1I2kA6vR"
    }
}
```

Status code: **400 Bad Request**

Description: The provided username or password is missing.

```
{
    "message": "Username and password are required."
}
```

Status code: **401 Unauthorized**

Description: The login request failed due to incorrect username.

```
{
    "message": "User does not exist."
}
```

Description: The login request failed due to incorrect password.

```
{
    "message": "Incorrect username or password."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected condition that prevented it
from processing the request. This issue may occur during token creation or other
parts of the login process, preventing the user from receiving a valid access or
refresh token.

```
{
    "message": "An unexpected error occurred during login."
}
```

#### 4. Refresh user's access token

Endpoint

- URL Path: **_/api/v1/auth/refresh_**
- Description: This endpoint allows a user to obtain a new access token by
  providing a valid refresh token. When the user's access token expires, they
  can use their refresh token to request a new access token without needing to
  log in again. This ensures continued access to the system without frequent
  re-authentication.
- Authentication: This endpoint does not require an access token but does
  require a valid refresh token, which must be provided in the request body.

**Request Body**

The request body should include the refresh token in JSON format.

- refresh_token: The valid refresh token that was previously issued to the user.
  This token will be used to generate a new access token.

**Example Request**

Description: A `POST` request to refresh the user's access token using the
refresh token. The new access token is issued if the refresh token is valid.

```

curl -X POST http://localhost:8080/api/v1/auth/refresh \
-H "Content-Type: application/json" \
-d '{
  "refresh_token": "d1Gh9zG8eXpz1I2kA6vR"
}'

```

**Example Responses**

Status code: **200 OK**

Description: This status indicates that the refresh request was successful. A
new access token is returned.

```
{
    "message": "Access token refreshed successfully.",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiO5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQss"
    }
}
```

Status code: **400 Bad Request**

Description: The refresh token is missing or improperly formatted.

```
{
    "message": "Refresh token is required."
}
```

Status code: **401 Unauthorized**

Description: The provided refresh token is invalid or expired. The user must log
in again to obtain a new token.

```
{
    "message": "Invalid or expired refresh token. Please log in again."
}
```

Status code: **500 Internal Server Error**

Description: An unexpected error occurred on the server, possibly during the
token verification or creation process.

```
{
    "message": "An unexpected error occurred while refreshing the token."
}
```

#### 5. Logs a user out of the system

Endpoint

- URL Path: **_/api/v1/auth/logout_**
- Description: This endpoint allows users to log out of the application by
  invalidating the refresh token, and optionally clearing any session data.
  After logging out, the user must authenticate again to access protected
  resources.
- Authentication: Requires the user to provide a valid access token in the
  request headers to authorize the logout operation.

**Request Body**

This endpoint does not require a request body. Logout actions are handled based
on the authenticated user's token.

**Example Request**

Description: A `POST` request to log out the authenticated user. It requires the
user to pass their access token in the request header.

```

curl -X POST http://localhost:8080/api/v1/auth/login \
-H "Authorization: Bearer access_token" \

```

**Example Responses**

Status code: **200 OK**

Description: The logout request was successful. The refresh token is
invalidated, and the user is logged out from the system. The user should delete
any stored tokens.

```
{
    "message": "User logged out successfully."
}
```

Status code: **401 Unauthorized**

Description: The request failed because the access token is missing, invalid, or
expired.

```
{
    "message": "Invalid or missing access token."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
logout request. This may happen due to issues during token invalidation or other
server-side problems.

```
{
    "message": "An unexpected error occurred during logout."
}
```

#### 6. Retrieves a list of all users

Endpoint

- URL Path: **_/api/v1/users_**
- Description: This endpoint retrieves a list of all registered users in the
  system. The response includes details for each user.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token.

**Example Request**

Description: A `GET` request to retrieve a list of all users.

```

curl -X GET http://localhost:8080/api/v1/users \
-H "Authorization: Bearer access_token" \

```

**Example Responses**

Status code: **200 OK**

Description: This status indicates that the request was successful, and the
response contains an array of user objects, or an empty array if no users are
found.

```
[
    {
        "userId": 1,
        "username": "Alex",
        "score": 1500,
        "played": 20,
        "wins": 10
    },
    {
        "userId": 2,
        "username": "JaneDoe",
        "score": 1800,
        "played": 25,
        "wins": 15
    }
]
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required admin privileges to perform
this operation.

```
{
    "message": "Access denied. Admin privileges required."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the user list."
}
```

#### 7. Retrieve a specific user by ID

Endpoint

- URL Path: **_/api/v1/users/{userId}_**
- Description: This endpoint retrieves the details of a specific user based on
  the provided user ID. It returns user information such as username, score,
  total games played, and wins.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token.

**Request Parameter**

The request should include the following path parameter:

- userId: The unique identifier of the user to retrieve.

**Example Request**

Description: A `GET` request to the user details endpoint, including the user's
ID in the URL.

```

curl -X GET http://localhost:8080/api/v1/users/2 \
-H "Authorization: Bearer access_token" \

```

**Example Responses**

Status code: **200 OK**

Description: This status indicates that the request was successful, and the
server returns the requested user details.

```
{
      "userId": 2,
      "username": "JaneDoe",
      "score": 1800,
      "played": 25,
      "wins": 15
}
```

Status code: **400 Bad Request**

Description: The valid user ID must be provided to proceed.

```
{
    "message": "Invalid ObjectId"
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **404 Not Found**

Description: This status indicates that the specified user ID does not exist in
the system.

```
{
    "message": "User not found."
}
```

Status Code: **500 Internal Server Error**

Description: An unexpected error occurred on the server while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the user."
}
```

#### 8. Delete a specific user

Endpoint

- URL Path: **_/api/v1/users/{userId}_**
- Description: This endpoint allows a user to delete their own account. It
  supports both soft and hard deletes.
  - Soft Delete: Marks the user account as inactive by moving it to an archived
    collection.
  - Hard Delete: Permanently removes the user's account and all associated data.
    This action requires special authorization by an admin using a password
    validation step in the request body.
- Authentication: The request must include a valid access token for the
  authenticated user. Hard delete requests also require admin-level
  authorization.

**Request Parameter**

The request must include the following path parameter:

- userId: The unique identifier of the user requesting the deletion (the
  logged-in user's ID).

Optional query parameter:

- hardDelete: If set to true, attempts a hard delete (permanent removal of the
  user). Requires admin validation.

**Example Request**

Description: A `DELETE` request to soft delete the authenticated user’s account.
This request must include an authorization token for the user.

```

curl -X DELETE http://localhost:8080/api/v1/users/2 \
-H "Authorization: Bearer access_token" \

```

Description: A `DELETE` request to hard delete the authenticated user’s account.

```

curl -X DELETE http://localhost:8080/api/v1/userId/123?hardDelete=true \
-H "Authorization: Bearer access_token" \

```

**Example Responses**

Status Code: **200 OK**

Description: The user account was successfully deleted (soft or hard).

```
{
    "message": "User account permanently deleted."
}
```

```
{
    "message": "User account soft deleted and moved to archive successfully."
}
```

Status Code: **400 Bad Request**

Description: The provided user ID is invalid or missing.

```
{
    "message": "Invalid ObjectId."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required admin privileges to perform
this operation.

```
{
    "message": "Access denied. Admin privileges required."
}
```

Status Code: **404 Not Found**

Description: This status indicates that the specified user ID does not exist in
the system.

```
{
    "message": "User not found."
}
```

Status Code: **500 Internal Server Error**

Description: An unexpected error occurred on the server while processing the
request.

```
{
    "message": "An unexpected error occurred while deleting the user's account."
}
```

#### 9. Update a specific user

Endpoint

- URL Path: **_/api/v1/users/{userId}_**
- Description: This endpoint allows an authenticated user to update their
  account details. The fields that can be updated user-specific attributes such
  as username.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token.

**Request Parameter**

The request must include the following path parameter:

- userId: The unique identifier of the user whose information is being updated.

Request Body:

The request body must include at least one of the following fields to update:

- username: The new, unique username;
- password: The new password.

**Example Request**

Description: A `PUT` request to update the authenticated user's details. Only
the provided fields will be updated.

```
curl -X PUT http://localhost:8080/api/v1/users/2 \
-H "Authorization: Bearer access_token" \
-d `{
  "username": "Mike",
}`
```

**Example Responses**

Status Code: **200 OK**

Description: This status indicates that the request was successful, and the
user’s information was updated.

```
{
    "userId": 2,
    "username": "Mike",
    "score": 1500,
    "played": 20,
    "wins": 10
}
```

Status Code: **400 Bad Request**

Description: The request contains invalid or missing data, such as an improperly
formatted field.

```
{
    "message": "At least one field (username or password) is required for update."
}
```

Description: The provided user ID is invalid.

```
{
    "message": "Invalid ObjectId"
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the necessary permissions to update another
user's information.

```
{
    "message": "Access denied. You do not have permission to update this user."
}
```

Status Code: **404 Not Found**

Description: This status indicates that the specified user ID does not exist in
the system.

```
{
    "message": "User not found."
}
```

Status code: **409 Conflict**

Description: This response indicates that the request could not be processed
because the username is already in use.

```
{
    "message": "Username already in use."
}
```

Status Code: **500 Internal Server Error**

Description: An unexpected error occurred on the server while processing the
request.

```
{
    "message": "An unexpected error occurred while updating the user."
}
```

#### 10. Retrieve leaderboards

Endpoint

- URL Path: **_/api/v1/leaderboard_**
- Description: This endpoint retrieves the top players (10) based on their game
  statistics, including score. The response contains a ranked list of players,
  providing insights into the performance of the best players in the game.
- Authentication: This endpoint does not require authentication. Any user can
  access the leaderboards.

**Example Request**

Description: A `GET` request to retrieve the leaderboard.

```

curl -X GET http://localhost:8080/api/v1/leaderboard \

```

**Example Responses**

Status Code: **200 OK**

Description: This status indicates that the request was successful, and the
server returns an array of user objects (the leaderboards data), or an empty
array if no users are found.

```
[
    {
        "userId": 1,
        "username": "Alex",
        "score": 1800,
        "played": 28,
        "wins": 15
    },
    {
        "userId": 2,
        "username": "Jane",
        "score": 1500,
        "played": 20,
        "wins": 10
    }
]
```

Status Code: **500 Internal Server Error**

Description: An unexpected error occurred on the server while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the leaderboard."
}
```

### Room Management

#### 1. Room data model

Information about the room

| Column Name  | Data Type  | Description                                            |
| :----------- | :--------- | :----------------------------------------------------- |
| teamId       | ObjectId   | Unique identifier for each team                        |
| roomId       | ObjectId   | Unique identifier for the team's room                  |
| name         | string     | Username chosen by the user (must be unique)           |
| score        | int        | Total points scored by the team during this game       |
| players      | ObjectId[] | Array of ids of team's players                         |
| describer    | ObjectId   | Unique identifier of the player who describes the word |
| teamLeader   | ObjectId   | Unique identifier of the player who makes a word guess |
| selectedWord | ObjectId   | Unique identifier for the record of the word to guess  |
| tryedWords   | string[]   | Array of words tryed by players                        |

#### 2. GET `api/v1/v1/rooms/{roomId}/teams`

- Description: Method to get all the room's teams.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token

**Request Body**

The request body must be in JSON format and include the following fields:

- name: (string, required): The name of the new room. Must be unique
- teams: (array of teams, required): The array of created teams
- turnTime: (time, required): The time given for a turn

**Example Request**

Description: A `POST` request to the room creation endpoint. It includes a room
name, an array of created teams and turn time.

```
curl -X POST http://localhost:8080/api/v1/room \
-H "Content-Type: application/json" \
-d '{
  "name": "test_room",
  "teams": [ObjectId, ObjectId],
  "turnTime": 30
}
```

**Example Responses**

Status code: **201 Created**

Description: The room has been successfully created. The response includes a
success message and the data of the created room.

```
{
    "message": "Room created successfully.",
    "data": {
        "_id": "1245678",
        "name": "test_room",
        "joinedUsers": [],
        "teams": [ObjectId, ObjectId],
        "createdAt": "Date/time",
        "turnTime": 30
    }
}
```

Status code: **400 Bad Request**

Description: The request was invalid because one or more of the provided fields
did not meet the required format or were missing.

```
{
    "message": "All fields are required and must be in a valid format."
}
```

Status code: **409 Conflict**

Description: This response indicates that the request could not be processed
because the room name is already in use.

```
{
    "message": "The room with the specified name is already in use."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
creation process.

```
{
    "message": "An unexpected error occurred during creation."
}
```

#### 3. Join to the room

Endpoint

- URL Path: **_/api/v1/room/:roomId_**
- Description: This endpoint joins a user to specific room. It accepts userId in
  the request body and returns a response indicating the result of the joining
  process.
- Authentication: Authentication is required for this endpoint.

**Example Responses**

Status code: **200 OK**

Description: The user has been successfully joined. The response includes a
success message and the data of the room.

```
{
    "message": "User joined successfully.",
    "data": {
        "_id": "1245678",
        "name": "test_room",
        "joinedUsers": [ObjectId],
        "teams": [ObjectId, ObjectId],
        "createdAt": "Date/time",
        "turnTime": 30
    }
}
```

Status code: **400 Bad Request**

Description: The request was invalid because one or more of the provided fields
did not meet the required format or were missing.

```
{
    "message": "All fields are required and must be in a valid format."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **409 Conflict**

Description: This response indicates that the request could not be processed
because the user is already joined.

```
{
    "message": "The user with the specified id is already joined."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
joining process.

```
{
    "message": "An unexpected error occurred during registration."
}
```

#### 4. Get all rooms

Endpoint

- URL Path: **_/api/v1/rooms_**
- Description: This endpoint returns all created rooms.
- Authentication: Authentication is required for this endpoint.

**Example Request**

Description: A `GET` request to the getting all rooms endpoint.

```

curl -X GET http://localhost:8080/api/v1/rooms \
-H "Content-Type: application/json"

```

**Example Responses**

Status code: **200 OK**

Description: The array of rooms has been successfully returned. The response
includes a success message and the array of rooms.

```
{
    "message": "Rooms recieved successfully.",
    "data": [
    {
        "_id": "1245678",
        "name": "test_room",
        "joinedUsers": [ObjectId],
        "teams": [ObjectId, ObjectId],
        "createdAt": "Date/time",
        "turnTime": 30
    },
    {
        "_id": "12456789",
        "name": "test_room2",
        "joinedUsers": [ObjectId, ObjectId],
        "teams": [ObjectId, ObjectId],
        "createdAt": "Date/time",
        "turnTime": 25
    }]
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting all rooms process.

```
{
    "message": "An unexpected error occurred during getting all rooms."
}
```

#### 5. Get the room by id

Endpoint

- URL Path: **_/api/v1/rooms/:roomId_**
- Description: This endpoint returns room with the specified id.
- Authentication: Authentication is required for this endpoint.

**Example Request**

Description: A `GET` request to the getting room endpoint.

```

curl -X GET http://localhost:8080/api/v1/rooms/:id \
-H "Content-Type: application/json"

```

**Example Responses**

Status code: **200 OK**

Description: The room has been successfully returned. The response includes a
success message and the data of the room.

```
{
    "message": "Room recieved successfully.",
    "data": {
        "_id": "1245678",
        "name": "test_room",
        "joinedUsers": [ObjectId],
        "teams": [ObjectId, ObjectId],
        "createdAt": "Date/time",
        "turnTime": 30
    }
}
```

Status Code: **400 Bad Request**

Description: The provided ID is invalid or missing.

```
{
    "message": "ID is required."
}
```

```
{
    "message": "Invalid ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting the room process.

```
{
    "message": "An unexpected error occurred during getting the room."
}
```

#### 6. Delete the room

Endpoint

- URL Path: **_/api/v1/rooms/:roomId_**
- Description: This endpoint deletes room with the specified id.
- Authentication: Authentication is required for this endpoint.

**Example Request**

Description: A `DELETE` request to the deleting room endpoint.

```

curl -X DELETE http://localhost:8080/api/v1/rooms/:id \
-H "Content-Type: application/json"

```

**Example Responses**

Status code: **204 DELETED**

Description: The room has been successfully deleted. The response includes a
success message

```
{
    "message": "Room deleted successfully.",
}
```

Status Code: **400 Bad Request**

Description: The provided ID is invalid or missing.

```
{
    "message": "ID is required."
}
```

```
{
    "message": "Invalid ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **404 Not Found**

Description: This response indicates a missing room error.

```
{
    "message": "The room with specified id doesnt exist"
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting the room process.

```
{
    "message": "An unexpected error occurred during getting the room."
}
```

### Team Management

#### 1. Team data model

Information about users.

| Column Name  | Data Type  | Description                                            |
| :----------- | :--------- | :----------------------------------------------------- |
| teamId       | ObjectId   | Unique identifier for each team                        |
| roomId       | ObjectId   | Unique identifier for the team's room                  |
| name         | string     | Username chosen by the user (must be unique)           |
| score        | int        | Total points scored by the team during this game       |
| players      | ObjectId[] | Array of ids of team's players                         |
| describer    | ObjectId   | Unique identifier of the player who describes the word |
| teamLeader   | ObjectId   | Unique identifier of the player who makes a word guess |
| selectedWord | ObjectId   | Unique identifier for the record of the word to guess  |
| tryedWords   | string[]   | Array of words tryed by players                        |

#### 2. GET `api/v1/v1/rooms/{roomId}/teams`

- Description: Method to get all the room's teams.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token

**Request Body**

Empty

**Example Request**

Description: A `GET` request to retrieve a list of all teams in a specific room.

```sh
curl -X GET http://localhost:8080/api/v1/rooms/{roomId}/teams \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **200 OK**

Description: The request was successful, and the response contains an array of
team objects.

```
[
    {
        "teamId": "60d5f9a2b0f8b8e17a15f5f1",
        "roomId": "60d5f9a2b0f8b8e17a15f5f0",
        "name": "Alpha Team",
        "score": 250,
        "players": [
            "60d5f9a2b0f8b8e17a15f5f2",
            "60d5f9a2b0f8b8e17a15f5f3"
        ],
        "describer": "60d5f9a2b0f8b8e17a15f5f2",
        "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
        "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
        "tryedWords": ["apple", "banana", "orange"]
    },
    {
        "teamId": "60d5f9a2b0f8b8e17a15f5f5",
        "roomId": "60d5f9a2b0f8b8e17a15f5f0",
        "name": "Beta Team",
        "score": 180,
        "players": [
            "60d5f9a2b0f8b8e17a15f5f6",
            "60d5f9a2b0f8b8e17a15f5f7"
        ],
        "describer": "60d5f9a2b0f8b8e17a15f5f6",
        "teamLeader": "60d5f9a2b0f8b8e17a15f5f7",
        "selectedWord": "60d5f9a2b0f8b8e17a15f5f8",
        "tryedWords": ["grape", "peach"]
    }
]
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the teams
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room cannot be found.

```
{
    "message": "Room was not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the teams."
}
```

#### 3. POST `api/v1/rooms/{roomId}/teams`

Description: Method to create a new team in the specified room. Authentication:
This endpoint requires the user to be authenticated with a valid access token.

**Request Body:**

- name (string): The name of the team.
- players (array of strings): An array of player IDs to be added to the team.

**Example Request**

Description: A `POST` request to create a new team in a specific room.

```
curl -X POST http://localhost:8080/api/v1/rooms/{roomId}/teams \
-H "Authorization: Bearer access_token" \
-H "Content-Type: application/json" \
-d '{
    "name": "Gamma Team",
    "players": [
        "60d5f9a2b0f8b8e17a15f5f2",
        "60d5f9a2b0f8b8e17a15f5f3"
    ],
    "describer": "60d5f9a2b0f8b8e17a15f5f2",
    "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
    "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
    "tryedWords": []
}

```

**Example Responses**

Status code: **201 Created**

Description: The team was successfully created, and the response contains the
created team object.

```
{
    "teamId": "60d5f9a2b0f8b8e17a15f5f9",
    "roomId": "60d5f9a2b0f8b8e17a15f5f0",
    "name": "Gamma Team",
    "score": 0,
    "players": [
        "60d5f9a2b0f8b8e17a15f5f2",
        "60d5f9a2b0f8b8e17a15f5f3"
    ],
    "describer": "60d5f9a2b0f8b8e17a15f5f2",
    "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
    "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
    "tryedWords": []
}
```

Status Code: **400 Bad Request**

Description: The request body is missing required fields or contains invalid
data.

```
{
    "message": "Invalid input. Please provide all required fields."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to create a team in
this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room cannot be found.

```
{
    "message": "Room not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while creating the team."
}
```

#### 4. GET `api/v1/rooms/{roomId}/teams/{teamId}`

Description: Method to retrieve a specific team by its ID in the specified room.
Authentication: This endpoint requires the user to be authenticated with a valid
access token.

**Request body**

Empty

**Example Request**

Description: A `GET` request to retrieve details of a specific team in a
specific room.

```
curl -X GET http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId} \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **200 OK**

Description: The request was successful, and the response contains the details
of the requested team.

```
{
    "teamId": "60d5f9a2b0f8b8e17a15f5f1",
    "roomId": "60d5f9a2b0f8b8e17a15f5f0",
    "name": "Alpha Team",
    "score": 250,
    "players": [
        "60d5f9a2b0f8b8e17a15f5f2",
        "60d5f9a2b0f8b8e17a15f5f3"
    ],
    "describer": "60d5f9a2b0f8b8e17a15f5f2",
    "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
    "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
    "tryedWords": ["apple", "banana", "orange"]
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the team
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified team cannot be found in the specified room.

```
{
    "message": "Team not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the team."
}
```

#### 5. PUT `api/v1/rooms/{roomId}/teams/{teamId}`

Description: Method to update the details of a specific team in the specified
room. Authentication: This endpoint requires the user to be authenticated with a
valid access token.

**Request Body**

- name (string, optional): The updated name of the team.
- players (array of strings, optional): An updated array of player IDs to be
  added to the team.
- describer (string, optional): The updated ID of the user who will describe the
  selected word.
- teamLeader (string, optional): The updated ID of the user who will lead the
  team.
- selectedWord (string, optional): The updated ID of the word selected for the
  game.
- tryedWords (array of strings, optional): An updated array of words that have
  been tried by the team.

**Example Request**

Description: A `PUT` request to update a specific team in a specific room.

```
curl -X PUT http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId} \
-H "Authorization: Bearer access_token" \
-H "Content-Type: application/json" \
-d '{
    "name": "Alpha Team Updated",
    "players": [
        "60d5f9a2b0f8b8e17a15f5f2",
        "60d5f9a2b0f8b8e17a15f5f3"
    ],
    "describer": "60d5f9a2b0f8b8e17a15f5f2",
    "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
    "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
    "tryedWords": ["apple", "banana"]
}
```

**Example Responses**

Status code: **200 OK**

Description: The team was successfully updated, and the response contains the
updated team object.

```
{
    "teamId": "60d5f9a2b0f8b8e17a15f5f1",
    "roomId": "60d5f9a2b0f8b8e17a15f5f0",
    "name": "Alpha Team Updated",
    "score": 250,
    "players": [
        "60d5f9a2b0f8b8e17a15f5f2",
        "60d5f9a2b0f8b8e17a15f5f3"
    ],
    "describer": "60d5f9a2b0f8b8e17a15f5f2",
    "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
    "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
    "tryedWords": ["apple", "banana"]
}
```

Status Code: **400 Bad Request**

Description: The request body is missing required fields or contains invalid
data.

```
{
    "message": "Invalid input. Please provide valid fields."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to update the team
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified team or room cannot be found.

```
{
    "message": "Team or room not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while updating the team."
}
```

#### 6. DELETE `api/v1/rooms/{roomId}/teams/{teamId}`

Description: Method to delete a specific team in the specified room.
Authentication: This endpoint requires the user to be authenticated with a valid
access token.

**Request body:**

Empty

**Example Request**

Description: A `DELETE` request to remove a specific team from a specific room.

```
curl -X DELETE http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId} \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **204 No Content**

Description: The request was successful, and the team has been deleted. No
content is returned in the response.

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to delete the team
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified team or room cannot be found.

```
{
    "message": "Team or room not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while deleting the team."
}
```

#### 7. GET `api/v1/rooms/{roomId}/teams/{teamId}/players`

Description: Method to get all players in a specific team within a specified
room. Authentication: This endpoint requires the user to be authenticated with a
valid access token.

**Request Body**

Empty

**Example Request**

Description: A `GET` request to retrieve a list of all players in a specific
team of a specific room.

```
curl -X GET http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/players \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **200 OK**

Description: The request was successful, and the response contains an array of
player objects.

```
[
    {
        "userId": "60d5f9a2b0f8b8e17a15f5f3",
        "username": "Alex",
        "score": 1500,
        "played": 20,
        "wins": 10
    },
    {
        "userId": "60d5f9a2b0f8b8e17a15f5f3",
        "username": "Jack",
        "score": 3000,
        "played": 29,
        "wins": 15
    }
]
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the
players in this team.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room or team cannot be found, or there are no players
associated with the team.

```
{
    "message": "No players found for the specified team."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the players."
}
```

#### 8. POST `api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}`

Description: Method to add a player (specified by userId) to a team in a
particular room. Authentication: This endpoint requires the user to be
authenticated with a valid access token.

**Request Body**

Empty

**Example Request**

Description: A `POST` request to add a player (specified by userId) to a team in
a specific room.

```
curl -X POST http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/players/{userId} \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status Code: **201 Created**

Description: The player was successfully added to the specified team.

```
{
    "message": "Player added to the team successfully."
}
```

Status Code: **400 Bad Request**

Description: The request was malformed, possibly due to incorrect or missing
parameters.

```
{
    "message": "Invalid room, team, or user ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have sufficient permissions to add players to
this team.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room, team, or user cannot be found.

```
{
    "message": "Room, team, or user not found."
}
```

Status Code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while adding the player."
}
```

#### 9. DELETE `api/v1/rooms/{roomId}/teams/{teamId}/players/{userId}`

Description: Method to remove a player (specified by userId) from a team in a
particular room. Authentication: This endpoint requires the user to be
authenticated with a valid access token.

**Request Body**

Empty

**Example Request**

Description: A `DELETE` request to remove a player (specified by userId) from a
team in a specific room.

```
curl -X DELETE http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/players/{userId} \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status Code: **200 OK**

Description: The player was successfully removed from the specified team.

```
{
    "message": "Player removed from the team successfully."
}
```

Status Code: **400 Bad Request**

Description: The request was malformed, possibly due to incorrect or missing
parameters.

```
{
    "message": "Invalid room, team, or user ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have sufficient permissions to remove players
from this team.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room, team, or user cannot be found, or the player is
not part of the team.

```
{
    "message": "Player not found in the specified team."
}
```

Status Code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while removing the player."
}
```

#### 10. PUT `/api/v1/rooms/{roomId}/teams/{teamId}/describer`

Description: This method sets a specific player (from the list of players in the
team) as the describer of the team. The describer is responsible for explaining
or describing selected words during the game. Authentication: This endpoint
requires the user to be authenticated with a valid access token.

**Request Body**

userId (string): The ID of the player to be set as the describer. This player
must be part of the players array in the team.

**Example Request**

Description: A `PUT` request to set a player (specified by userId) as the
describer in a specific team within a room.

```
curl -X PUT http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/describer \
-H "Authorization: Bearer access_token" \
-H "Content-Type: application/json" \
-d '{"userId": "60d5f9a2b0f8b8e17a15f5f2"}'
```

**Example Responses**

Status Code: **200 OK**

Description: The describer was successfully updated.

```
{
    "message": "Player has been successfully set as the describer.",
    "team": {
        "teamId": "60d5f9a2b0f8b8e17a15f5f1",
        "roomId": "60d5f9a2b0f8b8e17a15f5f0",
        "name": "Alpha Team Updated",
        "score": 250,
        "players": [
            "60d5f9a2b0f8b8e17a15f5f2",
            "60d5f9a2b0f8b8e17a15f5f3"
        ],
        "describer": "60d5f9a2b0f8b8e17a15f5f2",
        "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
        "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
        "tryedWords": ["apple", "banana"]
    }
}
```

Status Code: **400 Bad Request**

Description: The request body is invalid, or the specified user is not part of
the team.

```
{
    "message": "Invalid request body or the player is not part of the team."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have sufficient permissions to update the
describer.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room or team cannot be found, or the player is not
part of the team.

```
{
    "message": "Team, room, or player not found."
}
```

Status Code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while setting the describer."
}
```

#### 11. PUT `/api/v1/rooms/{roomId}/teams/{teamId}/teamLeader`

Description: This method sets a specific player (from the list of players in the
team) as the team leader. The team leader may have additional responsibilities,
such as managing the team or making strategic decisions during the game.
Authentication: This endpoint requires the user to be authenticated with a valid
access token.

**Request Body**

userId (string): The ID of the player to be set as the team leader. This player
must be part of the players array in the team.

**Example Request**

Description: A `PUT` request to set a player (specified by userId) as the team
leader in a specific team within a room.

```
curl -X PUT http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/teamLeader \
-H "Authorization: Bearer access_token" \
-H "Content-Type: application/json" \
-d '{"userId": "60d5f9a2b0f8b8e17a15f5f3"}'
```

**Example Responses**

Status Code: **200 OK**

Description: The team leader was successfully updated.

```
{
    "message": "Player has been successfully set as the team leader.",
    "team": {
        "teamId": "60d5f9a2b0f8b8e17a15f5f1",
        "roomId": "60d5f9a2b0f8b8e17a15f5f0",
        "name": "Alpha Team Updated",
        "score": 250,
        "players": [
            "60d5f9a2b0f8b8e17a15f5f2",
            "60d5f9a2b0f8b8e17a15f5f3"
        ],
        "describer": "60d5f9a2b0f8b8e17a15f5f2",
        "teamLeader": "60d5f9a2b0f8b8e17a15f5f3",
        "selectedWord": "60d5f9a2b0f8b8e17a15f5f4",
        "tryedWords": ["apple", "banana"]
    }
}
```

Status Code: **400 Bad Request**

Description: The request body is invalid, or the specified user is not part of
the team.

```
{
    "message": "Invalid request body or the player is not part of the team."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have sufficient permissions to update the team
leader.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room or team cannot be found, or the player is not
part of the team.

```
{
    "message": "Team, room, or player not found."
}
```

Status Code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while setting the team leader."
}
```

### Word Management

#### 1. Word data model

Information about the word

| Column Name  | Data Type | Description                     |
| :----------- | :-------- | :------------------------------ |
| \_id         | ObjectId  | Unique identifier for each word |
| word         | string    | Word name                       |
| similarWords | string[]  | An array of similar words       |

#### 2. Create a new word

Endpoint

- URL Path: **_/api/v1/word_**
- Description: This endpoint creates a new word. It accepts word details in the
  request body and returns a response indicating the result of the creating
  process.
- Authentication: Authentication is required for this endpoint.

**Request Body**

The request body must be in JSON format and include the following fields:

- word: (string, required): The name of the new word. Must be unique
- similarWords: (array of strings): An array of similar words

**Example Request**

Description: A `POST` request to the word creation endpoint. It includes a word
name and an array of similar words.

```

curl -X POST http://localhost:8080/api/v1/word \
-H "Content-Type: application/json" \
-d '{
  "word": "apple",
  "similarWords": ["", ""]
}'

```

**Example Responses**

Status code: **201 Created**

Description: The word has been successfully created. The response includes a
success message and the data of the created word.

```
{
    "message": "Word created successfully.",
    "data": {
        "_id": "12456789",
        "word": "apple",
        "similarWords": ["", ""]
    }
}
```

Status code: **400 Bad Request**

Description: The request was invalid because one or more of the provided fields
did not meet the required format or were missing.

```
{
    "message": "All fields are required and must be in a valid format."
}
```

Status code: **409 Conflict**

Description: This response indicates that the request could not be processed
because the word is already in use.

```
{
    "message": "The word with the specified name is already in use."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
creation process.

```
{
    "message": "An unexpected error occurred during creation."
}
```

#### 3. Get all words

Endpoint

- URL Path: **_/api/v1/words_**
- Description: This endpoint returns all words.
- Authentication: Authentication is required for this endpoint.

**Example Request**

Description: A `GET` request to the getting all words endpoint.

```

curl -X GET http://localhost:8080/api/v1/words \
-H "Content-Type: application/json"

```

**Example Responses**

Status code: **200 OK**

Description: The array of words has been successfully returned. The response
includes a success message and the array of words.

```
{
    "message": "Words recieved successfully.",
    "data": [
    {
        "_id": "12456789",
        "word": "apple",
        "similarWords": ["", ""]
    },
    {
        "_id": "12458942",
        "word": "car",
        "similarWords": ["", ""]
    }]
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting all words process.

```
{
    "message": "An unexpected error occurred during getting all words."
}
```

#### 4. Get the word by id

Endpoint

- URL Path: **_/api/v1/words/:wordId_**
- Description: This endpoint returns word with the specified id.
- Authentication: Authentication is required for this endpoint.

**Example Request**

Description: A `GET` request to the getting word endpoint.

```

curl -X GET http://localhost:8080/api/v1/words/:id \
-H "Content-Type: application/json"

```

**Example Responses**

Status code: **200 OK**

Description: The word has been successfully returned. The response includes a
success message and the data of the word.

```
{
    "message": "Word recieved successfully.",
    "data": {
        "_id": "12456789",
        "word": "apple",
        "similarWords": ["", ""]
    }
}
```

Status Code: **400 Bad Request**

Description: The provided ID is invalid or missing.

```
{
    "message": "ID is required."
}
```

```
{
    "message": "Invalid ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting the word process.

```
{
    "message": "An unexpected error occurred during getting the word."
}
```

#### 5. Update the word

Endpoint

- URL Path: **_/api/v1/words/:wordId_**
- Description: This endpoint returns updated word with the specified id.
- Authentication: Authentication is required for this endpoint.

**Request Body**

The request body must be in JSON format and include the following fields:

- word: (string, required): The name of the updated word. Must be unique
- similarWords: (array of strings): An array of similar words

**Example Request**

Description: A `PATCH` request to the getting word endpoint.

```

curl -X PATCH http://localhost:8080/api/v1/words/:id \
-H "Content-Type: application/json"
-d '{
  "word": "tie",
  "similarWords": ["", ""]
}'

```

**Example Responses**

Status code: **200 OK**

Description: The word has been successfully updated. The response includes a
success message and the data of the updated word.

```
{
    "message": "Word recieved successfully.",
    "data": {
        "_id": "12456789",
        "word": "tie",
        "similarWords": ["", ""]
    }
}
```

Status Code: **400 Bad Request**

Description: The provided ID is invalid or missing.

```
{
    "message": "ID is required."
}
```

```
{
    "message": "Invalid ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting the word process.

```
{
    "message": "An unexpected error occurred during getting the word."
}
```

#### 6. Delete the word

Endpoint

- URL Path: **_/api/v1/words/:wordId_**
- Description: This endpoint deletes word with the specified id.
- Authentication: Authentication is required for this endpoint.

**Example Request**

Description: A `DELETE` request to the deleting word endpoint.

```

curl -X DELETE http://localhost:8080/api/v1/words/:id \
-H "Content-Type: application/json"

```

**Example Responses**

Status code: **204 DELETED**

Description: The word has been successfully deleted. The response includes a
success message

```
{
    "message": "Wordd deleted successfully.",
}
```

Status Code: **400 Bad Request**

Description: The provided ID is invalid or missing.

```
{
    "message": "ID is required."
}
```

```
{
    "message": "Invalid ID."
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status code: **404 Not Found**

Description: This response indicates a missing word error.

```
{
    "message": "The word with specified id doesnt exist"
}
```

Status code: **500 Internal Server Error**

Description: This response indicates an unexpected error occurred during the
getting the word process.

```
{
    "message": "An unexpected error occurred during getting the word."
}

```

### Chat Management

#### 1. Chat data model

The Chat collection stores chat-related information, including the list of
messages exchanged in the chat and the users who are allowed to write in this
chat.

| Column Name   | Data Type  | Description                                   |
| :------------ | :--------- | :-------------------------------------------- |
| \_id (chatId) | ObjectId   | Unique identifier for each chat (Primary Key) |
| messagesId    | ObjectId[] | Array of messages exchanged in the chat       |
| writeUsersId  | ObjectId[] | Users able to send messages                   |

#### 2. POST `/api/v1/rooms/{roomId}/teams/{teamId}/chat`

- Description: Method to create a new chat with the specified users.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token

**Request Body**

- writeUsersId (array of strings): An array of users IDs to be added to the
  chat.
- readUserId (string): id of the describer who can only read

**Example Request**

Description: A `POST` to create a new chat with the specified users.

```sh
curl -X GET http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/chat \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **201 Created**

Description: The request was successful, and the response contains message about
successfull creation and chatId.

```json
{
	"message": "Chat was successfully created",
	"chatId": "chatId1"
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the teams
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room cannot be found.

```
{
    "message": "Room was not found."
}
```

Status Code: **404 Not Found**

Description: The specified team cannot be found.

```
{
    "message": "Team was not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the teams."
}
```

#### 3. GET `/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}`

Description: Method to retrieve a specific chat with chat details by its ID in
the specified team and room. Authentication: This endpoint requires the user to
be authenticated with a valid access token.

**Request body**

Empty

**Example Request**

Description: A `GET` request to retrieve a specific chat with chat details by
its ID in the specified team and room.

```
curl -X GET http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId} \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **200 OK**

Description: The request was successful, and the response contains the details
of the requested chat.

```json
{
	"chatId": "chatId1",
	"writeUsersId": ["userId1", "userId2"],
	"messagesId": ["messageId1", "messageId2"]
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the team
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room cannot be found.

```
{
    "message": "Room not found."
}
```

Status Code: **404 Not Found**

Description: The specified team cannot be found in the specified room.

```
{
    "message": "Team not found."
}
```

Status Code: **404 Not Found**

Description: The specified chat cannot be found.

```
{
    "message": "Chat not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the team."
}
```

#### 4. DELETE `/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}`

Description: Method to delete a specific chat in the specified team and room.
Authentication: This endpoint requires the user to be authenticated with a valid
access token.

**Request body:**

Empty

**Example Request**

Description: A `DELETE` request to remove a specific chat in the specified team
and room.

```
curl -X DELETE http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId} \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **204 No Content**

Description: The request was successful, and the chat has been deleted. No
content is returned in the response.

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to delete the team
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified team or room cannot be found.

```
{
    "message": "Team or room not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while deleting the team."
}
```

### Message Management

#### 1. Message data model

The Message collection stores individual messages exchanged in the chat, each
associated with a user who sent the message and the timestamp when the message
was sent.

| Column Name      | Data Type | Description                                      |
| :--------------- | :-------- | :----------------------------------------------- |
| \_id (messageId) | ObjectId  | Unique identifier for each message (Primary Key) |
| userId           | ObjectId  | Reference to the user who sent the message       |
| text             | string    | The content of the message                       |
| timestamp        | Date      | Timestamp for when the message was sent          |

#### 2. POST `/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}/user/{userId}/message`

- Description: Method to send a message in the chat.
- Authentication: This endpoint requires the user to be authenticated with a
  valid access token

**Request Body**

- text (string): text that the user wrote.

**Example Request**

Description: A `POST` to send a message in the chat.

```
curl -X POST http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}/user/{userId}/message \
-H "Authorization: Bearer access_token" \
-H "Content-Type: application/json" \
-d '{
    "messageId": "messageId1"
}'
```

**Example Responses**

Status code: **201 Created**

Description: The request was successful, and the response contains message ID.

```json
{
	"messageId": "messageId1"
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **400 Bad Request**

Description: The request body is missing required fields or contains invalid
data.

```
{
    "message": "Invalid input. Please provide all required fields."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the teams
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room cannot be found.

```
{
    "message": "Room was not found."
}
```

Status Code: **404 Not Found**

Description: The specified team cannot be found.

```
{
    "message": "Team was not found."
}
```

Status Code: **404 Not Found**

Description: The specified chat cannot be found.

```
{
    "message": "Chat was not found."
}
```

Status Code: **404 Not Found**

Description: The specified user cannot be found.

```
{
    "message": "User was not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the teams."
}
```

#### 3. GET `GET /api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}/messages`

Description: Method to retrieve all messages for a specific chat.
Authentication: This endpoint requires the user to be authenticated with a valid
access token.

**Request body**

Empty

**Example Request**

Description: A `GET` request to retrieve all messages for a specific chat.

```
curl -X GET http://localhost:8080/api/v1/rooms/{roomId}/teams/{teamId}/chats/{chatId}/messages \
-H "Authorization: Bearer access_token"
```

**Example Responses**

Status code: **200 OK**

Description: The request was successful, and the response contains all messages
of the requested chat.

```json
{
	"messages": [
		{
			"messageId": "messageId1",
			"user": {
				"_id": "user",
				"username": "user123"
			},
			"text": "Hello!",
			"timestamp": "2024-09-25T10:05:00Z"
		}
	]
}
```

Status Code: **401 Unauthorized**

Description: The request lacks proper authentication credentials or the provided
token is invalid. Ensure that the correct authentication token is provided.

```
{
    "message": "Unauthorized access."
}
```

Status Code: **403 Forbidden**

Description: The user does not have the required permissions to access the team
in this room.

```
{
    "message": "Access denied. Insufficient permissions."
}
```

Status Code: **404 Not Found**

Description: The specified room cannot be found.

```
{
    "message": "Room not found."
}
```

Status Code: **404 Not Found**

Description: The specified team cannot be found in the specified room.

```
{
    "message": "Team not found."
}
```

Status Code: **404 Not Found**

Description: The specified chat cannot be found.

```
{
    "message": "Chat not found."
}
```

Status code: **500 Internal Server Error**

Description: The server encountered an unexpected error while processing the
request.

```
{
    "message": "An unexpected error occurred while retrieving the team."
}
```

## Security

### Server-Side Security

Server-side security is essential for protecting user data and maintaining the integrity of the application. This involves implementing various measures to prevent unauthorized access, data breaches, and malicious attacks. The following features are implemented to ensure a secure environment for users and their data:

- **Authentication & Authorization:** JWT (JSON Web Token) is used to keep sessions secure. When a user logs in, a unique JWT is created, allowing only authenticated users to access specific features;

- **Data Encryption:** Passwords are securely hashed using bcrypt before being stored in the database. This ensures that even if the database is compromised, passwords remain safe;

- **Input Validation & Sanitization:** All user input is validated with specific rules using DTO (Data Transfer Object) validation to prevent NoSQL injection attacks. Global validation only allows expected properties;

- **Database Security:** Safeguards against NoSQL injection are implemented by sanitizing all input queries and performing validation checks. ParseObjectIdPipe is used to ensure only valid MongoDB ObjectId values are processed;

- **Data Protection & Privacy:** User details, especially passwords, are never exposed in responses. Data sent is carefully sanitized to ensure no sensitive information is included;

- **Real-time Chat Security:** All chat features are secured through authenticated Socket connections, ensuring that only authorized users can access chat rooms and keeping conversations safe.

### Client-Side Security

Client-side security is essential for safeguarding user data and ensuring a safe browsing experience. This involves proper handling of sensitive information within the user's browser. To enhance client-side security, the following measure has been implemented:

- **Secure Cookies:** Authentication tokens are stored in secure cookies that have the `httpOnly` and `secure` flags enabled. This setup ensures that tokens are only transmitted over HTTPS connections, which helps reduce the risk of Cross-Site Scripting (XSS) attacks. Additionally, this means that these tokens cannot be accessed by client-side scripts, providing an extra layer of protection for user data.

## Testing

Testing is a crucial part of our development process, ensuring that our application functions correctly and efficiently. In our Node.js-Based Game "Alias" with Chat and Word Checking, we have implemented both unit and integration testing to maintain high code quality and reliability.

- **Unit Testing:**
Unit tests focus on verifying the functionality of individual components or functions in isolation. By testing these components independently, we can quickly identify and fix issues, ensuring that each part of the application behaves as expected. Our unit tests cover various modules and services, helping to catch bugs early in the development process.

- **Integration Testing:**
Integration tests check how different parts of the application work together. These tests simulate real-world scenarios to verify that components interact correctly and data flows seamlessly throughout the system. By implementing integration tests, we can ensure that the overall functionality of the application remains intact as new features are added or changes are made.

With both unit and integration testing in place, we aim to deliver a robust and reliable application that meets user expectations and performs well in various scenarios.

## Deployment

Before deploying, ensure that you have the following:

- Node.js and npm installed on the server.
- MongoDB instance set up and accessible.

#### 1. Clone current repository into a your directory:

```
git clone https://github.com/Aliko-XIII/alias-node-js.git
```

#### 2. Switch to project folder:

```
cd alias-node-js/alias-client
```

#### 3. Install the dependencies:

```
npm install
```

#### 4. Install the dependencies 
Set Environment Variables Create a .env file in the root directory of your project and define the necessary environment variables, such as database connection strings and API keys. Ensure sensitive data is not hardcoded in the source code.

#### 5. Build the Application

```
npm run build
```

#### 6. Start the Application

```
npm run start
```

## Future Enhancements

As we continue to develop and improve our application, we have identified several key enhancements that will enhance user experience, increase security, and broaden accessibility. These future enhancements will help us meet user needs and keep pace with modern technology trends.

- **Integration with Social Login Providers:**
To simplify the authentication process for users, we plan to implement social login options, such as Google, Facebook, and GitHub. This enhancement not only makes it easier for users to log in but also improves security by utilizing the multi-factor authentication features provided by these platforms.

- **Multi-language Support in the Chat System:**
We aim to enhance our chat application by adding multi-language support. This feature will allow users from different regions to communicate more easily, breaking down language barriers. By integrating translation APIs (like Google Translate API or Microsoft Azure Translator), the system can automatically detect the language of messages and translate them into the recipient's preferred language. Users will have the option to select their preferred language during registration or within chat sessions, significantly improving their overall experience.