# Next Goals

    [] implement lerna
    [] create a pattern with lerna + compass
    [] create tests
    [] create images to errors pages
    [] Publish only transpiled files, remove dependence of ts files
    [] [] only compile in real time file of dependences

# CLI

    [] export server to be configured how it is needed
    [] show tips to publish documentation
    [] prod and dev version of start component
    [] []  remove help icon from prod envirornment
    [] command watch to constantly create packages according document is changed - could use a dev command to use nodemon
    [] add patterns to be ignore components
    [] could specify directory of config file

## WEBSITE DOCUMENTATION

    [] is not redirecting to how-to-configure page wn dosent have components
    [] is not parsing components
    [] how package json works with a directory map
    [] show top area if have package.json
    [] create area to show messages
    [] right side to see sections and could navigate accordly section
    [] [] Format description
    [] [] Parse React.FC component
    [] support anothers imports into preview area
    [] Parse changelog
    [] you can filter components if your list have more than 10 items
    [] Improve use of component properties
    [] remove models and use generate models from graphql
    [] complex properties
    [] Create GraphQL cache
    [] Implement redux
    [] graphic of dependences
    [] Menu based on tree-view
    [] Acessiblity
    [] Dark mode
    [] Improve Live Code (https://github.com/remarkjs/remark-lint)
        [][] Use monaco-editor
        [][] Copy icon
        [][] Implement linter
    [] Compositions / Variations
    [] Local tests
    [] Hot Reloading
    [] show image of dependences
    [] fix the top of component to show name and description if not have in MD file, or not found
    [] show tags from package
    [] create documentation to explain how to create a md file, or create a function to do that

## DOCUMENTATION - Hystory mode

    [✔️] use react-doc-gen to build documentation
    [✔️] Diffrent scopes
            -   main content
                - on top have nav tabs with sections
                - could add to right place a navigation container
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
                        [✔️] render a preview of component
                        -   create a composition section
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
                                -  save in cookie a choice of this
                                -   and bellow one acordion that could be opened
                                -   this title of this have a title "Configure + scope + as Scoped Registry"
                                    -   with the struction to install this scope of this component
                    -   should be visible ony the items that can be visible with the width of the screen,
                        -   the icons that cant be showed will be visible if the user clicks on the ... icon
                    -   should have a badge with the last version and side by side a icon to click and show all others versions released of this component

# COMPONENT Entity model, Need to be updated, and explain it in README

    -   models
        -   version
            -   component
                -   version
                -   date
                -   user
                -   descrption
        -   compositions
            -   name
            -   component
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
            -   tags
            -   dependencies
