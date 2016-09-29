## API implementada

| URL            | HTTP Verb | Action                                      |
| -------------- | --------- | ------------------------------------------- |
| /api/auth      | POST      | Valida y trae el token [username,password ] |
| /api/users     | GET       | Listar todos los usuarios                   |
| /api/users/:id | GET       | Trae un usuario                             |
| /api/users     | POST      | Agregar usuario [username,password,role]    |
| /api/users/:id | PUT	     | Update a puppy [username,password,role]     |
| /api/users/:id | DELETE    | Delete a puppy                              |

## Test auth

```shell
$ curl -s --data 'username=admin&password=test123' api-oso.herokuapp.com/api/auth | python -mjson.tool
{
    "data": "Authentication ok",
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiJ9.YWRtaW4.P9C3VBCIS8BMNQwXjJVdJCmbo_mZvCwTZtffBtFw2IM"
}
```

## Deploy con Fynn

```shell
$ flynn create api-oso
Created api-oso

$ flynn resource add postgres
Created resource 564d0206-a71a-4f0c-93da-a9bd00b76722 and release 0ac2f11d-4bfe-40f4-83d1-0dcb79b34120.

$ eval $(flynn env)

$ cat data.sql | flynn -a postgres pg psql $DATABASE_URL
NOTICE:  table "users" does not exist, skipping
DROP TABLE
CREATE TABLE
INSERT 0 1
```

