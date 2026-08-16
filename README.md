# SVNIT First Year Helpdesk

A student helpdesk website for first-year students at Sardar Vallabhbhai National
Institute of Technology (SVNIT), Surat, plus **CodersRank** — a competitive
programming sub-site with resources, a curated problem set and live contest
countdowns.

**Live:** https://svnit-first-year-helpdesk.vercel.app

## Run locally

```bash
npm run dev
```

Then open the URL printed in the terminal (defaults to http://localhost:3000/,
falling back to the next free port if 3000 is taken).

`server.js` is a small zero-dependency static file server used for local
development only. Vercel serves the files directly in production.

## Project structure

```
.
├── index.html                      # Homepage (served at /)
├── studymaterial.html              # Study material for first-year subjects
├── contact.html                    # Registration form
├── contactus.html                  # Contact details, campus map, directions
│
├── home.htm                        # CodersRank: what/why competitive programming
├── resources.htm                   # CodersRank: DSA sheets, platforms, guides
├── bugabooset.htm                  # CodersRank: curated CSES problem set
├── contests.htm                    # CodersRank: live contest countdowns
├── signup.htm                      # CodersRank: registration form
│
├── assets/
│   ├── css/                        # All stylesheets
│   │   ├── second.css              #   -> index, studymaterial, homepage copy
│   │   ├── stylesheet.css          #   -> all CodersRank pages
│   │   ├── contact.css             #   -> contact.html
│   │   └── contactus.css           #   -> contactus.html
│   ├── images/                     # All images (logos, gallery, backgrounds)
│   └── docs/                       # Student notice PDFs
│
├── server.js                       # Local dev server (not used in production)
├── vercel.json                     # Static-site deploy config
└── .vercelignore
```

Paths are relative, so the stylesheets reach images with `../images/...` and the
pages use `assets/images/...`.

## Notes

- `contests.htm` refreshes its Codeforces table from the official Codeforces API
  on page load, and falls back to the verified static rows if that request
  fails. Countdowns are driven by `data-start` unix epochs, so they display
  correctly in any timezone.
- Deploys are connected to this GitHub repository, so pushing to `main` updates
  the live site automatically.

---

Designed & developed by **Priyanshu Kumar** (I22MA017), Department of
Mathematics, SVNIT Surat.
