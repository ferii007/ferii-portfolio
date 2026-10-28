import { PERSON } from '@/constants/site';

// Recruiter-facing profile for the robot chat: what visitors may learn about Feri beyond what the page shows.
// Adapted from a private profile, keeping only public, work-relevant facts. Never add private details here
// (birthday, age, health, body, finances, salary, address, phone, relationship, daily routine): this repo is public.
// Facts the page already shows (journey, skills, projects) come from their own data files, not from here.
const name = PERSON.firstName;

export const ROBOT_PROFILE = `About ${name}
- Goes by ${name}, Fei or ${PERSON.nickname}. Born and raised in Bandung, Indonesia.
- Speaks Indonesian natively and uses English for technical work.
- Works across backend APIs, web frontends and mobile apps, and likes understanding the whole system rather than just one piece of code.
- Learns best by building real projects: run into the problem, try a fix, find the bug, fix it. Long, passive tutorials are not ${name}'s style.
- Motto: be a little better than yesterday.

How ${name} works
- Likes every decision to come with its reason before the work starts, and explains their own choices the same way.
- Skeptical of claims that haven't been tested; would rather check than assume.
- Prefers simple solutions over overengineering, and thinks about maintainability, security, error handling and testing, not only whether the code runs.

More tools ${name} has used
- Flutter, Sequelize, MySQL, AWS S3, jQuery, REST APIs, JSON Schema with AJV, Nodemailer, Git and GitHub.
- Backend work: authentication and authorization (JWT), API validation, file uploads to S3, soft delete, database relations, Sequelize hooks, error codes, reporting, notifications, email delivery, payment integration, schedulers, logging, search and pagination.

ReBill POS (at Senja Solutions)
- Worked on the backend, frontend and operational features: bills, product and transaction discounts, the customer API, moving bills between cashiers, reservations, kitchen, bar and bill printers, notifications, task scheduling, stock management, payment integration, revenue reports and file storage on AWS S3.
- The newer version: a Flutter mobile app with a Node.js, Sequelize and MySQL backend.

Personal projects
- DokiDo: an Android app for personal money tracking (income, expenses, budget categories and what is left), in Indonesian or English, with Rupiah. Still early; it started because tracking money by hand in a notes app was tedious.
- GrowMe: a concept for a self-improvement app that turns routines into daily quests with time limits, countdowns, notifications, voice guidance and an AI trainer, inspired by character progression in fiction.

Interests
- Artificial intelligence, product development, backend architecture, mobile apps, API and database design, point of sale systems, automation, and apps that solve real problems.
- Outside work: gaming and keeping aquarium fish.

Goals
- Keep growing as a software engineer, especially in backend and mobile development.
- Build apps that real people use, and eventually ${name}'s own digital products.`;
