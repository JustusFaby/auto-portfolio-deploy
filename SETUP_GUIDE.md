# 📋 Complete Setup Guide — EC2, Jenkins & Apache Deployment

> **A beginner-friendly, step-by-step guide to setting up a fully automated CI/CD pipeline on AWS.**
>
> By the end of this guide, every `git push` you make will automatically update your live portfolio website. No manual steps required.

---

## 📑 Table of Contents

- [Prerequisites](#-prerequisites)
- [Step 1: Launch an EC2 Instance](#-step-1-launch-an-ec2-instance)
- [Step 2: Install Apache Web Server](#-step-2-install-apache-web-server)
- [Step 3: Install Java (Jenkins Dependency)](#-step-3-install-java-jenkins-dependency)
- [Step 4: Install Jenkins](#-step-4-install-jenkins)
- [Step 5: Install Git](#-step-5-install-git)
- [Step 6: Configure Jenkins Permissions](#-step-6-configure-jenkins-permissions)
- [Step 7: Create Jenkins Freestyle Job](#-step-7-create-jenkins-freestyle-job)
- [Step 8: Configure GitHub Webhook](#-step-8-configure-github-webhook)
- [Step 9: Test the Pipeline](#-step-9-test-the-pipeline)
- [Troubleshooting](#-troubleshooting)
- [Security Best Practices](#-security-best-practices)

---

## ✅ Prerequisites

Before you begin, make sure you have the following:

| Requirement | Details |
|---|---|
| ☁️ **AWS Account** | Free tier eligible — [Sign up here](https://aws.amazon.com/free/) |
| 🐙 **GitHub Account** | With a repository for your portfolio code |
| 🔑 **SSH Client** | Terminal (macOS/Linux) or PuTTY (Windows) |
| 🐧 **Basic Linux Knowledge** | Navigating directories, running commands |

> 💡 **Tip:** AWS Free Tier gives you 750 hours/month of `t2.micro` instances for 12 months — more than enough for this project!

---

## 🖥️ Step 1: Launch an EC2 Instance

An EC2 instance is a virtual server in the AWS cloud. This is where Jenkins and Apache will run.

### 1.1 — Log into AWS Console

1. Go to [AWS Management Console](https://console.aws.amazon.com/)
2. Search for **EC2** in the top search bar
3. Click **"Launch Instance"**

### 1.2 — Configure the Instance

| Setting | Value |
|---|---|
| **Name** | `portfolio-server` |
| **AMI** | Ubuntu Server 22.04 LTS (Free tier eligible) |
| **Instance Type** | `t2.micro` (Free tier — 1 vCPU, 1 GB RAM) |
| **Key Pair** | Create a new key pair or select an existing one |

> ⚠️ **Important:** Download and save your `.pem` key file somewhere safe. You'll need it to SSH into your server. You **cannot** download it again!

### 1.3 — Configure Security Group

The Security Group acts as a firewall. You need to open these ports:

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| **22** | TCP | Your IP (`My IP`) | SSH access to your server |
| **80** | TCP | Anywhere (`0.0.0.0/0`) | HTTP — serves your website |
| **8080** | TCP | Anywhere (`0.0.0.0/0`) | Jenkins web dashboard |

### 1.4 — Launch & Connect

1. Click **"Launch Instance"**
2. Wait for the instance state to show **"Running"** ✅
3. Copy the **Public IPv4 address** from the instance details

### 1.5 — SSH into Your Server

Open your terminal and connect:

```bash
# Navigate to the folder where your .pem key file is saved
cd ~/Downloads

# Set the correct permissions on your key file (required by SSH)
chmod 400 your-key.pem

# Connect to your EC2 instance via SSH
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

> 🔁 Replace `<EC2-PUBLIC-IP>` with your actual EC2 public IP address (e.g., `54.123.45.67`).

You should see a welcome message from Ubuntu. You're now inside your cloud server! 🎉

---

## 🌐 Step 2: Install Apache Web Server

Apache is the web server that will serve your portfolio website to visitors.

```bash
# Update the package list to get the latest versions
sudo apt update && sudo apt upgrade -y

# Install Apache web server
sudo apt install apache2 -y

# Start the Apache service
sudo systemctl start apache2

# Enable Apache to start automatically on server reboot
sudo systemctl enable apache2

# Verify that Apache is running
sudo systemctl status apache2
```

You should see **`active (running)`** in green. ✅

### ✔️ Verify Apache is Working

Open your browser and visit:

```
http://<EC2-PUBLIC-IP>
```

You should see the **Apache2 Ubuntu Default Page** — a page that says "It works!" 🎉

> 🚫 **Not working?** Make sure port **80** is open in your EC2 Security Group (see Step 1.3).

---

## ☕ Step 3: Install Java (Jenkins Dependency)

Jenkins is built with Java, so we need to install the Java Runtime Environment (JRE) first.

```bash
# Install Java 17 JRE and required font libraries
sudo apt install fontconfig openjdk-17-jre -y

# Verify Java is installed correctly
java -version
```

You should see output similar to:

```
openjdk version "17.0.x" 2024-xx-xx
```

✅ Java is ready. Now we can install Jenkins!

---

## ⚙️ Step 4: Install Jenkins

Jenkins is the CI/CD automation server that will automatically deploy your code.

### 4.1 — Add Jenkins Repository & Install

```bash
# Download the Jenkins GPG key (verifies package authenticity)
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

# Add the Jenkins repository to your system's package sources
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  "https://pkg.jenkins.io/debian-stable binary/" | \
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

# Update package list to include Jenkins packages
sudo apt update

# Install Jenkins
sudo apt install jenkins -y
```

### 4.2 — Start Jenkins

```bash
# Start the Jenkins service
sudo systemctl start jenkins

# Enable Jenkins to start automatically on reboot
sudo systemctl enable jenkins

# Verify Jenkins is running
sudo systemctl status jenkins
```

You should see **`active (running)`** in green. ✅

### 4.3 — Access Jenkins Dashboard

Open your browser and visit:

```
http://<EC2-PUBLIC-IP>:8080
```

You'll see the **"Unlock Jenkins"** page asking for an initial admin password.

### 4.4 — Get the Initial Admin Password

```bash
# Display the auto-generated admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

📋 Copy the password and paste it into the Jenkins web page.

### 4.5 — Complete Jenkins Setup

1. Click **"Install suggested plugins"** — wait for plugins to install
2. **Create an Admin User** — fill in your username, password, and email
3. Click **"Save and Continue"** → **"Save and Finish"** → **"Start using Jenkins"**

🎉 Jenkins is now up and running!

---

## 📦 Step 5: Install Git

Git is needed so Jenkins can pull your code from GitHub.

```bash
# Install Git version control
sudo apt install git -y

# Verify Git is installed
git --version
```

You should see output like:

```
git version 2.34.x
```

✅ Git is ready!

---

## 🔐 Step 6: Configure Jenkins Permissions

By default, Jenkins runs as the `jenkins` user, which doesn't have permission to write files to Apache's web directory (`/var/www/html/`). We need to fix that.

### 6.1 — Add Jenkins to the Web Server Group

```bash
# Add the 'jenkins' user to the 'www-data' group (Apache's group)
sudo usermod -aG www-data jenkins
```

### 6.2 — Grant Jenkins Sudo Access for Deployment Commands

```bash
# Open the sudoers file safely with visudo
sudo visudo
```

Add this line at the **bottom** of the file:

```
jenkins ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/chown, /bin/chmod
```

> 📝 **What does this do?** It allows the `jenkins` user to run `cp`, `rm`, `chown`, and `chmod` commands **without being prompted for a password**. These are the only commands Jenkins needs to deploy your files.

Save the file and exit:
- In **nano**: Press `Ctrl + X`, then `Y`, then `Enter`
- In **vim**: Press `Esc`, type `:wq`, then `Enter`

### 6.3 — Restart Jenkins

```bash
# Restart Jenkins to apply the new group membership
sudo systemctl restart jenkins
```

✅ Jenkins now has the permissions it needs to deploy to Apache!

---

## 🏗️ Step 7: Create Jenkins Freestyle Job

Now we'll create the Jenkins job that automatically builds and deploys your portfolio.

### 7.1 — Create a New Job

1. Open Jenkins: `http://<EC2-PUBLIC-IP>:8080`
2. Click **"New Item"** (left sidebar)
3. Enter the name: **`portfolio-deploy`**
4. Select **"Freestyle project"**
5. Click **"OK"**

### 7.2 — Configure Source Code Management

1. Scroll to **"Source Code Management"**
2. Select **"Git"**
3. In **"Repository URL"**, enter your GitHub repo URL:
   ```
   https://github.com/your-username/auto-portfolio-deploy.git
   ```
4. **Branch Specifier**: `*/main`

> 💡 If your default branch is `master`, use `*/master` instead.

### 7.3 — Configure Build Trigger

1. Scroll to **"Build Triggers"**
2. ✅ Check **"GitHub hook trigger for GITScm polling"**

> This tells Jenkins to start a build whenever it receives a webhook from GitHub.

### 7.4 — Add Build Step (Deploy Script)

1. Scroll to **"Build"** section
2. Click **"Add build step"** → **"Execute shell"**
3. Paste the following deployment script:

```bash
# ============================================
# 🚀 Portfolio Deployment Script
# ============================================

# Remove old website files from Apache's web directory
sudo rm -rf /var/www/html/*

# Copy new portfolio files to the web server
sudo cp -r * /var/www/html/

# Set correct ownership (Apache runs as www-data user)
sudo chown -R www-data:www-data /var/www/html/

# Set file permissions (755 = owner can read/write/execute, others can read/execute)
sudo chmod -R 755 /var/www/html/

echo '✅ Deployment complete!'
```

4. Click **"Save"**

✅ Your Jenkins job is configured and ready!

---

## 🔗 Step 8: Configure GitHub Webhook

A webhook tells GitHub to notify Jenkins every time you push code.

### 8.1 — Add the Webhook

1. Go to your **GitHub repository** page
2. Click **Settings** (tab at the top)
3. Click **Webhooks** (left sidebar)
4. Click **"Add webhook"**

### 8.2 — Configure the Webhook

| Setting | Value |
|---|---|
| **Payload URL** | `http://<EC2-PUBLIC-IP>:8080/github-webhook/` |
| **Content type** | `application/json` |
| **Secret** | *(leave blank)* |
| **Events** | Select **"Just the push event"** |

> ⚠️ **Important:** The trailing slash `/` in the Payload URL is **required**! Without it, the webhook will fail.

5. Click **"Add webhook"**

### 8.3 — Verify the Webhook

After adding, GitHub will send a test ping. Look for:

- ✅ **Green checkmark** — Webhook is working
- ❌ **Red X** — Something is wrong (check the URL and security group)

> 🚫 **Seeing a red X?** Make sure port **8080** is open in your EC2 Security Group and Jenkins is running.

---

## 🧪 Step 9: Test the Pipeline

Time for the moment of truth! Let's test the full CI/CD pipeline end-to-end.

### 9.1 — Make a Code Change

Open any file in your project locally and make a visible change. For example, edit `index.html`:

```html
<!-- Change the heading text to something new -->
<h1>Hello, World! Pipeline is working! 🚀</h1>
```

### 9.2 — Push the Change

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "test: verify CI/CD pipeline is working"

# Push to GitHub (this triggers the webhook!)
git push origin main
```

### 9.3 — Watch Jenkins

1. Open Jenkins: `http://<EC2-PUBLIC-IP>:8080`
2. Click on **"portfolio-deploy"** job
3. You should see a new build appear in **"Build History"** 🔨
4. Click the build number → **"Console Output"** to watch the deployment live

### 9.4 — Verify the Live Website

Open your browser and visit:

```
http://<EC2-PUBLIC-IP>
```

🎉 **You should see your updated portfolio!** The CI/CD pipeline is fully operational!

```
✅ You push code → GitHub → Jenkins → Apache → Live Website
   All automated. All in seconds.
```

---

## 🔧 Troubleshooting

### ❌ Jenkins can't access `/var/www/html`

**Symptom:** Build fails with "Permission denied" error.

**Fix:**

```bash
# Verify jenkins user is in the www-data group
groups jenkins

# Re-run the permission setup
sudo usermod -aG www-data jenkins

# Make sure the sudoers entry exists
sudo visudo
# Verify this line is present:
# jenkins ALL=(ALL) NOPASSWD: /bin/cp, /bin/rm, /bin/chown, /bin/chmod

# Restart Jenkins to apply changes
sudo systemctl restart jenkins
```

---

### ❌ Webhook is not triggering builds

**Symptom:** You push code but Jenkins doesn't start a build.

**Fix:**

1. **Check Security Group** — Make sure port **8080** is open to `0.0.0.0/0`
2. **Check Webhook URL** — Must end with `/github-webhook/` (trailing slash!)
3. **Check Jenkins job config** — "GitHub hook trigger for GITScm polling" must be checked
4. **Check GitHub webhook delivery** — Go to Settings → Webhooks → Click your webhook → "Recent Deliveries" — look for error codes

```bash
# Verify Jenkins is running
sudo systemctl status jenkins

# Check if port 8080 is listening
sudo netstat -tlnp | grep 8080
```

---

### ❌ Apache is not serving the website

**Symptom:** Browser shows "Unable to connect" or a blank page.

**Fix:**

```bash
# Check if Apache is running
sudo systemctl status apache2

# If stopped, start it
sudo systemctl start apache2

# Check if the files exist in the web directory
ls -la /var/www/html/

# Check Apache error logs for details
sudo tail -20 /var/log/apache2/error.log
```

---

### ❌ Build fails in Jenkins

**Symptom:** Build shows a red circle ❌ in Jenkins.

**Fix:**

1. Click the **failed build number** in Build History
2. Click **"Console Output"**
3. Read the error message at the bottom — it will tell you exactly what went wrong

Common errors:
- `Permission denied` → Re-check Step 6 (Jenkins permissions)
- `repository not found` → Check the Git repo URL in the job configuration
- `Could not resolve host` → Check EC2 internet connectivity

```bash
# Test if your EC2 can reach GitHub
curl -I https://github.com
```

---

## 🛡️ Security Best Practices

Your pipeline is working, but here are some important security improvements for production use:

### 🔒 Use HTTPS with Let's Encrypt

Serve your website over HTTPS for free:

```bash
# Install Certbot (Let's Encrypt client)
sudo apt install certbot python3-certbot-apache -y

# Get and install a free SSL certificate
sudo certbot --apache -d yourdomain.com
```

> 💡 You'll need a domain name pointed to your EC2 IP address for this to work.

### 🔑 Restrict SSH Access to Your IP

In your EC2 Security Group, change the SSH rule:

| Port | Source | Change to |
|---|---|---|
| 22 | `0.0.0.0/0` (Anywhere) | `YOUR_IP/32` (Your IP only) |

> This ensures only **you** can SSH into the server.

### 📦 Keep Packages Updated

Regularly update your server to get security patches:

```bash
# Update package list and upgrade all installed packages
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 🎭 Use IAM Roles (Not Root Credentials)

- ✅ **Do:** Create an IAM user with only the permissions you need
- ❌ **Don't:** Use your AWS root account for daily tasks
- ✅ **Do:** Enable **Multi-Factor Authentication (MFA)** on your AWS account
- ❌ **Don't:** Hard-code AWS credentials in your code

---

<p align="center">
  <strong>🎉 Congratulations! You've built a fully automated CI/CD pipeline!</strong><br/>
  <em>You now have a real-world DevOps project on your resume.</em>
</p>

---

<p align="center">
  <a href="README.md">← Back to README</a>
</p>
