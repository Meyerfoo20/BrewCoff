import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }).trim()

git('fetch', 'origin')
const ref = git('symbolic-ref', 'refs/remotes/origin/HEAD')
const repository = git('remote', 'get-url', 'origin').replace(/\.git$/, '').replace(/^git@github.com:/, 'https://github.com/')
const commits = git('log', ref, '--format=%H%x1f%aN%x1f%aI%x1f%s%x1f%P%x1e')
  .split('\x1e').map(row => row.trim()).filter(Boolean).map(row => {
    const [sha, author, date, message, parents] = row.split('\x1f')
    const merge = parents.split(' ').filter(Boolean).length > 1
    const files = merge ? [] : git('diff-tree', '--root', '--no-commit-id', '--name-only', '-r', '-z', sha).split('\0').filter(Boolean)
    return { sha, author, date, message, merge, files }
  }).sort((a, b) => new Date(b.date) - new Date(a.date))
const data = { repository, branch: ref.split('/').slice(3).join('/'), updated: new Date().toISOString(), commits }
const template = readFileSync(new URL('./contributors.template.html', import.meta.url), 'utf8')
const json = JSON.stringify(data).replace(/</g, '\\u003c')
writeFileSync(new URL('../contributors.html', import.meta.url), template.replace('/* PROJECT_DATA */', json))
console.log(`contributors.html: ${new Set(commits.map(commit => commit.author)).size} personer, ${commits.length} commits från ${data.branch}.`)
