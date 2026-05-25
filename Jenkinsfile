/**
 * ═══════════════════════════════════════════════════════
 * Jenkinsfile — Declarative Pipeline for Portfolio Deployment
 * ═══════════════════════════════════════════════════════
 *
 * This pipeline automates the deployment of the portfolio website
 * to an Apache/Nginx web server on an EC2 Ubuntu instance.
 *
 * Workflow:
 *   GitHub Push → Jenkins Webhook Trigger → Pull Code → Deploy to /var/www/html/
 *
 * Prerequisites:
 *   - Jenkins installed on EC2 Ubuntu (see SETUP_GUIDE.md)
 *   - Apache2 or Nginx installed and running
 *   - Jenkins user has sudo permissions for /var/www/html/
 *   - GitHub webhook configured to point to Jenkins
 *
 * Usage:
 *   Option A (Freestyle Job):
 *     Use the shell commands in the "Deploy" stage below
 *     directly in a Jenkins Freestyle project's build step.
 *
 *   Option B (Pipeline Job):
 *     Point a Jenkins Pipeline job to this Jenkinsfile in your repo.
 * ═══════════════════════════════════════════════════════
 */

pipeline {
    // Run on any available Jenkins agent
    agent any

    // Trigger build on GitHub push via webhook
    triggers {
        githubPush()
    }

    // Environment variables
    environment {
        DEPLOY_DIR = '/var/www/html'
    }

    stages {

        // ── Stage 1: Checkout ──────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                // Jenkins SCM automatically checks out the code
                checkout scm
            }
        }

        // ── Stage 2: Deploy ────────────────────────────────
        stage('Deploy') {
            steps {
                echo '🚀 Deploying portfolio to web server...'
                sh '''
                    # Remove old website files
                    sudo rm -rf ${DEPLOY_DIR}/*

                    # Copy new files to the web server directory
                    sudo cp -r ${WORKSPACE}/* ${DEPLOY_DIR}/

                    # Set correct ownership for the web server
                    sudo chown -R www-data:www-data ${DEPLOY_DIR}/

                    # Set correct file permissions
                    sudo chmod -R 755 ${DEPLOY_DIR}/

                    echo "✅ Deployment completed successfully!"
                '''
            }
        }

        // ── Stage 3: Verify ────────────────────────────────
        stage('Verify') {
            steps {
                echo '🔍 Verifying deployment...'
                sh '''
                    # Check if index.html exists in deploy directory
                    if [ -f "${DEPLOY_DIR}/index.html" ]; then
                        echo "✅ index.html found — deployment verified!"
                    else
                        echo "❌ index.html NOT found — deployment may have failed!"
                        exit 1
                    fi

                    # Check if Apache/Nginx is running
                    if systemctl is-active --quiet apache2; then
                        echo "✅ Apache2 is running"
                    elif systemctl is-active --quiet nginx; then
                        echo "✅ Nginx is running"
                    else
                        echo "⚠️  No web server detected as running"
                    fi
                '''
            }
        }
    }

    // ── Post-Build Actions ─────────────────────────────
    post {
        success {
            echo '''
            ╔═══════════════════════════════════════════╗
            ║  ✅  DEPLOYMENT SUCCESSFUL!               ║
            ║  🌐  Portfolio is live and updated.       ║
            ╚═══════════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔═══════════════════════════════════════════╗
            ║  ❌  DEPLOYMENT FAILED!                   ║
            ║  🔍  Check the console output for errors. ║
            ╚═══════════════════════════════════════════╝
            '''
        }
        always {
            // Clean workspace after build (optional)
            cleanWs()
        }
    }
}
