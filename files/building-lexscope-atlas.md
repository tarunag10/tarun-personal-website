# Building LexScope Atlas: What Shipping a Regulatory Triage Tool Taught Me

**Category:** Product · Legal Tech
**Date:** March 2025
**Reading time:** 10 min

---

The hardest decisions in LexScope Atlas were not technical. They were about how much to trust the user, how much to hard-code, and when a confidence score becomes more dangerous than no score at all.

---

## What LexScope Atlas Does

LexScope Atlas is a regulatory applicability triage tool. You input a company profile — jurisdiction, industry, size, product type, entity type, revenue, monthly active users — and a date, and it tells you which regulations in a configurable catalog apply to that profile, with a confidence score and a per-dimension explanation of why.

The motivation was simple: early-stage and mid-market companies routinely mis-scope their regulatory obligations. A UK-based B2B SaaS company with 15 employees and no EU operations does not have the same GDPR obligations as a consumer-facing platform processing 5 million EU data subjects. But when founders search for compliance guidance, they get the same generic answers regardless of their actual profile.

LexScope was an attempt to build something that at least asked the right questions before answering.

## The Rule Design Problem

The first real design decision was how to represent regulatory rules in a way that was expressive enough to be useful but simple enough to be maintainable by a non-developer.

The initial instinct was to use a structured JSON schema with nested conditions. This worked, but it produced rules that were opaque — a compliance professional who wanted to add a regulation to the catalog had to understand the schema to do so. That defeated much of the purpose.

The solution was a layered approach: a seed catalog of hard-coded base rules, an auto-import layer for programmatically generated rules, and a local admin import that accepted a simplified JSON or CSV format. The admin layer did most of the translation work internally, converting user-friendly inputs into the engine's native rule format.

> The lesson: the interface that matters most is not the one users see. It is the one through which your data enters the system. If that interface is hard to use, your data will be wrong.

## Version-Aware Evaluation and Time Travel

Regulations change. GDPR has been amended. The UK GDPR diverged from EU GDPR post-Brexit. Thresholds shift. New rules are added. An applicability tool that gives you the current state of a regulation is only useful if you are always asking about right now.

The time-travel feature — evaluating applicability "as of" a specific date — required the rule structure to support versioning. Each regulation in the catalog can have multiple versions, each with its own effective date and optional repeal date. The engine selects the version active on the requested date before running the evaluation.

This sounds straightforward but produced several edge cases. What happens when a regulation is repealed and replaced by a successor? What about transitional provisions? The current implementation handles the common cases but acknowledges the hard ones by flagging uncertainty rather than suppressing it.

## Confidence Scores: Useful or Dangerous?

The confidence score feature was the most contentious design decision. The idea was that a binary "applicable / not applicable" output was too crude — real regulatory analysis always involves uncertainty, and showing that uncertainty is more honest than hiding it.

The risk is that a 73% confidence score on a GDPR applicability determination looks authoritative. A non-lawyer reading it might treat it as a reliable probability. It is not — it is a heuristic based on how many of the assessment dimensions matched, weighted by their relative importance in the rule definition.

The mitigation was threefold. First, a persistent disclaimer that the tool is "scope triage only" and not legal advice. Second, the per-dimension explainability display, which shows exactly which factors contributed to the score so the user can see the reasoning rather than just the number. Third, the export formats — JSON and CSV — which are designed for use by practitioners who will apply judgment to the output, not by end users making decisions based on it alone.

## What I Would Do Differently

The catalog seeding process was underestimated. Writing accurate rule definitions for 30+ regulations across multiple jurisdictions took longer than building the engine. Each rule required research into the actual statutory text, threshold values, and exemption conditions. Some of that research is still being corrected in subsequent updates.

A better approach would have been to launch with five well-researched rules and iterate, rather than shipping thirty rules at varying quality levels. The user sees thirty rules and assumes they are all equally reliable. They are not.

The other thing I would do differently is the mobile experience. The tool was designed desktop-first because the expected user was a compliance professional working at a screen. The form is dense. The results panel is wide. On mobile it degrades. That was a deliberate trade-off at the time; in retrospect it was the wrong one.

## What It Taught Me About Legal Product Design

The hardest part of building a legal tool is not the legal knowledge or the engineering. It is calibrating how much authority to grant the output. Legal professionals are trained to distrust outputs they cannot fully audit. Non-legal users are inclined to over-trust them.

Every design decision in LexScope — the confidence scores, the dimension breakdowns, the disclaimer text, the export formats — was an attempt to navigate that calibration. The tool should be useful enough to justify using, humble enough to prevent over-reliance, and transparent enough that a qualified professional can check the reasoning. Whether it got that balance right is something I am still learning from the usage data.

---

*This article represents personal views only and does not constitute legal advice.*
