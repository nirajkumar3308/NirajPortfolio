from pathlib import Path

file_path = Path('job-finder.js')
text = file_path.read_text(encoding='utf-8')
old = """function buildPrompt(profile) {
  return `You are a job search assistant. Read the candidate profile and suggest 4 suitable jobs with short role titles, matching skills, and why each is a good fit. Provide one link for each job role if a relevant public job posting exists. If you cannot provide a real URL, write [no link available] instead. Keep the response concise and separate each job with a blank line.\n\nQualification: ${profile.qualification}\nSkills: ${profile.skills}\nExperience: ${profile.experience}`;
}
"""
new = """function buildPrompt(profile) {
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
"""
if old not in text:
    raise SystemExit('Old block not found')
new_text = text.replace(old, new, 1)
file_path.write_text(new_text, encoding='utf-8')
print('Patched buildPrompt successfully')
