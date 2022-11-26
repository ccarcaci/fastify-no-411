'use strict'

const fastify = require('fastify')

//  --
const MAX_UPLOAD_SIZE = 500000
const jsonSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        Authorization: {
          type: 'string',
          pattern: '^(Bearer\\s)',
        },
        'Content-Type': {
          type: 'string',
          enum: ['text/plain; charset=utf-8'],
        },
        'Content-Length': {
          type: 'number',
          maximum: MAX_UPLOAD_SIZE,
        },
      },
      required: ['Authorization', 'Content-Type', 'Content-Length'],
    },
    params: {
      type: 'object',
      properties: {
        storyUrl: {type: 'string', pattern: '^[a-zA-Z0-9][a-zA-Z0-9\\-_]{1,62}[a-zA-Z0-9]$'},
      },
    },
    body: {
      type: 'string',
      maxLength: 500 * 1000,
    },
  },
}

//  --

function build(opts = {}) {
  const app = fastify(opts)
  /*
    curl --verbose --request POST \
     --header "Content-Type: text/plain; charset=utf-8" \
     --header "Authorization: Bearer the.jwt.token" \
     http://localhost:3000/411
    */
  app.post('/411', jsonSchema, async function (request, reply) {
    return {hello: 'world'}
  })

  return app
}

const server = build({logger: true})

server.listen({port: 3000}, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})

server.log.info('Server started')
