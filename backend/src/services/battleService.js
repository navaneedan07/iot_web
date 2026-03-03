import pool from '../db/pool.js'

export async function createBattle ({ challengerId, opponentId, challengerPostId, opponentPostId, entryFeeCents = 0 }) {
  const res = await pool.query(
    `INSERT INTO battles (challenger_id, opponent_id, challenger_post_id, opponent_post_id, entry_fee_cents)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [challengerId, opponentId, challengerPostId, opponentPostId, entryFeeCents]
  )
  return res.rows[0]
}

/* Auto-match: find two recent SAFE posts in the same category that aren't already in a battle */
export async function autoMatchBattle (userId) {
  // Find a category with at least two un-battled posts from different users
  const matchRes = await pool.query(
    `WITH unbattled AS (
       SELECT p.id, p.user_id, p.category, p.media_url, p.media_type, p.caption
       FROM posts p
       WHERE p.moderation_status = 'SAFE'
         AND p.id NOT IN (SELECT challenger_post_id FROM battles)
         AND p.id NOT IN (SELECT opponent_post_id FROM battles)
       ORDER BY p.created_at DESC
       LIMIT 200
     )
     SELECT a.id AS post_a_id, a.user_id AS user_a, a.category,
            b.id AS post_b_id, b.user_id AS user_b
     FROM unbattled a
     JOIN unbattled b ON a.category = b.category AND a.id < b.id AND a.user_id <> b.user_id
     LIMIT 1`
  )
  if (matchRes.rows.length === 0) return null
  const m = matchRes.rows[0]
  const res = await pool.query(
    `INSERT INTO battles (challenger_id, opponent_id, challenger_post_id, opponent_post_id, entry_fee_cents)
     VALUES ($1,$2,$3,$4,0) RETURNING *`,
    [m.user_a, m.user_b, m.post_a_id, m.post_b_id]
  )
  return res.rows[0]
}

export async function voteBattle ({ battleId, voterId, voteFor }) {
  try {
    await pool.query(
      'INSERT INTO battle_votes (battle_id, voter_id, vote_for) VALUES ($1,$2,$3)',
      [battleId, voterId, voteFor]
    )
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      const e = new Error('You have already voted on this battle')
      e.status = 409
      throw e
    }
    throw err
  }
  return { ok: true }
}

export async function listBattles () {
  const res = await pool.query(
    `SELECT b.*,
            cu.username AS challenger, ou.username AS opponent,
            cp.media_url AS challenger_media, cp.media_type AS challenger_media_type,
            cp.caption AS challenger_caption, cp.category AS category,
            op.media_url AS opponent_media, op.media_type AS opponent_media_type,
            op.caption AS opponent_caption,
            (SELECT COUNT(*) FROM battle_votes bv WHERE bv.battle_id = b.id AND bv.vote_for = b.challenger_post_id) AS challenger_votes,
            (SELECT COUNT(*) FROM battle_votes bv WHERE bv.battle_id = b.id AND bv.vote_for = b.opponent_post_id) AS opponent_votes
     FROM battles b
     JOIN users cu ON cu.id = b.challenger_id
     JOIN users ou ON ou.id = b.opponent_id
     JOIN posts cp ON cp.id = b.challenger_post_id
     JOIN posts op ON op.id = b.opponent_post_id
     ORDER BY b.created_at DESC`
  )
  return res.rows
}
