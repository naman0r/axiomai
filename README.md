## axiomai.space: resesign from EduGenie, why and how:

## Immediate dev tools and what to work on:

- excalidraw for infra visualization: https://excalidraw.com/#room=56c1847c91cd2396fc4f,5RTMmRWJ8iYx9fSfrJZI5g
-

<hr/>

Database: Supabase
ORM: Prisma
Auth: Clerk
Backend: Express.js + TypeScript
Frontend: Next.js + TypeScript + Tailwind
Validation: Zod
State Management: React Query + Zustand
Testing: Jest

- backend only approach (traditional): frontend remains 'dumb'

- I wanted to redesign the infrastructure of EduGenie and rebrand it to be a more scalable project, and focus a lot on design rather than just stringing everything together. Here is what I want to do:

  1. Retain original UI/UX from EduGenie.
  2. Key features:

  a. genies: a chat thread. use OpenRouter and allow user to pick the AI model they want to use.

  - have in-thread Resource generation capabilities (Videos, MindMaps, flashcards, create a google calendar event, etc.)
  - have a usable UI/UX design
  - scale in a way we can deploy really easily.
    b. Connection with Canvas LMS API and Google Calendar API (done for edugenie, can work on intergrating more use cases after thinking)
  - be able to pull courses, tasks, and assignments from canvas
  - be able to integrate with Google Calendar API
    c. Social aspect: be able to share class pages with friends, be able to customize their class pages to their liking (like Notion)
    d. Credit-based usage: each AI utility cots credits, user can buy credits or can purchase premium after free tier runs out.

  * and more that I have to think about and verbalize, but most of this is complete in EduGenie.

What to focus on:

- really good design
- solidify tech stack: (NextJs+ flask; or t3 tech stack, or Express + Next or just plan React + fastAPI with websockets)
- follow OOD principles of good design, segregation, abstraction, etc.)
- Build something useable, that is built intelligently and can be shipped early to mid fall 2025.

## what the helly:

**technologies to use**:

- Upstash (simple rate limiting instead of having to )
- openrouter (AI API marketplace)
-
