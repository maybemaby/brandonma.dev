---
title: Thoughts on Software Development from a Manufacturing Engineer
publishedAt: 2025-05-12
previewText: PostGIS is a PostgreSQL extension that adds features for storing, indexing, and querying geospatial data. It's pretty nice that you can get these features in Postgres which is already a powerful database. I couldn't find much
metaDescription: Manufacturing engineer reflects on software development.
draft: true
---

## My Background

I've enjoyed writing bits of mostly personal software for several years now. My day job has very little to do with software, I work as a Manufacturing Engineer on a mechanical focused team. I squeeze in Python for data analysis tasks when I can, but that's about it. I started learning Python around 2020 as a way to add to my resume during a time when most companies were learning how to go remote and hesitant to hire junior engineers. I started by reading Automate the Boring Stuff with Python by Al Sweigart. I'm not sure it helped land my first job, but I still write and learn software as a hobby years later.

As part of my hobby, I've read a good amount of blog posts and opinions about the general state of software development. Most of them are from people who write software professionally or aspire to. I can provide a slightly unique perspective of someone outside the industry who has invested a significant amount of time in the space. I've also built up a lot of thoughts on comparisons with my own industry.

## Open Source

I'll start by recognizing the issues of open source are widely documented and unfortunately common. Underpaid and overworked maintainers, entire ecosystems reliant on obscure packages, rugpulled licensing, and abuse by corporations are just the start. The system is far from perfect and relies on the good will of many entities whose main interest are not morality.

The benefit to learning and education is enormous. Being able to hop into "production ready" codebases used by companies of all sizes gives interested learners an insight into the industry. It's rare to get that kind of insight in physical engineering, without working at a company, paying for training, or reading texts that discuss the concepts without seeing real-world implementation. While open source does not equal free, I doubt the endless free resources available would exist without the culture of open source.

## AI

## Debugging

Debuggers are amazing tools most software developers probably take for granted. Being able to access most internal parts of a system you are troubleshooting in a granular, instant, and interactive manner is a superpower. With a debugger, the main blockers to go from problem to solution are time and motivation.

If I want to troubleshoot something on the manufacturing floor, I frequently have to work around a matrix of factors.
  - I need to coordinate with people to prioritize production.
  - I might need tooling/material that costs significant sums of money or takes time to arrive.
  - The part of the system I troubleshoot may rely on other parts of the system that make it difficult to isolate.
  - The area of the machine I need to look at may be physically difficult to acccess.
  - The system probably integrates parts from a variety of vendors, which we have limited information on.

I'm sure there are parallels in software like integrating closed-source APIs from vendors, but generally debuggers are a magical invention I wish there was an equal to in physical engineering.

## Documentation

The culture and tooling surrounding documentation in software makes it so much easier to tackle new libraries, topics, and programming languages. It's practically a requirement for a widely used piece of software to have decent documentation. The FOSS options are plentiful and there are many products in this field as well. It's not solely for the reader either, a lot of the work centers around making it easier for the writer.

For physical engineering, your options are not so plentiful and likely provide no integration between formats. You'll probably be juggling some amalgamation of Word documents, Powerpoints, Excel sheets, engineering drawings, PDFs, and you'll be happy if there's any documentation at all. The files will probably be stored across a variety of storage locations like OneDrive, one or more PLM systems, SharePoints, and some proprietary internal system. You will not be able to search by the contents of the file so you'll have to know the name of the document or ask a coworker: "hey do you know if there's a document for this one thing I'm working on?" I've found that coworkers end up being the best search indexes sometimes.

Some of this can be company-specific issues, but the culture and tooling have a long way to go in physical engineering.

## Testing

## Compensation

## Closing Thoughts

This post ended up being mostly about aspects of software engineering that physical engineering can learn from. There are aspects of my industry that software engineering could likely learn from, but it is a bit harder for me to make those comparisons since I don't have professional experience in software. Could be something worth covering in another post.
