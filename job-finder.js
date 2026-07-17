const apiKey = 'AQ.Ab8RN6I7UbR3uQP9eoR2NTAq2CzHRZJzmVsV4Km3yvndjfluNA';
const modelName = 'gemini-3.5-flash';

const statusText = document.getElementById('statusText');
const jobResults = document.getElementById('jobResults');

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.className = isError ? 'status error' : 'status';
}

function buildPrompt(profile) {
  return `
You are an expert career counselor.

Based on the candidate profile below, recommend the 5 best jobs.

Candidate Profile:
Qualification: ${profile.qualification}
Skills: ${profile.skills}
Experience: ${profile.experience}

For EACH job provide:

1. Job Title
2. Match Percentage
3. Expected Salary (India)
4. Why this job matches
5. Skills to Improve
6. Direct LinkedIn Job Search URL
7. Direct Indeed Job Search URL

Generate REAL search URLs using this format:

LinkedIn:
https://www.linkedin.com/jobs/search/?keywords=JOB_NAME

Indeed:
https://in.indeed.com/jobs?q=JOB_NAME

Replace spaces with %20.

Return the result ONLY in HTML using this format:

<div class="job">
<h3>Software Developer</h3>
<p><b>Match:</b> 95%</p>
<p><b>Salary:</b> ₹6–10 LPA</p>
<p>Reason...</p>

<a href="https://www.linkedin.com/jobs/search/?keywords=Software%20Developer" target="_blank">
🔗 LinkedIn Jobs
</a>

<br><br>

<a href="https://in.indeed.com/jobs?q=Software%20Developer" target="_blank">
🔗 Indeed Jobs
</a>

</div>

Do not use markdown.
`;
}

function formatAIOutput(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const linked = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  return linked.replace(/\n/g, '<br>');
}

async function fetchJobSuggestions(profile) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: buildPrompt(profile)
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestions returned.';
  return text.trim();
}

function setupJobFinder() {
  const findJobsBtn = document.getElementById('findJobsBtn');
  const clearBtn = document.getElementById('clearBtn');

  findJobsBtn.addEventListener('click', async () => {
    const profile = {
      qualification: document.getElementById('qualification').value.trim(),
      skills: document.getElementById('skills').value.trim(),
      experience: document.getElementById('experience').value.trim()
    };

    if (!profile.qualification || !profile.skills || !profile.experience) {
      setStatus('Fill all fields before finding jobs.', true);
      return;
    }

    setStatus('Finding job matches...');
    jobResults.textContent = 'Loading job suggestions...';

    try {
      const suggestions = await fetchJobSuggestions(profile);
      jobResults.innerHTML = suggestions;
      setStatus('Job suggestions generated successfully.');
    } catch (error) {
      setStatus(error.message, true);
      jobResults.textContent = 'Unable to fetch job suggestions. Please try again.';
    }
  });

  clearBtn.addEventListener('click', () => {
    document.getElementById('qualification').value = '';
    document.getElementById('skills').value = '';
    document.getElementById('experience').value = '';
    setStatus('Form cleared.');
    jobResults.textContent = 'Enter your profile and click Find jobs to generate AI-guided job suggestions.';
  });
}

window.addEventListener('DOMContentLoaded', setupJobFinder);
