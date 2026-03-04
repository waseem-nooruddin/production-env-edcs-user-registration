import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Enterprise-grade Playwright Teams Reporter
 * Sends comprehensive test execution results to Microsoft Teams via Incoming Webhook
 * 
 * Features:
 * - Accurate test status tracking (Passed, Failed, Flaky, Skipped, Timedout)
 * - Detailed error messages and stack traces for failed tests
 * - Proper retry/flaky test detection
 * - CI/CD metadata integration
 * - Rich Teams MessageCard formatting
 * - Execution duration tracking
 */

// Configuration Constants
const MAX_FAILED_TESTS_DISPLAY = 10;
const MAX_FLAKY_TESTS_DISPLAY = 5;
const ERROR_TRUNCATE_LENGTH = 200;
const WEBHOOK_TIMEOUT_MS = 30000;
const MAX_RETRY_ATTEMPTS = 3;
const MAX_BACKOFF_MS = 5000;

export default class TeamsReporter implements Reporter {
  private webhookUrl: string | undefined;
  private startTime: number = 0;
  private projectName: string = 'Playwright Tests'; // Default fallback
  private testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    flaky: 0,
    timedout: 0,
  };

  // Track failed and flaky tests with detailed information
  private failedTests: Array<{
    title: string;
    error: string;
    stack: string;
    location: string;
  }> = [];

  private flakyTests: Array<{
    title: string;
    attempts: number;
  }> = [];

  // Track test attempts to properly detect flaky tests
  private testAttempts = new Map<string, {
    test: TestCase;
    results: Array<{ result: TestResult; retry: number }>;
  }>();

  constructor() {
    this.webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    if (!this.webhookUrl) {
      console.warn('⚠️  TEAMS_WEBHOOK_URL environment variable is not set. Teams notifications will be skipped.');
    }
    // Read project name from package.json
    this.projectName = this.getProjectName();
  }

  onBegin(): void {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const testId = test.id;
    console.log(`📝 onTestEnd called: ${test.title} - Status: ${result.status}`);

    // Track all attempts for this test
    if (!this.testAttempts.has(testId)) {
      this.testAttempts.set(testId, {
        test,
        results: [],
      });
    }

    this.testAttempts.get(testId)!.results.push({
      result,
      retry: result.retry,
    });
  }

  async onEnd(result: FullResult): Promise<void> {
    // Allow disabling Teams notifications via flag (without removing the webhook URL).
    // Accepted: true | 1  → send (also the default when the variable is not set at all)
    //           false | 0 → skip
    const sendReport = process.env.SEND_TEAMS_REPORT?.toLowerCase().trim();
    if (sendReport !== undefined && sendReport !== 'true' && sendReport !== '1') {
      console.log(`ℹ️  Teams notification is disabled (SEND_TEAMS_REPORT=${process.env.SEND_TEAMS_REPORT}). Skipping.`);
      return;
    }

    if (!this.webhookUrl) {
      console.log('Skipping Teams notification (no webhook URL configured)');
      return;
    }


    // Process all test attempts to determine final status
    this.processTestResults();

    const duration = this.formatDuration(Date.now() - this.startTime);
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium',
    });

    const messageCard = this.buildMessageCard(duration, timestamp);

    // Send webhook with retry logic
    await this.sendWebhookWithRetry(messageCard, 3);
  }

  /**
   * Send webhook to Teams with retry logic
   * @param messageCard The message card payload
   * @param maxRetries Maximum number of retry attempts
   */
  private async sendWebhookWithRetry(messageCard: any, maxRetries: number): Promise<void> {

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📤 Sending Teams notification (attempt ${attempt}/${maxRetries})...`);
        console.log(`📍 Webhook URL: ${this.webhookUrl!.substring(0, 60)}...`);

        const response = await axios.post(this.webhookUrl!, messageCard, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: WEBHOOK_TIMEOUT_MS,
          validateStatus: (status: number) => status < 500, // Don't throw on 4xx errors
        });

        if (response.status >= 200 && response.status < 300) {
          console.log('✅ Teams notification sent successfully!');
          console.log(`📊 Response status: ${response.status} ${response.statusText}`);
          return; // Success - exit retry loop
        } else {
          console.error(`❌ Teams webhook failed (${response.status}): ${response.statusText}`);
          console.error(`Response data:`, response.data);

          // Don't retry on 4xx errors (client errors - bad request, auth, etc.)
          if (response.status >= 400 && response.status < 500) {
            console.error('⚠️ Client error detected - not retrying');
            return;
          }
        }
      } catch (error) {
        console.error(`❌ Error sending Teams notification (attempt ${attempt}/${maxRetries}):`, error);

        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - the webhook endpoint did not respond within 30 seconds');
          } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            console.error('🌐 Network error - cannot reach the webhook endpoint');
          } else if (error.response) {
            console.error(`📊 Response status: ${error.response.status}`);
            console.error(`📄 Response data:`, error.response.data);
          } else if (error.request) {
            console.error('📡 No response received from webhook endpoint');
          }
          console.error(`🔍 Error code: ${error.code}`);
          console.error(`🔍 Error message: ${error.message}`);
        } else if (error instanceof Error) {
          console.error(`Error details: ${error.message}`);
          console.error(`Stack trace: ${error.stack}`);
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), MAX_BACKOFF_MS);
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error(`❌ Failed to send Teams notification after ${maxRetries} attempts`);
  }

  /**
   * Process all test attempts to determine final status
   * A test is:
   * - FLAKY: if it failed at least once but eventually passed
   * - FAILED: if it failed on all attempts (including retries)
   * - PASSED: if it passed on the first attempt
   * - SKIPPED: if it was skipped
   * - TIMEDOUT: if it timed out
   */
  private processTestResults(): void {
    console.log(`🔍 Processing ${this.testAttempts.size} test(s)`);
    for (const [testId, data] of this.testAttempts.entries()) {
      const { test, results } = data;
      const finalResult = results[results.length - 1].result;
      const hadFailures = results.some(r => r.result.status === 'failed' || r.result.status === 'timedOut');

      if (finalResult.status === 'passed') {
        if (hadFailures && results.length > 1) {
          // Flaky: failed at least once but eventually passed
          this.testResults.flaky++;
          this.flakyTests.push({
            title: test.title,
            attempts: results.length,
          });
        } else {
          // Clean pass
          this.testResults.passed++;
        }
      } else if (finalResult.status === 'failed') {
        this.testResults.failed++;
        this.captureFailedTest(test, finalResult);
      } else if (finalResult.status === 'skipped') {
        this.testResults.skipped++;
      } else if (finalResult.status === 'timedOut') {
        this.testResults.timedout++;
        this.captureFailedTest(test, finalResult);
      }
    }
  }

  /**
   * Capture detailed information about failed tests
   */
  private captureFailedTest(test: TestCase, result: TestResult): void {
    const errorMessage = result.error?.message || 'No error message available';
    const stackTrace = result.error?.stack || '';

    // Extract first 3 lines of stack trace for brevity
    const stackLines = stackTrace.split('\n').slice(0, 3).join('\n');

    // Get test location
    const location = test.location ? `${test.location.file}:${test.location.line}` : 'Unknown location';

    this.failedTests.push({
      title: test.title,
      error: errorMessage,
      stack: stackLines,
      location,
    });
  }

  /**
   * Read project name from package.json
   */
  private getProjectName(): string {
    try {
      // Find package.json starting from current directory and going up
      let currentDir = process.cwd();
      let packageJsonPath = path.join(currentDir, 'package.json');

      // Try to find package.json in current or parent directories
      while (!fs.existsSync(packageJsonPath) && currentDir !== path.dirname(currentDir)) {
        currentDir = path.dirname(currentDir);
        packageJsonPath = path.join(currentDir, 'package.json');
      }

      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.name) {
          console.log(`📦 Project name from package.json: ${packageJson.name}`);
          return packageJson.name;
        }
      }

      console.warn('⚠️  Could not find package.json or "name" field. Using default project name.');
      return 'Playwright Tests';
    } catch (error) {
      console.error('❌ Error reading package.json:', error);
      return 'Playwright Tests';
    }
  }


  /**
   * Build the Teams MessageCard with rich formatting
   */
  private buildMessageCard(duration: string, timestamp: string): any {
    const overallStatus = this.getOverallStatus();
    const themeColor = this.getThemeColor();
    const totalTests = this.testResults.passed + this.testResults.failed + this.testResults.skipped + this.testResults.flaky + this.testResults.timedout;
    const totalFailed = this.testResults.failed + this.testResults.timedout;
    const passRate = totalTests > 0 ? ((this.testResults.passed + this.testResults.flaky) / totalTests * 100).toFixed(1) : '0.0';

    const summaryTable = [
      '| Field | Value |',
      '|:---|:---|',
      `| 📊 Total Tests | ${totalTests} |`,
      `| ✅ Passed | ${this.testResults.passed} |`,
      `| ❌ Failed | ${totalFailed} |`,
      `| ⏭️ Skipped | ${this.testResults.skipped} |`,
      `| ⚠️ Flaky | ${this.testResults.flaky} |`,
      `| 📈 Pass Rate | ${passRate}% |`,
    ].join('\n');

    const sections: any[] = [
      {
        activityTitle: `${overallStatus.emoji} ${this.projectName} - Automated Test Run`,
        activitySubtitle: `Executed on ${timestamp} | Duration: ${duration}`,
        text: summaryTable,
        markdown: true,
      },
    ];

    // // Add visual chart showing test distribution
    // const chartUrl = this.generateChartUrl();
    // if (chartUrl) {
    //   sections.push({
    //     activityTitle: '📊 Test Distribution',
    //     activitySubtitle: 'Visual breakdown of test results',
    //     images: [
    //       {
    //         image: chartUrl,
    //       },
    //     ],
    //   });
    // }


    // // Add CI/CD metadata if available
    // const ciMetadata = this.getCIMetadata();
    // if (ciMetadata.length > 0) {
    //   sections.push({
    //     activityTitle: '🔧 Environment',
    //     facts: ciMetadata,
    //     markdown: true,
    //   });
    // }

    // Add flaky test details
    // if (this.flakyTests.length > 0) {
    //   const flakyTestsFacts = this.flakyTests.slice(0, MAX_FLAKY_TESTS_DISPLAY).map((test, index) => ({
    //     name: `${index + 1}. ${test.title}`,
    //     value: `Passed after ${test.attempts} attempts`,
    //   }));

    //   sections.push({
    //     activityTitle: `⚠️ Flaky Tests (${this.flakyTests.length})`,
    //     facts: flakyTestsFacts,
    //     markdown: true,
    //   });
    // }

    // Add action buttons
    const potentialActions = this.getActionButtons();

    return {
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: `Playwright Test Results - ${overallStatus.text}`,
      themeColor,
      sections,
      ...(potentialActions.length > 0 ? { potentialAction: potentialActions } : {}),
    };
  }

  /**
   * Determine overall test execution status
   */
  private getOverallStatus(): { emoji: string; text: string } {
    if (this.testResults.failed > 0 || this.testResults.timedout > 0) {
      return { emoji: '❌', text: 'FAILED' };
    }
    if (this.testResults.flaky > 0) {
      return { emoji: '⚠️', text: 'UNSTABLE' };
    }
    return { emoji: '✅', text: 'PASSED' };
  }

  /**
   * Get theme color based on test results
   */
  private getThemeColor(): string {
    if (this.testResults.failed > 0 || this.testResults.timedout > 0) {
      return 'dc3545'; // Red
    }
    if (this.testResults.flaky > 0) {
      return 'ffc107'; // Yellow/Orange
    }
    return '28a745'; // Green
  }

  /**
   * Extract CI/CD metadata from environment variables
   */
  private getCIMetadata(): Array<{ name: string; value: string }> {
    const metadata: Array<{ name: string; value: string }> = [];

    // GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      if (process.env.GITHUB_REF) {
        const branch = process.env.GITHUB_REF.replace('refs/heads/', '');
        metadata.push({ name: 'Branch:', value: branch });
      }
      if (process.env.GITHUB_SHA) {
        metadata.push({ name: 'Commit:', value: process.env.GITHUB_SHA.substring(0, 7) });
      }
      if (process.env.GITHUB_RUN_NUMBER) {
        metadata.push({ name: 'Build:', value: `#${process.env.GITHUB_RUN_NUMBER}` });
      }
    }

    // Jenkins
    if (process.env.JENKINS_HOME) {
      if (process.env.GIT_BRANCH) {
        metadata.push({ name: 'Branch:', value: process.env.GIT_BRANCH });
      }
      if (process.env.GIT_COMMIT) {
        metadata.push({ name: 'Commit:', value: process.env.GIT_COMMIT.substring(0, 7) });
      }
      if (process.env.BUILD_NUMBER) {
        metadata.push({ name: 'Build:', value: `#${process.env.BUILD_NUMBER}` });
      }
    }

    // GitLab CI
    if (process.env.GITLAB_CI) {
      if (process.env.CI_COMMIT_BRANCH) {
        metadata.push({ name: 'Branch:', value: process.env.CI_COMMIT_BRANCH });
      }
      if (process.env.CI_COMMIT_SHORT_SHA) {
        metadata.push({ name: 'Commit:', value: process.env.CI_COMMIT_SHORT_SHA });
      }
      if (process.env.CI_PIPELINE_ID) {
        metadata.push({ name: 'Pipeline:', value: `#${process.env.CI_PIPELINE_ID}` });
      }
    }

    return metadata;
  }

  /**
   * Get action buttons for the Teams card
   */
  private getActionButtons(): any[] {
    const actions: any[] = [];

    // Add link to HTML report if available AND the button is not explicitly disabled.
    // SHOW_HTML_REPORT_BUTTON: true | 1  → show button (default when unset)
    //                          false | 0 → hide button
    const showButton = process.env.SHOW_HTML_REPORT_BUTTON?.toLowerCase().trim();
    const buttonEnabled = showButton === undefined || showButton === 'true' || showButton === '1';

    if (buttonEnabled && process.env.PLAYWRIGHT_REPORT_URL) {
      actions.push({
        '@type': 'OpenUri',
        name: '📊 View HTML Report',
        targets: [{ os: 'default', uri: process.env.PLAYWRIGHT_REPORT_URL }],
      });
    }

    return actions;
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  /**
   * Truncate error message to fit Teams message limits
   */
  private truncateError(error: string, maxLength: number): string {
    if (error.length <= maxLength) {
      return error;
    }
    return error.substring(0, maxLength - 3) + '...';
  }

  /**
   * Generate QuickChart URL for test distribution visualization
   * Creates a modern horizontal bar chart showing test distribution
   */
  private generateChartUrl(): string | null {
    const totalTests = this.testResults.passed + this.testResults.failed + this.testResults.skipped + this.testResults.flaky + this.testResults.timedout;

    // Don't generate chart if no tests were run
    if (totalTests === 0) {
      return null;
    }

    const totalFailed = this.testResults.failed + this.testResults.timedout;

    // Build chart configuration with modern horizontal bar design
    const chartConfig = {
      type: 'horizontalBar',
      data: {
        labels: ['✅ Passed', '❌ Failed', '⏭️ Skipped', '⚠️ Flaky'],
        datasets: [
          {
            label: 'Test Count',
            data: [
              this.testResults.passed,
              totalFailed,
              this.testResults.skipped,
              this.testResults.flaky,
            ],
            backgroundColor: [
              'rgba(16, 185, 129, 0.85)',   // Modern emerald green
              'rgba(239, 68, 68, 0.85)',     // Modern red
              'rgba(148, 163, 184, 0.85)',   // Modern slate gray
              'rgba(251, 191, 36, 0.85)',    // Modern amber
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(148, 163, 184, 1)',
              'rgba(251, 191, 36, 1)',
            ],
            borderWidth: 2,
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 15,
            right: 80,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: [`📊 Test Execution Results`, `Total: ${totalTests} tests`],
            font: {
              size: 18,
              weight: 'bold',
              family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            },
            color: '#1f2937',
            padding: {
              top: 10,
              bottom: 25,
            },
          },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'end',
            color: '#1f2937',
            font: {
              weight: 'bold',
              size: 14,
              family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            },
            formatter: (value: number) => {
              if (value === 0) return '';
              const percentage = ((value / totalTests) * 100).toFixed(1);
              return `${value} (${percentage}%)`;
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 12,
                family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              },
              color: '#6b7280',
              precision: 0,
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 14,
                weight: '600',
                family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              },
              color: '#374151',
              padding: 10,
            },
          },
        },
      },
    };

    // Encode chart configuration for URL
    const encodedChart = encodeURIComponent(JSON.stringify(chartConfig));

    // Generate QuickChart URL with enhanced sizing and quality
    return `https://quickchart.io/chart?c=${encodedChart}&width=650&height=350&devicePixelRatio=2.0&backgroundColor=white`;
  }
}
