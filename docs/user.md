# User API Spec

## Register User

 Endpoint : POST /api/users

- Request Body :
```json
{
    "username": "teslala",
    "email": "andilala@gmail.com",
    "password": "123",
    "name": "tes"
}
```

- Response Body Success : 
```json
{
    "data": {
        "username": "teslala",
        "name" : "tes"
    }
}
```
- Response Body Error :
```json
{
    "errors": "username already Registered"
}
```



## Login User

 Endpoint : POST api/users/login

- Request Body :
```json
{
    "username": "teslala",
    "password": "123"
}
```
- Response Body Success :
```json
{
    "data": {
        "token" : "unique token"
    }
}
```
- Response Body Error :
```json
{
    "errors": "username or password wrong"
}
```

## Update User

 Endpoint PATCH api/users/current

 Headers :
 - Authorization : token 


- Request Body:
```json
{
    "name" : "tes", // optional
    "password" : "new password", //optional
    "email" : "andi1@gmail.com"    // optional

}
```
- Response Body Success:
```json
{
    "data": {
        "username": "teslala",
        "name": "tes",
        "email" : "andi1@gmail.com" 
    }
}
```
- Response Body Error:
```json
{
    "errors": "Name length max 100"
}
```

## Get User

 Endpoint GET api/users/current

 Headers :
- Authorization : token

- Response Body Success:
```json
{
    "data": {
        "username": "teslala",
        "name" : "tes",
        "email" : "andi@gmail.com" 
    }
}
```
- Response Body Error:
```json
{
    "errors": "Unauthorized"
}
```

## Logout User

Endpoint DELETE api/users/Logout

Headers :
- Authorization : token

Response Body Success: 
```json
{
    "data": "OK"
}
```

Response Body Error :
```json
{
    "errors": "Unauthorized"
}
```