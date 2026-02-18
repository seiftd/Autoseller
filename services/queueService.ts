import { Job, ErrorLog } from '../types';
import { storageService } from './storageService';
import { workerService } from './workerService';

export const queueService = {

  // Start the queue processor loop
  start: () => {
    setInterval(queueService.processQueue, 5000); // Check queue every 5 seconds
    console.log("Queue Service Started");
  },

  addJob: (type: 'process_webhook' | 'publish_product', payload: any) => {
    const job: Job = {
      id: (typeof window !== 'undefined' && window.crypto?.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36).substring(7),
      type,
      payload,
      status: 'pending',
      createdAt: Date.now(),
      attempts: 0,
      maxAttempts: 3,
      nextAttemptAt: Date.now()
    };
    storageService.addJob(job);
    console.log(`[Queue] Job added: ${job.id} (${type})`);
  },

  processQueue: async () => {
    const jobs = storageService.getJobs();
    const now = Date.now();

    // Find jobs that are pending/processing and ready for attempt
    const pendingJobs = jobs.filter(j =>
      (j.status === 'pending' || j.status === 'processing') &&
      j.nextAttemptAt <= now
    );

    if (pendingJobs.length === 0) return;

    for (const job of pendingJobs) {
      await queueService.executeJob(job);
    }
  },

  executeJob: async (job: Job) => {
    // 1. Mark as processing
    job.status = 'processing';
    job.attempts++;
    queueService.updateJob(job);

    try {
      console.log(`[Queue] Processing Job ${job.id} (Attempt ${job.attempts})`);

      // 2. Route to Worker
      if (job.type === 'process_webhook') {
        await workerService.processWebhookJob(job);
      } else if (job.type === 'publish_product') {
        // Future implementation for async publishing
        await new Promise(r => setTimeout(r, 1000)); // Sim
      }

      // 3. Success
      job.status = 'completed';
      queueService.updateJob(job);
      // Optional: Archive completed jobs to keep DB clean
      queueService.removeJob(job.id);

    } catch (error: any) {
      console.error(`[Queue] Job ${job.id} Failed:`, error);

      // 4. Handle Failure
      if (job.attempts < job.maxAttempts) {
        // Retry with Exponential Backoff: 10s, 20s, 40s
        const backoff = Math.pow(2, job.attempts) * 10000;
        job.status = 'pending';
        job.nextAttemptAt = Date.now() + backoff;
        job.error = error.message;
        queueService.updateJob(job);

        storageService.logError({
          id: (typeof window !== 'undefined' && window.crypto?.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36),
          type: 'job',
          severity: 'warning',
          message: `Job ${job.id} failed, retrying in ${backoff / 1000}s`,
          stack: error.stack,
          timestamp: Date.now(),
          metadata: { jobId: job.id, attempts: job.attempts }
        });
      } else {
        // Dead Letter Queue
        job.status = 'failed';
        job.error = error.message;
        queueService.updateJob(job);

        storageService.saveFailedJob(job);
        storageService.removeJob(job.id); // Remove from active queue

        storageService.logError({
          id: (typeof window !== 'undefined' && window.crypto?.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36),
          type: 'job',
          severity: 'error',
          message: `Job ${job.id} failed permanently. Moved to DLQ.`,
          stack: error.stack,
          timestamp: Date.now(),
          metadata: { jobId: job.id }
        });
      }
    }
  },

  updateJob: (updatedJob: Job) => {
    const jobs = storageService.getJobs();
    const index = jobs.findIndex(j => j.id === updatedJob.id);
    if (index >= 0) {
      jobs[index] = updatedJob;
      storageService.saveJobs(jobs);
    }
  },

  removeJob: (id: string) => {
    const jobs = storageService.getJobs().filter(j => j.id !== id);
    storageService.saveJobs(jobs);
  },

  retryFailedJob: (id: string) => {
    const failedJobs = storageService.getFailedJobs();
    const jobToRetry = failedJobs.find(j => j.id === id);

    if (jobToRetry) {
      // Reset job stats
      jobToRetry.status = 'pending';
      jobToRetry.attempts = 0;
      jobToRetry.nextAttemptAt = Date.now();
      jobToRetry.error = undefined;

      storageService.addJob(jobToRetry); // Move back to active queue
      storageService.removeFailedJob(id); // Remove from DLQ
      console.log(`[Queue] Retrying failed job ${id}`);
    }
  }
};