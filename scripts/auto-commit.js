#!/usr/bin/env node
const { execSync } = require('child_process')
const fs = require('fs')

function getStagedFiles() {
  const out = execSync('git diff --name-only --cached', { encoding: 'utf8' }).trim()
  if (!out) return []
  return out.split('\n').map(s => s.trim()).filter(Boolean)
}

function getStagedFileContent(path) {
  try {
    return execSync(`git show :${path}`, { encoding: 'utf8' })
  } catch (e) {
    try { return fs.readFileSync(path, 'utf8') } catch (e2) { return '' }
  }
}

function extractFunctionNames(content) {
  const names = new Set()
  const funcDecl = /function\s+([A-Za-z0-9_$]+)\s*\(/g
  const arrowConst = /(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*\([^\)]*\)\s*=>/g
  const arrowConstSimple = /(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*[^=\n]*=>/g
  const methodShorthand = /([A-Za-z0-9_$]+)\s*:\s*function\s*\(/g
  let m
  while (m = funcDecl.exec(content)) names.add(m[1])
  while (m = arrowConst.exec(content)) names.add(m[1])
  while (m = arrowConstSimple.exec(content)) names.add(m[1])
  while (m = methodShorthand.exec(content)) names.add(m[1])
  return Array.from(names)
}

function makeMessageForFile(path, names) {
  if (names.length === 0) return null
  const name = names[0]
  return `Update ${name} in ${path}`
}

function main() {
  const files = getStagedFiles()
  if (files.length === 0) {
    console.error('No staged files found. Stage your changes before running this script.')
    process.exit(1)
  }

  const parts = []
  for (const f of files) {
    const content = getStagedFileContent(f)
    const names = extractFunctionNames(content)
    const msg = makeMessageForFile(f, names)
    if (msg) parts.push(msg)
  }

  const message = parts.length ? parts.join('; ') : `chore: update ${files.join(', ')}`

  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' })
    console.log('Committed with message:', message)
  } catch (e) {
    console.error('git commit failed:', e.message || e)
    process.exit(1)
  }
}

main()
