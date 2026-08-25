# Final Reflection — Weather Briefing MCP (Cirra)

**Duaa Naji | NextFlows MCP Academy, Cohort #1**

---

## Wins

- Owned and shipped two production tools (`search_city`,
  `get_weather_alerts`) end-to-end: schema validation, live/fixture data
  handling, and security hardening.
- Wrote and executed a full manual test plan (8 test cases across happy
  path, invalid input, empty data, and offline scenarios) — all passed on
  first run, with documented evidence for every case.
- Rewrote the project's README from scratch to be genuinely usable by a
  stranger — verified this directly by having a peer clone the repo fresh
  and get a working tool call in under 10 minutes using only the README.
- Diagnosed and fixed a real installation failure (Windows MSIX package
  registration error) that had nothing to do with the project code, just
  to get my own dev environment working — a reminder that "it doesn't
  run" bugs aren't always in your code.
- Resolved multiple git merge conflicts with teammates working on the
  same shared files (test plan, README, example conversations) without
  losing anyone's work — including one conflict git misidentified as a
  binary file due to a leftover encoding issue.
- Verified the project installs and runs correctly from a completely
  fresh clone at the tagged `v1.0.0` release, with screenshot evidence.
- Tested the MCP server live through Claude Desktop (not just Inspector),
  including chaining 7 of 8 project tools in a single natural-language
  request, and confirming the tool-scope security boundary holds — Claude
  correctly refused to touch local files when no file-system tool was
  connected.

## Blockers

- The Claude Desktop installation itself failed repeatedly with a cryptic
  Windows error (`HRESULT 0x80073CFF`) before I even got to write any MCP
  code — took real troubleshooting (registry edits, developer mode,
  reinstalling) just to get a working environment.
- Understanding *why* `search_city` sometimes returned `"country":
  "unknown"` took real investigation — it turned out to be an upstream gap
  in Open-Meteo's live data for specific locations, not a bug in our code,
  and I had to prove that with a side-by-side comparison (Amman vs.
  Ramallah) before I trusted it enough to document it confidently.
- Coordinating documentation changes with two teammates editing the same
  shared files (README, test plan, example conversations) on the same
  branch caused repeated merge conflicts — I learned to always `git pull`
  and check `git status` before pushing, not after.

## Resume Bullet

> Built and shipped two MCP (Model Context Protocol) tools in TypeScript
> with Zod-validated schemas and live/offline fallback handling, as part
> of a 3-person team project; authored the test plan, security
> documentation, and public-facing README (verified via independent peer
> testing), contributing to a publicly released, live-demoed MCP server
> with 8 working tools.

## LinkedIn Draft (optional to publish)

> Just wrapped up 6 weeks with the NextFlows MCP Academy, where I built
> Cirra — a Weather Briefing MCP server that lets AI assistants pull live
> weather data, forecasts, and alerts without leaving the conversation.
> I owned two of the eight tools end-to-end: city search and weather
> alerts, including input validation, live-API/offline-fixture handling,
> and a full manual test suite. Beyond the code, I learned just how much
> "shipping" involves — documentation a stranger can actually follow,
> security thinking about what an AI agent should and shouldn't be able
> to touch, and coordinating git conflicts with a real team on a shared
> codebase. Proud to have this live, publicly tagged, and demoed. 🎉

## One Improvement for the Next Two Weeks

I'd fix the gap we documented but didn't resolve: `get_weather_alerts`
currently can't distinguish an unrecognized city name from an actual API
outage — both silently fall back to fixture data. I'd add a distinct
"city not found" error path so users get an honest message instead of a
misleading fallback response.

---

*Thank you to our mentor for the detailed, specific feedback throughout
— especially catching the README encoding issue and pushing for real
screenshot evidence instead of text descriptions. Both made the final
submission genuinely more solid.*