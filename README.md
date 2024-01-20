# Compass -> Docmate

Docmate is an open-source project designed to automate the generation of documentation for React components. It offers a convenient way to create a Single [Single Repository](https://www.accenture.com/us-en/blogs/software-engineering-blog/how-to-choose-between-mono-repo-and-poly-repo) for your components, streamlining your development workflow. While currently supporting TypeScript, Docmate's roadmap includes plans to incorporate JavaScript support in the future.

## Quikstart

Getting started with Docmate is easy. Begin by installing the package:

    npm install Docmate-docgen --save-dev

Next, install the necessary dependencies:

    npm install @emotion/react @emotion/styled @mui/icons-material @mui/material react react-dom typescript --save-dev

In your package.json file, add the following command to start Docmate:

    "start": "Docmate start"

Specify the folder containing your components using the SCOPE variable in your .Docmaterc file:

    {
        "$schema": "node_modules/lerna/schemas/lerna-schema.json",
        "port": "packages",
        "dir": "src/examples"
    }

Run Docmate from the command line:

    npm run start

## What the stage to be ready ?

Docmate is currently in an advanced stage of development, with several key features already implemented:

    Mapping components: ✔️
    Documentation Website: Almost done ✨
    Command-Line Interface (CLI): ✔️
    Stable Version: Almost done ✨

## Future Roadmap

Docmate is continuously evolving. Here's a glimpse of what's in store for the future:

    Include tests in the project
    Develop the Docmate website for enhanced user experience
    Enable auto-release functionality
    Implement automated tests
    Publish versions with automatic creation and publication of components in Artifactory
    Add support for JavaScript components
    Enhance the official Docmate website with detailed documentation and resources

## Why Docmate

Docmate stands out because it's:

-   Ready to Go: Docmate is designed to minimize setup hassles, ensuring you can get started quickly.

-   Simplicity and Intelligence: Built with simplicity and user-friendliness in mind, Docmate offers a smarter approach to component documentation and management.

Embark on your React component documentation journey with Docmate, the tool designed to simplify and enhance your development process.

The existence of this projects is because I have some experience with others products in the market and this project was builded to create one tool more simple and smart.
