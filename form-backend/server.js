// Riarh Group — website lead receiver.
// Anonymous POST endpoint for the contact form (durable buffer to JSONL).
// The Air-side gws poller pulls /pending and emails info@riarhgroup.com + logs to a Sheet.
// No third-party form service, no submission cap.

const http = require('http')
const fs = require('fs')
const crypto = require('crypto')

const PORT = 8787
const DATA = '/var/lib/riarh/leads.jsonl'
const SECRET = process.env.RIARH_SECRET || ''
const ALLOW = new Set([
  'https://sandy-zippy.github.io',
  'https://whole-interaction-310969.framer.app',
])

fs.mkdirSync('/var/lib/riarh', { recursive: true })

function cors(req, res) {
  const o = req.headers.origin
  // Reflect known origins; fall back to GitHub Pages host for the live site.
  res.setHeader('Access-Control-Allow-Origin', ALLOW.has(o) ? o : 'https://sandy-zippy.github.io')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth')
  res.setHeader('Vary', 'Origin')
}

function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(obj))
}

function readBody(req) {
  return new Promise((resolve) => {
    let b = ''
    req.on('data', (c) => {
      b += c
      if (b.length > 1e5) req.destroy()
    })
    req.on('end', () => resolve(b))
  })
}

function parseFields(ct, body) {
  try {
    if (ct.includes('application/json')) return JSON.parse(body)
    return Object.fromEntries(new URLSearchParams(body))
  } catch {
    return {}
  }
}

const server = http.createServer(async (req, res) => {
  cors(req, res)
  const url = new URL(req.url, 'http://x')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  // Health
  if (req.method === 'GET' && url.pathname === '/health') {
    return send(res, 200, { ok: true, service: 'riarh-leads' })
  }

  // Public form ingest
  if (req.method === 'POST' && url.pathname === '/riarh-lead') {
    const body = await readBody(req)
    const f = parseFields(req.headers['content-type'] || '', body)

    // Honeypot — silently accept + drop bot submissions
    if (f.botcheck) return send(res, 200, { ok: true })

    const name = (f.name || '').toString().slice(0, 200).trim()
    const phone = (f.phone || '').toString().slice(0, 60).trim()
    const email = (f.email || '').toString().slice(0, 200).trim()
    const project = (f.project || '').toString().slice(0, 120).trim()
    const message = (f.message || '').toString().slice(0, 5000).trim()

    if (!name && !email && !message) return send(res, 400, { ok: false, error: 'empty' })

    const lead = {
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      name, phone, email, project, message,
      ua: (req.headers['user-agent'] || '').toString().slice(0, 300),
    }
    fs.appendFileSync(DATA, JSON.stringify(lead) + '\n')
    return send(res, 200, { ok: true })
  }

  // Protected: poller pulls all leads (it dedupes by id on its side)
  if (req.method === 'GET' && url.pathname === '/pending') {
    if ((req.headers['x-auth'] || '') !== SECRET) return send(res, 401, { ok: false })
    let lines = []
    try {
      lines = fs.readFileSync(DATA, 'utf8').split('\n').filter(Boolean)
    } catch {}
    return send(res, 200, { ok: true, leads: lines.map((l) => JSON.parse(l)) })
  }

  send(res, 404, { ok: false })
})

server.listen(PORT, '127.0.0.1', () => console.log('riarh-leads on :' + PORT))
