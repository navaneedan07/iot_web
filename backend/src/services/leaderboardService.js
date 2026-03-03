import pool from '../db/pool.js'

export async function getLeaderboard ({ scope = 'global', limit = 20 }) {
  let query = 'SELECT id, username, status_score, percentile_rank, college, city FROM users'
  const params = []
  if (scope.startsWith('college:')) {
    params.push(scope.split(':')[1])
    query += ` WHERE college=$${params.length}`
  } else if (scope.startsWith('city:')) {
    params.push(scope.split(':')[1])
    query += ` WHERE city=$${params.length}`
  }
  query += ' ORDER BY status_score DESC NULLS LAST LIMIT $' + (params.length + 1)
  params.push(limit)
  const res = await pool.query(query, params)
  return res.rows
}

export async function snapshotLeaderboard () {
  const scopes = ['global']
  const data = {}
  for (const scope of scopes) {
    data[scope] = await getLeaderboard({ scope, limit: 100 })
  }
  await pool.query('INSERT INTO leaderboard_snapshots (scope, data) VALUES ($1,$2)', ['global', data])
}
