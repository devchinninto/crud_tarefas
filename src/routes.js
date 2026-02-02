import { randomUUID } from 'node:crypto'

export const routes = [
  {
    method: 'POST',
    path: '/tasks',
    handler: (req, res) => {
      const { title, description } = req.body

      console.log(title, description)

      const task = ({
        id: randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null
      })


      return res.writeHead(201).end()
    }
  },
]