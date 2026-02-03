import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { routePath } from './utils/route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: routePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = ({
        id: randomUUID(),
        title,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null
      })

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: routePath('/tasks'),
    handler: (req, res) => {
      const { search, title, description } = req.query

      // Search object only with defined values
      const searchParams = {}
      // search will always be undefined
      if (search) {
        // creates .title and .description whitin searchParams
        searchParams.title = search
        searchParams.description = search
      }

      // actual query validation; if there's a query title or description (or both), atributtes their values.
      if (title) searchParams.title = title
      if (description) searchParams.description = description

      const hasSearch = Object.keys(searchParams).length > 0

      const tasks = database.select('tasks', hasSearch ? searchParams : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: routePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.selectById('tasks', id)

      if (!task) {
        return res.writeHead(404).end()
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date().toISOString(),
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: routePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)

      if (!task) {
        return res.writeHead(404).end()
      }

      database.delete('tasks', id)

      return res.writeHead(200).end()
    }
  }
]