# Contributing to `easy-speech`

Thank you for your interest in this project and your aims to improving it.
This guide will give you the most important info on how to contribute properly
in order to get your pull requests accepted.

## Disclose security vulnerabilities

First things first:
This project has strong security implications and we appreciate every help to
improve security.

**However, please read our [security policy](./SECURITY.md), before taking 
actions.**



## Guiding principles

Before contributing to this project it is important to understand how this 
project and it's collaborators views itself regarding it's scope and purpose.

### Web Speech API

This project is based on the Web Speech API standard. Please make sure you
understand the standard and it's basic usage across browsers:

- https://wicg.github.io/speech-api/#tts-section
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis

### Framework agnostic

Design decisions and implementations are always done with keeping in mind, that
there are multiple frameworks out there that could use this project.


## Development

If you want to fix bugs or add new features, **please read this chapter and it's 
sections carefully!**

### No PR without issue

Please make sure your commitment will be appreciated by first opening an issue
and discuss, whether this is a useful addition to the project.

### Work on a bug or a new feature

First, clone and install this project from source via

```bash
$ git clone git@github.com:jankapunkt/easy-speech.git
$ cd easy-speech
$ npm install
```

From here you can run several scripts for development purposes:

```bash
$ npm run test           # runs the tests once
$ npm run test:coverage  # runs the tests including coverage
$ npm run docs:api       # generates the API docs
$ npm run docs:html      # generates the GitHub pages docs
```

To work on a new feature or a fix please create a new branch:

```bash
$ git checkout -b feature-xyz # or fix-xyz
```

### Coding rules

- Linter-pass: the linter must pass
- Unit-testing: all features or bug fixes must be tested by specs
- Documentation: all public API methods must be documented

### Commit message convention

We use a commit convention, inspired by [angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format)
with ticket number at the end of summary:

```
<type>(<scope>): <short summary> #<issue number>
```
Summary in present tense. Not capitalized. No period at the end.
The <type> and <summary> fields are mandatory, the (<scope>) and #<number> field is optional.

### Run the tests before committing

Please always make sure your code is passing linter and tests **before
committing**. By doing so you help to make reviews much easier and don't pollute 
the history with commits, that are solely targeting lint fixes.

You can run the tests via

```bash
$ npm run test
```

or  

```bash
$ npm run test:coverage
```

to see your coverage.

### Open a pull request (PR) 

Once you have implemented your changes and tested them locally, please open
a [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

Note: sometimes a pull request (PR) is also referred to as merge request (MR).

#### Fundamental PR requirements

There are a few basic requirements for your pull request to become accepted:

- Make sure to open your pull request to target the `master` branch
- Make sure you are working on a branch, other than `master`; usually you
  can name the branch after the feature or fix you want to provide
- Resolve any merge conflicts (usually by keeping your branch updated with 
  `master`)
- Have a clear description on what the PR does, including any steps necessary
  for testing, reviewing, reproduction etc.
- Link to the existing issue
- Added functions or changed functions need to get documented in compliance with
  JSDoc
- Make sure all CI Tests are passing

Also make sure, to comply with the following list:

- Do not work on `master` directly
- Do not implement multiple features in one pull request (this includes bumping
  versions of dependencies that are not related to the PR/issue)
- Do not bump the release version (unless you are a maintainer)
- Do not edit the Changelog as this will be done after your PR is merged
- Do not introduce tight dependencies to a certain package that has not been
  approved during the discussion in the issue

#### Review process

Finally your PR needs to pass the review process:

- A certain amount of maintainers needs to review and accept your PR
- Please **expect change requests**! They will occur and are intended to improve
  the overall code quality.
- If your changes have been updated please re-assign the reviewer who asked for
  the changes
- Once all reviewers have approved your PR it will be merged by one of the
  maintainers :tada:
 
#### After merge

Please delete your branch after merge.
