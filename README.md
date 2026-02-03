# 📋 Tasks CRUD - Node.js Fundamentals

A REST API project for task management, built with **pure Node.js**, without any frameworks. The goal is to explore Node.js fundamentals "under the hood", implementing concepts like streams, buffers, and the native HTTP module.

> 🎓 Practical project from [Rocketseat](https://app.rocketseat.com.br/projects/ignite-node-js-2023-modulo-01?module_slug=desafio-pratico-crud-tarefas&origin=/jornada/node-js-2023/conteudos) Node.js course

## 🎯 Objective

Implement CRUD operations (Create, Read, Update, Delete) using only Node.js native modules, understanding:

- How the HTTP server works under the hood
- Stream and buffer manipulation for reading request body
- Manual routing with regex for dynamic parameters
- Data persistence in JSON file
- Query parameters parsing

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Client
        REQ[HTTP Request]
    end

    subgraph Server["server.js"]
        HTTP[HTTP Server :3333]
        JSON_MW[JSON Middleware]
        ROUTER[Route Matcher]
    end

    subgraph Middleware["middlewares/"]
        PARSE[Parse Request Body]
        BUFFER[Buffer Chunks]
        JSON_PARSE[JSON.parse]
    end

    subgraph Routes["routes.js"]
        POST[POST /tasks]
        GET[GET /tasks]
        PUT[PUT /tasks/:id]
        DELETE[DELETE /tasks/:id]
        PATCH[PATCH /tasks/:id]
    end

    subgraph Utils["utils/"]
        ROUTE_PATH[routePath - Regex Builder]
        QUERY_PARAMS[extractQueryParams]
    end

    subgraph Database["database.js"]
        DB_CLASS[Database Class]
        INSERT[insert]
        SELECT[select / selectById]
        UPDATE[update]
        DEL[delete]
        PERSIST[#persist → db.json]
    end

    subgraph Storage
        DB_FILE[(db.json)]
    end

    REQ --> HTTP
    HTTP --> JSON_MW
    JSON_MW --> PARSE
    PARSE --> BUFFER
    BUFFER --> JSON_PARSE
    JSON_PARSE --> ROUTER
    ROUTER --> ROUTE_PATH
    ROUTER --> QUERY_PARAMS
    ROUTER --> Routes
    POST --> INSERT
    GET --> SELECT
    PUT --> UPDATE
    DELETE --> DEL
    PATCH --> UPDATE
    INSERT --> PERSIST
    UPDATE --> PERSIST
    DEL --> PERSIST
    PERSIST --> DB_FILE
```

## 🔄 Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant M as JSON Middleware
    participant R as Router
    participant H as Handler
    participant D as Database

    C->>S: HTTP Request
    S->>M: Pass request stream
    M->>M: Collect chunks (Buffer)
    M->>M: JSON.parse(body)
    M->>S: req.body populated
    S->>R: Match route (regex)
    R->>R: Extract params & query
    R->>H: Call route handler
    H->>D: Database operation
    D->>D: Update in-memory data
    D->>D: Persist to db.json
    D->>H: Return result
    H->>C: HTTP Response
```

## 🚀 Features

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/tasks` | Create new task |
| `GET` | `/tasks` | List tasks (with optional filters) |
| `PUT` | `/tasks/:id` | Update title and description |
| `DELETE` | `/tasks/:id` | Remove task |
| `PATCH` | `/tasks/:id` | Mark task as completed |

### Query Parameters (GET /tasks)

- `?title=text` - Filter by title
- `?description=text` - Filter by description

## 📦 Project Structure

```
crud_tarefas/
├── db.json                      # JSON database
├── package.json
├── src/
│   ├── server.js                # HTTP Server
│   ├── routes.js                # Route definitions
│   ├── database.js              # Database class with persistence
│   ├── middlewares/
│   │   └── json.js              # Body parsing middleware
│   ├── utils/
│   │   ├── route-path.js        # Regex generator for routes
│   │   └── extract-query-params.js
│   └── csv-files/
│       ├── import-csv.js        # CSV import script
│       └── tasks.csv            # Seed file
```

## 🛠️ Applied Concepts

### Streams & Buffers
The JSON middleware reads the request body as a stream, accumulating chunks in a buffer before parsing:

```javascript
for await (const chunk of req) {
  buffers.push(chunk)
}
req.body = JSON.parse(Buffer.concat(buffers).toString())
```

### Regex Routing
Dynamic routes are converted into regular expressions with named capture groups:

```javascript
// /tasks/:id → /^\/tasks\/(?<id>[a-z0-9\-_]+)(?<query>\?(.*))?$/
```

### JSON Persistence
Data is kept in memory and synchronized with a JSON file:

```javascript
#persist() {
  fs.writeFile(databasePath, JSON.stringify(this.#database))
}
```

## 🚀 How to Run

### Prerequisites
- Node.js 18+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd crud_tarefas

# Install dependencies
pnpm install
```

### Run the server

```bash
# Development mode (with watch)
pnpm dev

# Or directly
node src/server.js
```

The server will be available at `http://localhost:3333`

### Import tasks via CSV

```bash
# With the server running in another terminal
node src/csv-files/import-csv.js
```

## 📝 Request Examples

### Create task
```bash
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Study Node", "description": "Streams module"}'
```

### List tasks
```bash
curl http://localhost:3333/tasks
```

### Filter tasks
```bash
curl "http://localhost:3333/tasks?title=node"
```

### Update task
```bash
curl -X PUT http://localhost:3333/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title": "New title", "description": "New description"}'
```

### Complete task
```bash
curl -X PATCH http://localhost:3333/tasks/<id>
```

### Delete task
```bash
curl -X DELETE http://localhost:3333/tasks/<id>
```


---

Developed during Rocketseat Node.js course
