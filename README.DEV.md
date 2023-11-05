## Quikstart

Getting dev with Compass is easy. Begin by installing the necessary dependencies:

    npm install @emotion/react @emotion/styled @mui/icons-material @mui/material react react-dom typescript --save-dev

Specify the folder containing your components using the SCOPE variable in your .compassrc file:

    {
        "$schema": "node_modules/lerna/schemas/lerna-schema.json",
        "port": "packages",
        "dir": "src/examples"
    }

Run Compass from the command line:

    npm run dev
