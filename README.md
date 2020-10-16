# [![Blog][logo]][url] Fetch to Markdown

<!-- PROJECT SHIELDS -->
<!--
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
*** See bottom of page for list of reference links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Language grade: JavaScript][lgtm-shield]][lgtm-url]
[![FOSSA Status][fossa-shield]][fossa-url]
[![Maintenance][maintenance-shield]][maintenance-url]
[![David Dependencies Status][dependencies-shield]][dependencies-url]
[![License: MIT][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Twitter: HoukasaurusRex][twitter-shield]][twitter-url]

Fetch markdown content from api and write to files with frontmatter and component appending support.

[Check it out »][product-url]

[Report Bug][issues-url] • [Request Feature][issues-url]

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->
## About The Project

Fetch to Markdown solves a common problem when working with a headless CMS by simply fetching your content at a provided api endpoint and writing to markdown files. It supports writing custom frontmatter and appending component tags to each file.

<!-- GETTING STARTED -->
## ☕️ Getting Started

Usage is simple and assumes a REST api endpoint.

First install the module

```sh
npm install fetch-to-markdown

yarn add fetch-to-markdown
```

Download from a single resource

```js
const { fetchToMarkdown } = require('fetch-to-markdown')

fetchToMarkdown('https://www.cms-backend.com', 'articles' {
  contentDir: 'public' // the directory to write files relative to project root (defaults to 'content')
}),
```

Or from multiple resources at once

```js
const { fetchToMarkdown } = require('fetch-to-markdown')
const contentAPI = 'https://www.cms-backend.com'

Promise.all([
  fetchToMarkdown(contentAPI, 'articles', {
    components: articleComponents,
  }),
  fetchToMarkdown(contentAPI, 'projects', {
    readme: `Write a custom README.md file in the /projects directory`,
  }),
  fetchToMarkdown(contentAPI, 'companies'),
  fetchToMarkdown(contentAPI, 'links'),
  fetchToMarkdown(contentAPI, 'about'),
  fetchToMarkdown(contentAPI, 'landing', {
    components: landingComponents,
    landing: true // writes file
  }),
])

```

## 🤝 Contributing

Want to make a change? Any contributions you make are **greatly appreciated**.

Check out the [issues page][issues-url]

1. Clone the repo
2. Create your Feature Branch (`gco -b release/my-project`)
3. Commit your Changes (`git commit -m 'add: small addition'`)
4. Push to the Branch (`git push origin release/my-project`)
5. Open a Pull Request

<!-- ROADMAP -->
## 🗺 Roadmap

See the [open issues][issues-url] for a list of proposed features (and known issues)

<!-- DEPENDENCIES -->
## 📦 Dependencies

[![FOSSA Status][fossa-scan]][fossa-url]

<!-- ACKNOWLEDGEMENTS -->
## ✨ Acknowledgements

* [Best README Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Img Shields](https://shields.io)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[logo]: https://res.cloudinary.com/jthouk/image/upload/e_improve,w_30,h_30/v1582802259/Profiles/jt-2d.png
[url]: https://www.npmjs.com/package/fetch-to-markdown
[github-url]: https://github.com/HoukasaurusRex
[contributors-shield]: https://img.shields.io/github/contributors/HoukasaurusRex/fetch-to-markdown.svg?style=flat-square
[contributors-url]: https://github.com/HoukasaurusRex/fetch-to-markdown/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/HoukasaurusRex/fetch-to-markdown.svg?style=flat-square
[forks-url]: https://github.com/HoukasaurusRex/fetch-to-markdown/network/members
[stars-shield]: https://img.shields.io/github/stars/HoukasaurusRex/fetch-to-markdown.svg?style=flat-square
[stars-url]: https://github.com/HoukasaurusRex/fetch-to-markdown/stargazers
[issues-shield]: https://img.shields.io/github/issues/HoukasaurusRex/fetch-to-markdown.svg?style=flat-square
[issues-url]: https://github.com/HoukasaurusRex/fetch-to-markdown/issues
[maintenance-shield]: https://img.shields.io/badge/Maintained%3F-yes-green.svg
[maintenance-url]: https://github.com/HoukasaurusRex/houkasaurus/graphs/commit-activity
[dependencies-shield]: https://david-dm.org/HoukasaurusRex/houkasaurus.svg
[dependencies-url]: https://david-dm.org/HoukasaurusRex/houkasaurus
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jt-houk/
[product-url]: https://www.npmjs.com/package/fetch-to-markdown
[lgtm-shield]: https://img.shields.io/lgtm/grade/javascript/g/HoukasaurusRex/fetch-to-markdown.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/HoukasaurusRex/fetch-to-markdown/context:javascript
[fossa-shield]: https://app.fossa.com/api/projects/git%2Bgithub.com%2FHoukasaurusRex%2Ffetch-to-markdown.svg?type=shield
[fossa-url]: https://app.fossa.com/projects/git%2Bgithub.com%2FHoukasaurusRex%2Ffetch-to-markdown?ref=badge_shield
[fossa-scan]: https://app.fossa.com/api/projects/git%2Bgithub.com%2FHoukasaurusRex%2Ffetch-to-markdown.svg?type=large
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
[twitter-shield]: https://img.shields.io/twitter/follow/HoukasaurusRex.svg?style=social
[twitter-url]: https://twitter.com/HoukasaurusRex