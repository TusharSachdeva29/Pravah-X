const CF_API_BASE = "https://codeforces.com/api"

export interface CFUserInfo {
  handle: string
  rating?: number
  maxRating?: number
  rank?: string
  maxRank?: string
  contribution?: number
  friendOfCount?: number
  titlePhoto?: string
  organization?: string
}

export interface CFSubmission {
  id: number
  contestId?: number
  creationTimeSeconds: number
  problem: {
    name: string
    index: string
    rating?: number
    tags: string[]
  }
  verdict: string
  programmingLanguage: string
  timeConsumedMillis: number
  memoryConsumedBytes: number
}

export interface CFRatingChange {
  contestId: number
  contestName: string
  handle: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

export interface CFContest {
  id: number
  name: string
  type: string
  phase: string
  frozen: boolean
  durationSeconds: number
  startTimeSeconds: number
  relativeTimeSeconds: number
}

export async function getUserInfo(handle: string): Promise<CFUserInfo> {
  const res = await fetch(`${CF_API_BASE}/user.info?handles=${handle}`)
  const data = await res.json()
  if (data.status === 'OK') {
    return data.result[0]
  }
  throw new Error(data.comment || 'Failed to fetch user info')
}

export async function getUserSubmissions(handle: string): Promise<CFSubmission[]> {
  const res = await fetch(`${CF_API_BASE}/user.status?handle=${handle}`)
  const data = await res.json()
  if (data.status === 'OK') {
    return data.result
  }
  throw new Error(data.comment || 'Failed to fetch submissions')
}

export async function getUserRatingHistory(handle: string): Promise<CFRatingChange[]> {
  const res = await fetch(`${CF_API_BASE}/user.rating?handle=${handle}`)
  const data = await res.json()
  if (data.status === 'OK') {
    return data.result
  }
  throw new Error(data.comment || 'Failed to fetch rating history')
}

export async function getContests(gym = false): Promise<CFContest[]> {
  const res = await fetch(`${CF_API_BASE}/contest.list?gym=${gym}`)
  const data = await res.json()
  if (data.status === 'OK') {
    return data.result
      .filter((contest: CFContest) => contest.phase === "BEFORE")
      .sort((a: CFContest, b: CFContest) => a.startTimeSeconds - b.startTimeSeconds)
  }
  throw new Error(data.comment || 'Failed to fetch contests')
}

export function processSubmissionsForHeatmap(submissions: CFSubmission[]) {
  const activityMap = new Map<string, number>()
  
  submissions.forEach(submission => {
    const date = new Date(submission.creationTimeSeconds * 1000)
      .toISOString()
      .split('T')[0]
    
    activityMap.set(date, (activityMap.get(date) || 0) + 1)
  })

  return activityMap
}
