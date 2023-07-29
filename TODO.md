Web Page

-   format name component
-   cache
-   dark mode

//https://souporserious.com/generate-typescript-docs-using-ts-morph/

    -   will get for each folder will get the component, like if you have a Bradcrumb folder name will get from this repository a Bradcrumb component, will try get from each folder inner there this component
    -   consider export default
    -   consider export const
    -   consider export class
    -   use library to parse components

        -   will extract all properties
        -   in order to mount library will be needed to retrieve the property type of the react component

            -   will extract the default value for each property
            -   will extract the commentary above of each propety to use in the documentation library to mount descriptions

        -   need to be performatic
        -   will work with functional and class components

-   Remove all test dependences
-   Improve server with vite + react + graphql
-   Create documentation file

ROADMAP
what is needed from one component

-   will be stored into src/ui folder
-   need to be integrated with graphql and this integration saved on actions folder
-   to generate documentation
-   should have acessibility
-   have dark mode
-   all styles need be stored in a sass file
-   need to use latest technologies in HTML5
-   should have be responsive and adapt to diffrent resolutions

    -   layout
        -   left has menu menu
            -   menu contains all structure of components and sub-components - OK
            -   top side by side icon and name of documentation - OK
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

-   to generate another version
    -   to test
    -   to publish

API with graphql and apolo server

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
