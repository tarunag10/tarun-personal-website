# Shipping 15 Products in a Year While Working as a Lawyer

**Category:** Product · Indie Building
**Date:** February 2025
**Reading time:** 9 min

---

The most common question I get is how. Here is an honest account of the stack, the time, the trade-offs, and the one decision that would have saved three months of wasted context-switching.

---

## The Honest Version of the Numbers

Fifteen products in a year sounds more impressive than it is. Several are simple single-page tools — a calculator, a static dashboard, a basic form handler. Four or five are meaningfully complex applications with real functionality. Two have paying users or are on track to. The rest exist, are deployed, and are at various stages of something between proof-of-concept and neglected MVP.

Shipping fifteen things is not the same as building fifteen good products. But it taught me more about product development than I learned in two years of reading about it, and it produced a portfolio that has opened conversations that nothing else would have.

## The Stack

Everything runs on Vercel. The frontend is almost always Vite + React or Next.js, depending on whether I need SSR. Tailwind for styling — not because I think it is the best CSS approach, but because it is fast for solo building. Supabase for anything that needs a database and auth. The Anthropic and Groq APIs for AI features, with Groq as the default for latency-sensitive applications because the free tier is genuinely fast.

For domains: anything that needs to feel like a real product gets a custom domain via Vercel's interface. Everything else lives on `.vercel.app`.

This stack has one property that matters above all others for solo development: the feedback loop is fast. From idea to deployed URL is typically under two hours if the idea is simple. For more complex projects, I can have something testable in a day. That speed compounds — ideas that would have been abandoned under a slower build process get tested and either validated or killed quickly.

## Where the Time Actually Goes

Legal work is not nine-to-five but it is not predictably scheduled either. The reality of building alongside a senior in-house role is that the building happens in carved-out pockets: early mornings, occasional evenings, weekends when nothing urgent is in flight.

Most products got between eight and twenty hours of focused time. The more complex ones — LexScope Atlas, SQEasy — got considerably more, but spread over months rather than concentrated sprints.

The time sink that catches solo builders is not the building. It is the decision-making. Every product requires hundreds of small decisions — what to include, what to cut, how to handle edge cases, whether to fix a bug now or ship and iterate. When you are the only person making those decisions, and you are also handling a complex contract redline at the same time, the context-switching cost is high.

## The Decision That Would Have Saved Three Months

The biggest mistake was not deciding earlier what each product was *for*. Not what it did — what it was *for*. Who was the user, what was their problem, what would make them come back.

Several products I built were technically interesting and practically purposeless. I built them because the technical challenge appealed or because I had a vague sense there was a use case. None of them went anywhere. The time spent on them was not wasted in the sense that I learned things — but it was wasted in the sense that I could have spent it on the products that actually had legs.

The products that have found traction — LexScope, SQEasy, the GDPR tooling — all share one property: I built them because I had personally experienced the problem they solve. LexScope came from the frustration of spending forty minutes researching which regulations applied to a client's product profile. SQEasy came from my own SQE1 preparation. The GDPR tools came from my Article 22 research.

> Build from pain, not from interest. Interest sustains the first weekend. Pain sustains the product through the ugly months when you are fixing bugs nobody has thanked you for fixing.

## What AI Changed

The honest answer is: a lot. Claude and Cursor have compressed the implementation time for features that previously would have required either more experience than I had or more time than I could allocate. I can move faster through unfamiliar parts of a stack. I spend less time on boilerplate. I catch more bugs before they ship.

What AI has not changed: product judgment, user understanding, the quality of the ideas, and the grinding work of thinking through edge cases. Those are still the hard parts, and they are still slow.

The risk I am aware of is building things faster than I am learning from them. Speed is only an advantage if you are moving in the right direction. The projects where I slowed down and thought carefully about the product problem before building produced better outcomes than the ones where I started coding immediately.

## What I Would Tell Someone Starting This

Pick one thing and make it genuinely good before starting the next one. I did not do this, and it shows in the portfolio — there are several products that are clearly 80% done, where twenty more hours would have transformed them from "functional demo" to "product someone would pay for."

Deploy everything publicly from day one. The discipline of having something live that people might stumble across changes how you build. You make different decisions when the code is public than when it is sitting in a private repository.

And if you are building legal tools: the legal knowledge is your competitive advantage. Most people building in this space are engineers who learned some law. You know the law, and you can learn enough engineering. That asymmetry is worth more than it looks.

---

*This article represents personal views only and does not constitute legal advice.*
