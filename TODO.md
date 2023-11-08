# Next Goals

    [] Test components in a different scenarios
    [] only compile in real time file of dependences
    [] npx structure
    [✔️] Create .compassrc
    [✔️][✔️] JSON structure

# CLI

    [] Validate component name
    [✔️] move assets and index.html to build folder
    [✔️] .env does not be created, could map by default src or package folder
    [] command watch to constantly create packages according document is changed and not has error
    [] prod and dev version of start component
    [] support hooks
    [] if none component found show a message to user could understand how configure his documentation library
    [] show tips to publish documentation
    [] create images to some empty state components
    [✔️] not show properties if not exist
    [] show loading with skeleton
    [] support annothers imports into preview area
    [] read compassrc only if it exists
    [] graphql needs to be included
    [] add patterns to be ignore seeok for components
    [] remove one folder when is finded by package.json

# Web Page

    [✔️] Select properly menu item
    [] Each component need to have his own URL
    [] Use rightly component properties
    [] use properly graphql declaration
    [] remove models and use generate models from graphql
    [] Create menu scoped by structure
    [✔️] Menu already opend initaly
    [✔️] documentation link to github portal
    [] Show command to install package
    [] if have packag.json local show local version
    [] and show online version
    [] could update favicon of documentation
    [] could update name of documentation
    [✔️] Show properties
    [] [] Format description
    [] [] Parse React.FC component
    [✔️] [✔️] Default properties
    [✔️] Change doc generation to react-docgen?
    [✔️] Change output file to build
    [] Create GraphQL cache
    [✔️] format name component
    [] remove help icon from prod envirornment
    [✔️] live code
    [] complex properties
    [✔️] default values
    [] Breadcrumb
    [✔️] Clear packages not used
    [✔️] Sub-Components
    [✔️] Build Command
    [✔️] Reference on package.json git project address
    [] you can filter components if your list have more than 10 items
    [✔️] remove footer for properties area

# README

    [✔️] Explain how run app
    [✔️] Update dependences components
    [✔️] Create Readme to dev compass
    [✔️] Explain how to use documentation
    [✔️] Explain how to configure app

# ROADMAP

## WEBSITE DOCUMENTATION

    [] Acessiblity
    [] Dark mode
    [] Improve Live Code (https://github.com/remarkjs/remark-lint)
        [][] Use monaco-editor
        [][] Copy icon
        [][] Implement linter
        [][] Side code and result code, improve layout
    [✔️] Will cache at first time to run application
    [] Compositions / Variations
    [✔️] Improve build with eslint
    [] Local tests
    [] Hot Reloading

## DOCUMENTATION

    [✔️] use react-doc-gen to build documentation
    [✔️] Diffrent scopes
                -   bellow scope, you can change scopes by using this part of menu

            -   main content
                -   on top have nav tabs with sections
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

# COMPONENT Entity model, Need to be updated, and explain it in README

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

## Component finder logic

//todo for each folder
//have package.json?
//yes
//find in each directory bellow the definition of component
//found?
//yes
//add to components
//is main dir?
//yes
//continue finding more components bellow
//no
//discard this folder to be used to asses others components
//no
continue
//no
//others package jsons founded?
//yes
//igonere folders that not have this structure
//no
//continue seeking to folders that have documentation file inner
//have Component.md file?
//yes
//map component
//no
continue

//godfahter
//instructions -> create menu at this same structure
documentation.md -> if this file exist here show at the main component
//godfather
//filter
//datatable
package.json
//other component-> could`t create a compoenent package inner here, if have other package.json here show error, could map others component and show a red error on console.log showing that this component is not be possible be mapped because others main components has
// alerady a package.json and show in menu disabled with a tooltip to user be aware of this problem
//form
