# Contributing
Hello! Thanks for wanting to contribute. The following document will describe how to contribute, and what guidelines must be followed.

## Table Of Contents
[Issues](#issues)
- [Bug Reports](#bug-reports)
- [Feature Suggestions](#feature-suggestions)

[Pull Requests](#pull-requests)
- [Code Style & Guidelines](#code-guidelines)

[Questions](#questions)

## Issues
Issues must be descriptive, and must thoroughly outline the problem/idea being presented.

### Bug Reports
Bug reports must follow the following format:
```markdown
### Environment Details
**Node:** <!-- Node Version -->
**OS:** <!-- OS name/version -->

<!-- Additional details here (Optional) -->

### Description
<!-- A thorough description of the bug and it's impact -->

### Steps to reproduce
<!-- A detailed list on how to reproduce the bug -->
```
In the steps-to-reproduce field, please try to include a code example as well as the inputs necessary to recreate the bug.

### Feature Suggestions
A feature suggestion, as the name describes, suggests the addition of a new feature.

Feature suggestions must follow the following format:
```markdown
### Problem
<!-- Describe the problem the feature solves -->

### Description
<!-- A thorough description of the proposed feature and it's functionality -->

### Use Case
<!-- A use case for the proposed feature -->
```
Please try to be as detailed as possible in your feature suggestion so it's understood properly.

### Enhancement Suggestions
An enhancement suggestion proposes the modification of an existing feature, system, or document. Enhancement suggestions, unlike feature suggestions, don't propose a new feature (or an extension to a feature).

Enhancement suggestions must follow this format:
```markdown
### Description
<!-- A description of the proposed enhancement and why it should be changed -->

### Use Case
<!-- A use case for the proposed enhancement -->
```

## Pull Requests
todo

### Code Guidelines
The following guidelines should be met when writing code in this project:

- Variables must have clear names
- Use tabs, not spaces
- Avoid using the `var` keyword
- Follow [Crockford Classless](https://gist.github.com/mpj/17d8d73275bca303e8d2)
- Don't modify prototypes
- Keep large or frequently used regexes in `regexes.ts`
- Avoid `let` variables if you're not going to change it's value