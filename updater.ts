// Import necessary modules
import fs from 'fs-extra';
import { exec } from 'child_process';
import { SingleBar, Presets } from 'cli-progress';

// Define the function to update dependencies
const updateDependencies = async () => {
    try {
        // Read the package.json file
        const packageJsonContent = await fs.readFile('package.json', 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);

        // Get a list of all dependencies and devDependencies
        const allDependencies = Object.keys(packageJson.dependencies || {});
        const allDevDependencies = Object.keys(
            packageJson.devDependencies || {}
        );
        const totalUpdates = allDependencies.length + allDevDependencies.length;

        // Create a loading bar
        const progressBar = new SingleBar(
            {
                format: 'Updating dependencies |{bar}| {percentage}% | ETA: {eta}s | {value}/{total}',
                clearOnComplete: true,
                hideCursor: true,
            },
            Presets.shades_classic
        );

        progressBar.start(totalUpdates, 0);

        // Function to update a single dependency or devDependency
        const updateDependency = async (dependency: string, dev: boolean) => {
            return new Promise((resolve, reject) => {
                const command = `npm install ${
                    dev ? '--save-dev' : '--save'
                } ${dependency}@latest --legacy-peer-deps`;
                exec(command, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        progressBar.increment();
                        resolve(true);
                    }
                });
            });
        };

        // Update all dependencies
        for (const dependency of allDependencies) {
            await updateDependency(dependency, false);
        }

        // Update all devDependencies
        for (const devDependency of allDevDependencies) {
            await updateDependency(devDependency, true);
        }

        progressBar.stop();
        console.log('Dependencies updated successfully!');
    } catch (error) {
        console.error('Error updating dependencies:', error);
    }
};

// Call the function to update the dependencies
updateDependencies();
