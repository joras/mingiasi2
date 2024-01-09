todo:
 - docker compose
 - organize routes
 - eslint
 - readme
 - token in db?
 - more realistic routes?
 
testtask:
- Implement a rate limiter. It should check a token limit for - private routes and a ip limit for public routes.
- Set a rate limit by token to 200 req/hour
- Set a rate limit by ip to 100 req/hour 
- Those numbers (token limit and ip limit) should be - configurable from the environment
- When a user reaches the limit, in the response show an error - message about current limit for that user account, and display - when (time) the user can make the next request
- Keep concurrency in mind.
- Your solution should handle multiple requests at the same time,
- for example, let's say you have 4000 requests per second to - the public route from the same user, so your solution should - respond with 429 status code when the rate limit is reached.
- Bonus: keep performance in mind.
- Optional task: Create a different weight of a request for every URL: 1/2/5 points per request (you can assume we have 3 different end points) depending on end point.



