# Contributing

The following document will describe how to contribute, and what guidelines must be followed.

## Issues

**Before creating an issue, check to see if a similar issue has already been submitted.** If a duplicate issue is created then it will be marked as duplicate and closed. When creating an issue, thoroughly describe the problem or idea being presented for clarity.

Issue templates may be found when creating an issue. If you have any questions then feel free to submit a question issue!

## Pull Requests

A pull request template can be found upon making a PR, make sure to follow the code guidelines.

### Code Guidelines

The following guidelines should be met when writing code for this project:

-   Variables must have clear and understandable names
-   Run formatter before commiting code
-   Avoid using legacy features such as the `var` keyword
-   Follow [Crockford Classless](https://gist.github.com/mpj/17d8d73275bca303e8d2)
-   Don't modify object prototypes
-   Keep large or frequently used regexes in `regexes.ts`
-   Default to `const` variables unless a variable must be changed
-   Don't add dependencies
