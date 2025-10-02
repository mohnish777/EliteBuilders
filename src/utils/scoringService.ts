// Groq API configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export interface ScoreBreakdown {
  functionality: number // 0-30
  codeQuality: number // 0-30
  documentation: number // 0-20
  innovation: number // 0-10
  uiux: number // 0-10
  total: number // 0-100
  feedback: string
}

export interface ScoringResult {
  success: boolean
  score?: ScoreBreakdown
  error?: string
  usedMock?: boolean
}

/**
 * Analyzes a GitHub repository and generates a score using Groq AI
 */
export async function scoreSubmission(
  githubUrl: string,
  challengeTitle: string,
  challengeDescription: string
): Promise<ScoringResult> {
  try {
    // Check if API key is available
    if (!GROQ_API_KEY) {
      console.warn('Groq API key not found, using mock scoring')
      return generateMockScore()
    }

    // Extract repo info from GitHub URL
    const repoInfo = extractRepoInfo(githubUrl)
    if (!repoInfo) {
      return {
        success: false,
        error: 'Invalid GitHub URL format',
      }
    }

    // Fetch actual repository content from GitHub API
    console.log('🔍 Fetching repository content from GitHub...')
    const repoContent = await fetchGitHubRepository(repoInfo.owner, repoInfo.repo)

    if (!repoContent.success) {
      console.warn('Failed to fetch repo content, using basic analysis')
    }

    // Create the scoring prompt with REAL code
    const prompt = createScoringPrompt(
      repoInfo,
      challengeTitle,
      challengeDescription,
      repoContent
    )

    // Call Groq API using fetch
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are an expert code reviewer and technical evaluator. You analyze GitHub repositories and provide detailed, fair scoring based on multiple criteria. Always respond with valid JSON only.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const completion = await response.json()
    const responseText = completion.choices[0]?.message?.content || '{}'
    const scoreData = JSON.parse(responseText)

    // Validate and normalize the score
    const score: ScoreBreakdown = {
      functionality: Math.min(30, Math.max(0, scoreData.functionality || 0)),
      codeQuality: Math.min(30, Math.max(0, scoreData.codeQuality || 0)),
      documentation: Math.min(20, Math.max(0, scoreData.documentation || 0)),
      innovation: Math.min(10, Math.max(0, scoreData.innovation || 0)),
      uiux: Math.min(10, Math.max(0, scoreData.uiux || 0)),
      total: 0,
      feedback: scoreData.feedback || 'No feedback provided',
    }

    // Calculate total
    score.total =
      score.functionality +
      score.codeQuality +
      score.documentation +
      score.innovation +
      score.uiux

    return {
      success: true,
      score,
      usedMock: false,
    }
  } catch (error: any) {
    console.error('Error scoring submission:', error)

    // Fallback to mock scoring if API fails
    if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
      console.warn('API limit hit, using mock scoring')
      return generateMockScore()
    }

    return {
      success: false,
      error: error.message || 'Failed to score submission',
    }
  }
}

/**
 * Generates a mock score for demo purposes
 */
export function generateMockScore(): ScoringResult {
  // Generate realistic-looking scores with some randomness
  const functionality = Math.floor(Math.random() * 10) + 20 // 20-30
  const codeQuality = Math.floor(Math.random() * 10) + 20 // 20-30
  const documentation = Math.floor(Math.random() * 8) + 12 // 12-20
  const innovation = Math.floor(Math.random() * 5) + 5 // 5-10
  const uiux = Math.floor(Math.random() * 5) + 5 // 5-10

  const total = functionality + codeQuality + documentation + innovation + uiux

  const score: ScoreBreakdown = {
    functionality,
    codeQuality,
    documentation,
    innovation,
    uiux,
    total,
    feedback: `**Mock Evaluation** (Groq API not configured)\n\nThis is a simulated score for demonstration purposes. The project shows promise with solid implementation. Consider improving documentation and adding more innovative features to boost your score.\n\n**Strengths:**\n- Good code structure\n- Working functionality\n- Clean UI design\n\n**Areas for Improvement:**\n- Add more comprehensive documentation\n- Implement additional features\n- Enhance error handling`,
  }

  return {
    success: true,
    score,
    usedMock: true,
  }
}

/**
 * Fetches actual repository content from GitHub API
 */
