# Example REST API with redis backed rate limiting.

## configuration

default configuration is:

```
PORT=3000
REDIS_URL="redis://localhost:6379"
RATE_PUBLIC=100
RATE_PRIVATE=200
RATE_WINDOW='hour'
SECRET_TOKEN:   c2VjcmV0IHRva2VuCg==
```

it is possible to overwrite these with environment variables or with `.env` file.

## to run

`npm start` - will run the service on port 3000 and connect to default Redis

there is also a simple `docker-compose` config that will run two services, load balancer and redis. just run `docker-compose`

## to use

there are following endpoints

- `/hello` (public)
- `/price` (public)
- `/private/hello`
- `/private/price`

Private endpoints use bearer authentication, so one must set an correct header `Authorization: Bearer <SECRET TOKEN>` for example:
`curl --header "Authorization: Bearer c2VjcmV0IHRva2VuCg==" localhost:3000/hello`
