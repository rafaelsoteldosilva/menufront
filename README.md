Markdown cheat sheet
Headings

# Main title

## Section

### Subsection

#### Small subsection

Normal text
This is normal text.
Bold, italic, strikethrough
**bold**
_italic_
~~strikethrough~~
Paragraphs and line breaks
First paragraph.

Second paragraph.
First line.  
Second line.
Horizontal line

---

Unordered list

- Item one
- Item two
- Item three
  Ordered list

1. First
2. Second
3. Third
   Task list

- [x] Done
- [ ] Pending
      Links
      [Google](https://google.com)
      Images
      ![Alt text](./image.png)
      Inline code
      Use `npm install` to install dependencies.
      Code blocks

```bash
npm install
npm start
```

```js
const name = "Rafael";
console.log(name);
```

Quote

> This is a quote.
> Table
> | Name | Role |
> |--------|-----------|
> | Rafael | Developer |
> | Ana | Designer |
> Collapsible section

<details>
  <summary>Click to expand</summary>

Hidden content here.

</details>
Badge
A badge is usually just an image:
![Static Badge](https://img.shields.io/badge/status-active-green)
A clickable badge is an image inside a link:
[![Static Badge](https://img.shields.io/badge/status-active-green)](https://github.com/your-user/your-repo)
Common badge examples
React
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
Django
![Django](https://img.shields.io/badge/Django-Backend-092E20)
PostgreSQL
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1)
Status
![Status](https://img.shields.io/badge/status-in%20progress-orange)
License
![License](https://img.shields.io/badge/license-MIT-blue)
Example badge block for your README
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Django](https://img.shields.io/badge/Django-Backend-092E20)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1)
![Status](https://img.shields.io/badge/status-in%20progress-orange)
Simple README skeleton with badges
# Menu App

![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Django](https://img.shields.io/badge/Django-Backend-092E20)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1)
![Status](https://img.shields.io/badge/status-in%20progress-orange)

Frontend and backend for a digital menu system.

## Features

- Menu visualization
- Category management
- Dish management

## Installation

```bash
npm install
```

## Run

```bash
npm start
```

## Repository

[GitHub Repo](https://github.com/your-user/your-repo)
Most useful constructions for a README
These are the ones you’ll use the most:

# Title

## Section

**bold**

- list item
  [link](https://example.com)
  ![image](./image.png)
  `inline code`

```bash
npm install
npm start
```

---

![Badge](https://img.shields.io/badge/status-active-green)

For a clickable badge, the main pattern is always this:
[![Badge text](BADGE_IMAGE_URL)](TARGET_URL)
That means:
• the image is the badge
• the outer link is where the click sends the user

1. Badge linking to a website
   [![Website](https://img.shields.io/badge/Website-Open-blue)](https://example.com)
2. Badge linking to your GitHub repo
   [![Repo](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/your-user/your-repo)
3. Badge linking to documentation
   [![Docs](https://img.shields.io/badge/Docs-Read-green)](https://example.com/docs)
4. Badge linking to a release page
   [![Release](https://img.shields.io/badge/Release-Latest-orange)](https://github.com/your-user/your-repo/releases)
5. Badge linking to issues
   [![Issues](https://img.shields.io/badge/Issues-Open-red)](https://github.com/your-user/your-repo/issues)
6. Badge linking to pull requests
   [![PRs](https://img.shields.io/badge/Pull%20Requests-View-purple)](https://github.com/your-user/your-repo/pulls)
7. Badge linking to a GitHub Actions page
   [![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blueviolet)](https://github.com/your-user/your-repo/actions)
8. Badge linking to a local section in the same README
   You can make it jump to a section:
   [![Installation](https://img.shields.io/badge/Setup-Installation-blue)](#installation)
   If your heading is:

## Installation

then (#installation) works. 9) Badge linking to an email address
[![Email](https://img.shields.io/badge/Contact-Email-informational)](mailto:you@example.com) 10) Badge linking to WhatsApp or another contact URL
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Chat-25D366)](https://wa.me/1234567890) 11) Several clickable badges together
[![Repo](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/your-user/your-repo)
[![Docs](https://img.shields.io/badge/Docs-Read-green)](https://example.com/docs)
[![Issues](https://img.shields.io/badge/Issues-Open-red)](https://github.com/your-user/your-repo/issues) 12) Using HTML instead of Markdown
You can also do it with HTML:
<a href="https://github.com/your-user/your-repo">
<img src="https://img.shields.io/badge/GitHub-Repository-black" alt="GitHub Repo">
</a>
That helps if you want more control later.
Real options you have
A clickable badge can point to:
• a public website
• your GitHub repo
• releases
• issues
• pull requests
• docs
• a deployment
• a section inside the README
• an email link
• any other valid URL
So the badge itself is not the important part. The real choice is the target URL.
Practical template
Use this and replace the two parts:
[![VISIBLE BADGE](BADGE_IMAGE_URL)](WHERE_IT_SHOULD_GO)
Example:
[![Frontend Repo](https://img.shields.io/badge/Frontend-React-61DAFB)](https://github.com/your-user/your-frontend-repo)
For your project, a good set would probably be badges for:
• Frontend repo
• Backend repo
• Documentation
• Status
• Issues
That looks clean and actually helps navigation.
