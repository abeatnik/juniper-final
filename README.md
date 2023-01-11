# todotada – a project-management tool 

## Overview

Trello-like web-application for planning and managing projects, where users can create single or group workspaces to manage tasks and communicate with each other


start page
<img width="1438" alt="todotada start page" src="https://user-images.githubusercontent.com/85366963/204348612-733b9b97-235b-4492-be87-db2f3d5699d6.png">

<br>

example of a board overview
<img width="1439" alt="Screenshot 2022-11-28 at 19 06 47" src="https://user-images.githubusercontent.com/85366963/204349273-f65fb260-d1f1-45c4-80c0-d4563bb90d51.png">

<br>


This project was my final project for completing the bootcamp at SPICED Academy. 
I wrote the code for this project almost entirely within one week.

## Features 

- Login with GitHub (via NextAuth)
- overview of personal boards
- create and rename single or shared workspaces (boards)
- create and rename lists (stacks) of cards 
- create, update, move or delete cards with title, description (optional), link (optional), and assigned person (optional) - all editable content via double-click
- cards can be moved to another stack via the options menu or via drag and drop (react-beautiful-dnd)
- cards can be reorganized in the current stack via drag and drop (changes get lost upon refresh)
- see link previews of links that are attached to cards (with Puppeteer)
- add comments to cards that are visible for all board members
- see board members or add new members via an invitation code / join boards via an invitation code

- communicate with other board members via the live board chat (with Socket.io)
- new unread messages add a notification badge to the board chat icon in real time 


## Technology Stack 

- Next.js / NextAuth / react-beautiful-dnd / Puppeteer / Socket.io
- TypeScript 
- CSS 
- Prisma 
- PostgreSQL

## To Do & ideas for future features
- add redux state management to simplify the interactions between the different components
- basic refactoring and clean-up 
- add more options to the cards: add deadline, add to-do list, archive card 
- add search function for board content 
- option to link a board to a GitHub repository with the possibility to create cards that refer to commits or pull requests
- indicate whether a board member is currently online
- deployment 




<br>

---
