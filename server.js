/**
 * server.js — CA Ranker AI Express Static Server
 * Serves the frontend. Ready to extend with API routes.
 */

const express = require('express')
const path    = require('path')

const app  = express()
const PORT = process.env.PORT || 3000

// Serve all static files from /public
app.use(express.static(path.join(__dirname, 'public')))

// Root → landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'))
})

// Catch-all for clean page routes
app.get('/pages/:page', (req, res) => {
  const file = path.join(__dirname, 'public', 'pages', req.params.page)
  res.sendFile(file, err => {
    if (err) res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'))
  })
})

app.listen(PORT, () => {
  console.log(`\n  CA Ranker AI  →  http://localhost:${PORT}\n`)
})
