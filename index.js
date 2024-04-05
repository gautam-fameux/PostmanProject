const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

async function PushCodeToRepo(repoOwner, repoName, directoryPath, commitMessage) {
    try {
        const { default: fetch } = await import("node-fetch");
        const { Octokit } = await import("@octokit/rest");

        const octokit = new Octokit({
            auth: "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",
            request: {
                fetch: fetch
            }
        });

        const filePath = path.join(directoryPath, 'index.js');
        const content = fs.readFileSync(filePath, 'utf8');
        const branchName = "main";

        const { data: { default_branch } } = await octokit.repos.get({
            owner: repoOwner,
            repo: repoName
        });

        const { data: existingFile } = await octokit.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: 'index.js',
            ref: branchName // Specify the branch where the file exists
        });

        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: 'index.js',
            message: commitMessage,
            content: Buffer.from(content).toString('base64'),
            branch: branchName,
            sha: existingFile.sha // Include the SHA hash of the existing file
        });

        console.log("File index.js pushed successfully!");

    } catch (error) {
        console.error("Error pushing code:", error);
    }
}

async function deleteRepo(repoOwner, repoName) {
    try {
        const octokit = new Octokit({
            auth: "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",
            request: {
                fetch: fetch // Pass the fetch function directly
            }
        });

        const response = await octokit.repos.get({
            owner: repoOwner,
            repo: repoName
        });

        if (response.status === 200) {
            await octokit.repos.delete({
                owner: repoOwner,
                repo: repoName
            });

            console.log("Repository deleted successfully!");
        } else {
            console.log("Repository does not exist.");
        }

    } catch (error) {
        console.error("Error deleting repository:", error);
    }
}

async function createRepo(repoName) {
    try {
        const octokit = new Octokit({
            auth: "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",
            request: {
                fetch: fetch // Pass the fetch function directly
            }
        });

        await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            private: false
        });

        console.log("Repository created successfully!");

    } catch (error) {
        console.error("Error creating repository:", error);
    }
}

// Usage example
const repoOwner = "gautam-fameux";
const repoName = "PostmanProject";
const directoryPath = "E:\\nodejs\\12 login project with postman"; // Use double backslashes in the path
const commitMessage = "Initial commit";

PushCodeToRepo(repoOwner, repoName, directoryPath, commitMessage)
    .then(() => {
        return deleteRepo(repoOwner, repoName);
    })
    .then(() => {
        return createRepo(repoName);
    })
    .catch(error => {
        console.error("Error:", error);
    });
