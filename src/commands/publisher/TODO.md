## Goals

    [] Create new component based on:
        - use scope based on .env file
        - could have package.json inner?
            - get dependences based on main file? will do tree shaking no problem if have more dependences
            - create commands to build application
            - install dependences? dosen`t need once that we have all dependences from main package.json
            - execute command to build folder
            - add assets and references
            - use builder command
        - if it is a component copy folder and create name of package according directory
        - get next version
        - instructions to user to auth to publish ?
        - add description
        - Increase version number


    [] if some component has a dependence from another component?
        - test reference by creating a istalation into node_modules, on build test if have some references by directory, instead packages
            - use like @scope/folder.component

    [] run tests
        - add tests libraries to dependences


    [] order components deploy according order
    [] how update componets references autommatically?
    [] and self references components?
        [] update first
        [] update next


    [] how user could test?
        - generate a pack and give command to user could install along others projects

Version structure
Major.Minor.Pacth
