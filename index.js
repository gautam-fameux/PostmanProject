const { Octokit } = require("@octokit/rest");
const fs = require("fs");




async function PushCodeToRepo(repoOwner, repoName, filePath, commitMessage) {
    try {


        const fetch = (await import('node-fetch')).default;

        const octokit = new Octokit({
            auth: "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",
            request: {
                fetch: fetch, // Pass the fetch implementation
            },
        });

        const content = fs.readFileSync(filePath, 'utf8');
        const branchName = "main";
        const { data: { default_branch } } = await octokit.repos.get({
            owner: repoOwner,
            repo: repoName
        });

        await octokit.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: commitMessage,
            content: Buffer.from(content).toString('base64'),
            branch: branchName
        })

        console.log("Code pushed successfully!");
        
    } catch (error) {
        console.error("Error pushing code:", error);
    }
}


async function deleteRepo(repoOwner, repoName) {
    try {

        // Check if the repository exists
        const response = await octokit.repos.get({
            owner: repoOwner,
            repo: repoName
        });


        // If the repository exists, proceed with deletion
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
        
        await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            private: false
        })    

console.log("Repository created successfully!");

} catch (error) {
    console.error("Error creating repository:", error);
}
}


// Usage example
const repoOwner = "gautam-fameux";
const repoName = "PostmanProject";
const filePath = "index.js";
const commitMessage = "Initial commit";

PushCodeToRepo(repoOwner, repoName, filePath, commitMessage)
  .then(() => {
    return deleteRepo(repoOwner, repoName);
})
  .then(() => {
    return createRepo(repoName);
})
.catch(error => {
    console.error("Error:", error);
});