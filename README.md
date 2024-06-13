# github-ci-cd

Learnt and implemented github ci-cd by hosting small node js backend on aws.

how to implement ci cd:- 


Implementing CI/CD with GitHub Actions for an application deployed on an AWS EC2 instance involves several steps. Here, I’ll guide you through setting up a basic CI/CD pipeline using GitHub Actions to deploy your application to an EC2 instance.

### Prerequisites

1. **AWS EC2 Instance:**
   - Ensure you have an EC2 instance running and accessible.
   - Install necessary dependencies (e.g., Node.js, npm, git, pm2) on the EC2 instance.

2. **SSH Access:**
   - Set up SSH keys for accessing your EC2 instance.
   - Ensure the SSH private key is available as a GitHub secret.

3. **GitHub Repository:**
   - Your application code should be in a GitHub repository.
   - Ensure you have access to create and manage GitHub Actions workflows.

### Steps to Set Up CI/CD with GitHub Actions

1. **Create a GitHub Actions Workflow File:**

   In your GitHub repository, create a directory called `.github/workflows` if it doesn’t exist. Inside this directory, create a file called `deploy.yml`.

2. **Define the Workflow:**

   Here is an example `deploy.yml` file for deploying a Node.js application:

   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v2

         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Install dependencies
           run: npm install

         - name: Run tests
           run: npm test

         - name: Deploy to EC2
           env:
             SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
             EC2_USER: ubuntu
             EC2_HOST: ec2-3-108-236-98.ap-south-1.compute.amazonaws.com
           run: |
             echo "$SSH_PRIVATE_KEY" > keyfile
             chmod 600 keyfile
             scp -i keyfile -o StrictHostKeyChecking=no -r . $EC2_USER@$EC2_HOST:/home/ubuntu/app
             ssh -i keyfile -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "cd /home/ubuntu/app && npm install && pm2 restart app"
   ```

3. **Add Secrets to GitHub:**

   - Go to your GitHub repository.
   - Navigate to `Settings` > `Secrets` > `Actions`.
   - Add a new secret named `SSH_PRIVATE_KEY` with the content of your EC2 instance's SSH private key.

### Detailed Breakdown

1. **Triggering the Workflow:**
   - The workflow is triggered by a push to the `main` branch.

2. **Checkout Code:**
   - The `actions/checkout` step checks out the repository code.

3. **Setup Node.js:**
   - The `actions/setup-node` step sets up the Node.js environment.

4. **Install Dependencies and Run Tests:**
   - The `npm install` and `npm test` commands install dependencies and run tests, respectively.

5. **Deploy to EC2:**
   - The `deploy` step performs the actual deployment:
     - The SSH private key is written to a `keyfile`.
     - File permissions for the `keyfile` are set.
     - The application code is copied to the EC2 instance using `scp`.
     - SSH into the EC2 instance and navigate to the application directory, install dependencies, and restart the application using `pm2`.

### Additional Tips

- **Ensure SSH Key Security:** Never hardcode SSH keys or sensitive information in your workflow files. Always use GitHub Secrets for storing sensitive information.
- **Environment Variables:** Customize the `EC2_USER` and `EC2_HOST` based on your specific EC2 setup.
- **Error Handling:** Add error handling and notifications to your workflow to alert you in case of deployment failures.
- **Further Steps:** Depending on your application, you might need additional steps like building the application, running migrations, or performing other setup tasks.

By following these steps, you can set up a basic CI/CD pipeline with GitHub Actions for deploying your application to an AWS EC2 instance. Adjust the workflow as needed to fit your specific requirements.
