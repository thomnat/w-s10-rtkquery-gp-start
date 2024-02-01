const express = require('express')
const cors = require('cors')
const path = require('path')
const Yup = require('yup')

const PORT = process.env.PORT || 9009

const glitchy = true // ❗ mutations will fail half the time
const slow = false // ❗ responses will take a full second

const shouldRequestFail = () => glitchy && Math.floor(Math.random() * 2)
const delay = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, slow ? 1000 : 0)
  })
}

const server = express()
server.use(express.json())
server.use(express.static(path.join(__dirname, '../dist')))
server.use(cors())

let id = 1
const getNextId = () => id++

const todos = [
  { id: getNextId(), label: 'Laundry', complete: true },
  { id: getNextId(), label: 'Groceries', complete: false },
  { id: getNextId(), label: 'Dishes', complete: false },
]

server.get('/api/todos', async (req, res, next) => {
  await delay()
  res.json(todos)
})

const putSchema = Yup.object().shape({
  label: Yup.string().nullable(),
  complete: Yup.boolean().nullable()
})
  .test(
    'at-least-one-field',
    'Provide label or complete status',
    function (obj) {
      return obj.label != null || obj.complete != null
    }
  )

server.put('/api/todos/:id', async (req, res, next) => {
  await delay()
  if (shouldRequestFail()) {
    return next({ message: 'Could not update todo, try again!' })
  }
  try {
    const todo = todos.find(td => td.id == req.params.id)
    if (!todo) return next({ status: 404, message: 'Todo not found' })
    const { label, complete } = await putSchema.validate(req.body, { stripUnknown: true })
    if (label) todo.label = label
    if (complete !== undefined) todo.complete = complete
    res.json(todo)
  } catch ({ message }) {
    return next({ status: 422, message })
  }
})

const postSchema = Yup.object().shape({
  label: Yup.string().required('Provide a valid label'),
  complete: Yup.boolean().required('Provide a valid complete'),
})
server.post('/api/todos', async (req, res, next) => {
  await delay()
  if (shouldRequestFail()) {
    return next({ message: 'Could not create todo, try again!' })
  }
  try {
    const { label, complete } = await postSchema.validate(req.body, { stripUnknown: true })
    const newTodo = { id: getNextId(), label, complete }
    todos.push(newTodo)
    res.status(201).json(newTodo)
  } catch ({ message }) {
    return next({ status: 422, message })
  }
})

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.path} does not exist`,
  })
})

server.use((err, req, res, next) => {
  const message = err.message || 'Unknown error happened'
  const status = err.status || 500
  const reason = err.reason
  const payload = { message }
  if (reason) payload.reason = reason
  res.status(status).json(payload)
})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
