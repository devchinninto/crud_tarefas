import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = 'src/csv-files'

export const processFile = async () => {
  const records = []
  const parser = fs.createReadStream(`${csvPath}/tasks.csv`).pipe(
    parse({
      columns: true,
      delimiter: ';'
    })
  )

  for await (const record of parser) {
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ title: record.title, description: record.description }),
    })
  }
}

(async () => {
  const records = await processFile()
})()