async function fetchGitHubRepository(owner: string, repo: string) {
  try {
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`

    // Fetch repository info
    const repoResponse = await fetch(baseUrl)
    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }
    const repoData = await repoResponse.json()

    // Fetch README
    let readmeContent = ''
    try {
      const readmeResponse = await fetch(`${baseUrl}/readme`, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' }
      })
      if (readmeResponse.ok) {
        readmeContent = await readmeResponse.text()
      }
    } catch (e) {
      console.warn('No README found')
    }

    // Fetch file tree
    let fileStructure: string[] = []
    try {
      const treeResponse = await fetch(`${baseUrl}/git/trees/${repoData.default_branch}?recursive=1`)
      if (treeResponse.ok) {
        const treeData = await treeResponse.json()
        fileStructure = treeData.tree
          .filter((item: any) => item.type === 'blob')
          .map((item: any) => item.path)
          .slice(0, 50) // Limit to 50 files
      }
    } catch (e) {
      console.warn('Could not fetch file tree')
    }

    // Fetch package.json if it exists
    let packageJson = null
    try {
      const pkgResponse = await fetch(`${baseUrl}/contents/package.json`, {
        headers: { 'Accept': 'application/vnd.github.v3.raw' }
      })
      if (pkgResponse.ok) {
        const pkgText = await pkgResponse.text()
        packageJson = JSON.parse(pkgText)
      }
    } catch (e) {
      console.warn('No package.json found')
    }

    return {
      success: true,
      data: {
        name: repoData.name,
        description: repoData.description || '',
        language: repoData.language || 'Unknown',
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        topics: repoData.topics || [],
        readme: readmeContent.slice(0, 3000), // Limit README to 3000 chars
        files: fileStructure,
        packageJson: packageJson,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
      }
    }
  } catch (error: any) {
    console.error('Error fetching GitHub repo:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Extracts owner and repo name from GitHub URL
 */
function extractRepoInfo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl)
    const parts = url.pathname.split('/').filter(Boolean)

    if (parts.length >= 2) {
      return {
        owner: parts[0],
        repo: parts[1],
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Creates the scoring prompt for the AI
 */
function createScoringPrompt(
  repoInfo: { owner: string; repo: string },
  challengeTitle: string,
  challengeDescription: string,
  repoContent: any
): string {
  const hasContent = repoContent.success && repoContent.data

  let contentSection = ''

  if (hasContent) {
    const data = repoContent.data
    contentSection = `
**ACTUAL REPOSITORY ANALYSIS:**

**Repository Name:** ${data.name}
**Description:** ${data.description || 'No description'}
**Primary Language:** ${data.language}
**Topics/Tags:** ${data.topics.join(', ') || 'None'}
**Stars:** ${data.stars} | **Forks:** ${data.forks}

**README Content (first 3000 chars):**
${data.readme || 'No README found'}

**File Structure (key files):**
${data.files.slice(0, 30).join('\n') || 'No files found'}

**Dependencies (from package.json):**
${data.packageJson ? JSON.stringify(data.packageJson.dependencies || {}, null, 2) : 'No package.json found'}

**Repository Age:**
Created: ${new Date(data.createdAt).toLocaleDateString()}
Last Updated: ${new Date(data.updatedAt).toLocaleDateString()}
`
  } else {
    contentSection = `
**WARNING:** Could not fetch repository content. Repository may be private or deleted.
**Repository URL:** https://github.com/${repoInfo.owner}/${repoInfo.repo}
`
  }

  return `You are evaluating a GitHub repository submission for a coding challenge.

**CHALLENGE REQUIREMENTS:**
**Title:** ${challengeTitle}
**Description:**
${challengeDescription}

${contentSection}

**YOUR TASK:**
Carefully analyze if this repository matches the challenge requirements. Be STRICT and HONEST.

**CRITICAL EVALUATION RULES:**
1. If the repository is about a COMPLETELY DIFFERENT topic (e.g., Android app when challenge asks for web app), give VERY LOW scores (0-20 total)
2. If the repository name, description, or files don't match the challenge at all, score should be 0-10 total
3. If README doesn't mention the challenge topic, deduct major points
4. If the primary language doesn't match what's expected for the challenge, deduct points
5. Only give high scores (70+) if there's clear evidence the project addresses the challenge

**Scoring Criteria (Total: 100 points):**

1. **Functionality (0-30 points):**
   - Does it actually implement the challenge requirements?
   - Are the required features present?
   - Does the code/files match what's expected?
   - **Give 0-5 if completely unrelated to challenge**

2. **Code Quality (0-30 points):**
   - Is the code relevant to the challenge?
   - Good architecture for THIS specific challenge?
   - **Give 0-5 if wrong technology/language**

3. **Documentation (0-20 points):**
   - Does README explain the challenge solution?
   - Does it mention the challenge at all?
   - **Give 0 if README is about different project**

4. **Innovation (0-10 points):**
   - Creative solutions TO THIS CHALLENGE?
   - **Give 0 if not related to challenge**

5. **UI/UX (0-10 points):**
   - Relevant to challenge requirements?
   - **Give 0 if challenge requires UI but repo has none**

**EXAMPLES OF MISMATCHES (should score 0-15 total):**
- Challenge: "AI Meme Generator" → Repo: Android navigation app
- Challenge: "Todo App" → Repo: Machine learning model
- Challenge: "React Dashboard" → Repo: Python script
- Challenge: "E-commerce site" → Repo: Game development

**Response Format (JSON only):**
{
  "functionality": <number 0-30>,
  "codeQuality": <number 0-30>,
  "documentation": <number 0-20>,
  "innovation": <number 0-10>,
  "uiux": <number 0-10>,
  "feedback": "<HONEST feedback explaining why scores are low if repository doesn't match challenge, or praising if it does match>"
}

**BE BRUTALLY HONEST.** If the repository is completely unrelated to the challenge, say so clearly in feedback and give very low scores.

Respond with ONLY the JSON object, no additional text.`
}

