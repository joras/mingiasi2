export const INCREMENT_RATE_KEY_LUA_FN = `
    -- set initial key value if not set
    -- this it is a fixed window with arbitrary start
    redis.call('set', KEYS[1], 0, 'EX', ARGV[1], 'NX')

    -- increment request counter
    local requests = redis.call('incr', KEYS[1])

    -- Get the remaining time-to-live (TTL) for the key in milliseconds
    local ttl = redis.call('pttl', KEYS[1])

    -- Return the current count and the TTL
    return {requests, ttl}
`;
