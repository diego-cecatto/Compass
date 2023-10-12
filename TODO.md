# Next Goals

[] test cli to generate documentation dist package
[][] initially only get the current components and generate a cache file
[][] get .env main
[][] on execute build command do the build of website
[][] on execute start command start the build folder created at home

# Web Page

[] Change doc generation to react-docgen?
[] Change output file to public
[] Create GraphQL cache
[] format name component
[] live code
[] complex properties
[] default values
[] Breadcrumb
[] clear packages not used
[] SubComponents
[] wait build command
[] remove cache file for components fom code versionating
[] reference on package,json git project address

# README

[] explain how run app
[] create Readme to dev compass
[] explain how to use documentation
[] explain how to configure app

//https://souporserious.com/generate-typescript-docs-using-ts-morph/

# ROADMAP

## WEBSITE DOCUMENTATION

[] Acessiblity
[] dark mode
[] Improve Live Code
https://github.com/remarkjs/remark-lint
[][] use monaco-editor
[][] copy icon
[][] implement linter
[] Will cache at first time to run application
[] Compositions / Variations
[] Improve server with vite + react + graphql

## DOCUMENTATION

[] use react-doc-gen to build documentation
[] Diffrent scopes

            -   bellow scope, you can change scopes by using this part of menu
            -   you can filter components if your list have more than 10 items - OK
        -   main content
            -   on top have nav tabs with secions
                -   overview
                    -   is the documentation
                        -   have sections bellow:
                            -   Title with h1 tag with name of the component and following with the size of the package in a badge
                            -   tags of this component above in a badge layout
                            -   description above
                            -   a example of code
                                -   a default composition code how example and on its right a live view of this code
                                -   if a screen have less than 600 this layout will be one with other ion sequence
                            -   in sequence list all composition of this component
                            -   in sequence have all properties - each property need to have this layout, each property will be one table with a transparent line with tow columns - in the left, at first column one item bellow one in each line: - name - type - default - in the right on the second column - this properties correspondetly of the left column - be separed each propertie with a border-bottom and some marging
                -   preview
                    -   render a default composition first
                    -   list all compositions and render each of one this compositions
                -   dependencies
                    -   build a tree diagram of dependecies in HTML
                    -   if this item in this tree is another component internally should link in the documentation to access this component
                    -   list each dependence and it respective version
                -   all tests cases and its respectives outputs an time to execute
                    -   description in this tests case
                    -   one button to expand details
                        -   when click in this details will show all tests
                            -   time to execute with a clock simbol
                            -   how many times was executed
                            -   last test result with details
                -   code
                    -   show the code of this component
                -   change log
                    -   a history log of all versions of this component
                    -   all items listed in a table
                    -   in the left
                        -   date of this release
                    -   in the right
                        -   version, in a link to component stored version
                        -   name of responsable to release this version
                        -   description attached to release this version
                -   one icon with package icon
                    -   when user clicks here will show one drawer
                        -   should have tabs internally with
                            -   npm
                            -   yarn
                            -   pnpm
                            -   each tab will open a command to install this component
                            -   and bellow one acordion that could be opened
                            -   this title of this have a title "Configure + scope + as Scoped Registry"
                                -   with the struction to install this scope of this component
                -   should be visible ony the items that can be visible with the width of the screen,
                    -   the icons that cant be showed will be visible if the user clicks on the ... icon
                -   should have a badge with the last version and side by side a icon to click and show all others versions released of this component

# FILE STRUCTURE !Need to be updated, and explain it in README

-   models
    -   scopes
    -   version
        -   component
            -   version
            -   date
            -   user
            -   descrption
    -   compositions
        -   name
        -   component
    -   code
        -   code
    -   version
        -   dependencies
    -   tests cases
        -   description
        -   test
            -   time
            -   output
            -   runs
            -   status
            -   description
    -   components
        -   name
        -   version
        -   properties
        -   description
        -   tags
        -   parent
        -   childs
        -   package
        -   dependencies
