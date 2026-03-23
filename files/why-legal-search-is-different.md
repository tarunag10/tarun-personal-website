# Why Legal Search Is a Different Problem Than Enterprise Search

**Category:** AI · Search
**Date:** August 2024
**Reading time:** 14 min

---

Generic RAG pipelines fail legal search not because the technology is wrong, but because the problem specification is wrong. Legal search has properties that require different architecture from the ground up.

---

## The Standard RAG Assumption

Most AI-powered search systems — whether enterprise knowledge bases, document repositories, or research tools — share a core architecture: chunk documents, embed them, store in a vector database, retrieve semantically similar chunks on query, and pass them to a language model for synthesis.

This works well for many domains. It works poorly for legal research, and the failures are not random. They cluster around properties of legal text and legal reasoning that are fundamentally different from the documents that enterprise search was designed for.

## Property 1: Authority Hierarchy

A statute overrides a regulation. A regulation overrides guidance. A Supreme Court decision binds lower courts. A High Court decision does not bind another High Court but has persuasive weight. A 2024 judgment that interprets a 1996 statute changes how the 1996 statute should be read, retroactively.

Standard vector search has no concept of authority. It retrieves the most semantically similar chunks, which might be a law review article, a government guidance note, and a binding judgment — all with equal weight. A practitioner reading those results would instantly know to weight them differently. The system does not.

A legal search system needs a defined authority hierarchy and the ability to filter or weight results by their position in that hierarchy. This is not a nice-to-have; it is the difference between a tool that helps and one that misleads.

## Property 2: Temporal Sensitivity

The law is not a static corpus. Statutes are amended. Regulations are repealed. Case law evolves. A provision that was good law in 2019 may have been overruled by 2023. An enterprise knowledge base can usually tolerate documents being a few months out of date. A legal research tool cannot.

More subtly: the temporal question in legal search is often not "what is the current law" but "what was the law on date X." Contract disputes, historical compliance assessments, and retrospective due diligence all require the ability to query the state of the law at a past point in time. Standard search systems have no concept of temporal provenance in this sense.

## Property 3: Jurisdictional Scope

EU GDPR and UK GDPR are not the same regulation. California CCPA and Virginia CDPA are not the same statute. Indian arbitration law and English arbitration law share terminology but reach different outcomes on the same facts.

A legal search system that does not scope results by jurisdiction will surface US case law in response to a UK legal question, or EU guidance in response to a query about Indian law. For users who know the domain, this is noise. For users who do not, it is actively dangerous.

Jurisdictional filtering is not simply a metadata tag on documents. Many legal questions are cross-jurisdictional by nature — a contract dispute involving parties from different countries may require simultaneous analysis of multiple legal systems. The system needs to handle both "retrieve only UK sources" and "retrieve sources from all relevant jurisdictions and label them" queries correctly.

> The jurisdictional problem is compounded by the fact that legal text often does not self-identify its jurisdiction clearly. Embedding jurisdiction as document metadata requires editorial work at ingestion time, which generic chunking pipelines do not perform.

## Property 4: Semantic Precision

Legal language is precise by design. "Reasonable" and "reasonably practicable" are different standards with different legal consequences. "Shall" and "may" have distinct legal meanings that courts examine closely. "Including" may or may not be exhaustive depending on context and jurisdiction.

Vector embeddings are trained to identify semantic similarity, which collapses many of these distinctions. A search for cases interpreting "reasonable" will surface cases about "reasonably practicable" because the words are semantically close. For many domains, that is the right behaviour. For legal research, it can produce wrong answers.

This does not mean vector search is useless for legal text. It means it needs to be combined with structured querying capabilities — the ability to search by defined legal concepts, statutory references, case citations, and specific terms of art — rather than replacing them.

## What a Better Architecture Looks Like

A legal search system built for these properties would combine several things that generic RAG does not.

**Structured source metadata.** Every document in the corpus should have machine-readable jurisdiction, authority level, effective date, and subject matter classification. This is editorial work, but it is load-bearing.

**Authority-weighted retrieval.** Retrieved chunks should be ranked not just by semantic similarity but by the authority level of the source. Binding precedent should surface above persuasive authority; primary sources above commentary.

**Temporal filtering.** The system should support both current-state queries and point-in-time queries, with the ability to filter the corpus to documents effective on a given date.

**Citation graph awareness.** Legal documents cite each other. A judgment that is overruled by a later case should not be returned as good law. This requires maintaining a citation graph and checking overruling status at query time — something no generic RAG pipeline does.

## Why This Has Not Been Built at Scale

The honest answer is that it is expensive. Building the structured metadata layer alone requires significant editorial investment for each jurisdiction covered. Maintaining a citation graph requires ongoing updates as new cases are decided. The resulting system is defensible but narrow — a deep legal research tool for a specific jurisdiction rather than a general search product.

Most legal AI products have made the opposite trade-off: broad coverage, lower precision, and a disclaimer that the output requires expert review. That is a legitimate product decision. But it means the tools currently marketed as "AI legal research" are mostly useful for drafting assistance and initial orientation, not for the precision work that legal research actually requires.

The gap between what these tools claim to do and what they actually do is a reliability problem. Building tools that are honest about their limitations — and architecturally designed to minimise the failure modes specific to legal reasoning — is harder, but it is the right target.

---

*This article represents personal views only and does not constitute legal advice.*
