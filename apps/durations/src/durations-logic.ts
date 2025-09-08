import { TodoistClient, TodoistTask } from '@shared/todoist-client';
import { Logger } from '@shared/utils';

export const DURATION_LABELS = {
  '⏲15m': 15,
  '⏲30m': 30,
  '⏲1h': 60,
  '⏲2h': 120,
  '⏲3h': 180,
  '⏲4h': 240,
  '⏲5h': 300,
  '⏲6h': 360,
  '⏲7h': 420,
  '⏲8h': 480
} as const;

export class DurationsLogic {
  private todoist: TodoistClient;
  private durationPattern = /.* \[\d+m\]$/;

  constructor(token: string) {
    this.todoist = new TodoistClient(token);
  }

  /**
   * Check if task content already has duration annotation
   */
  private isAlreadyAnnotated(content: string): boolean {
    return this.durationPattern.test(content);
  }

  /**
   * Get duration in minutes from task labels
   */
  private getDurationFromLabels(task: TodoistTask): number {
    for (const labelName of task.labels) {
      if (labelName in DURATION_LABELS) {
        return DURATION_LABELS[labelName as keyof typeof DURATION_LABELS];
      }
    }
    return 0;
  }

  /**
   * Check if task is relevant (has duration labels and due date/time)
   */
  private isTaskRelevant(task: TodoistTask): boolean {
    // Must have due date
    if (!task.due?.date) {
      return false;
    }

    // Must have at least one duration label
    return this.getDurationFromLabels(task) > 0;
  }

  /**
   * Ensure all duration labels exist
   */
  async ensureDurationLabels(): Promise<void> {
    try {
      const existingLabels = await this.todoist.getLabels();
      const existingLabelNames = existingLabels.map(label => label.name);

      for (const labelName of Object.keys(DURATION_LABELS)) {
        if (!existingLabelNames.includes(labelName)) {
          Logger.info(`Creating missing duration label: ${labelName}`);
          await this.todoist.createLabel(labelName, 'blue');
        }
      }
    } catch (error) {
      Logger.error('Error ensuring duration labels:', error);
    }
  }

  /**
   * Set duration for a specific task
   */
  async setTaskDuration(taskId: string): Promise<void> {
    try {
      const task = await this.todoist.getTask(taskId);

      if (!this.isTaskRelevant(task)) {
        Logger.debug('Task is not relevant for duration setting', taskId);
        return;
      }

      if (this.isAlreadyAnnotated(task.content)) {
        Logger.debug('Task already has duration annotation, skipping', taskId);
        return;
      }

      const duration = this.getDurationFromLabels(task);
      if (duration === 0) {
        Logger.debug('No duration found for task', taskId);
        return;
      }

      // Update task content with duration annotation
      const newContent = `${task.content} [${duration}m]`;

      await this.todoist.updateTask(taskId, {
        content: newContent,
      });
      await this.todoist.updateTaskOfficial(taskId, {
        duration:  duration,
        durationUnit: 'minute'
      });

      Logger.info(`Set duration for task "${task.content}": ${duration} minutes`);

    } catch (error) {
      Logger.error('Error setting task duration:', error, { taskId });
    }
  }

  /**
   * Process all relevant tasks for duration setting
   */
  async processAllTasks(): Promise<void> {
    try {
      // Ensure duration labels exist first
      await this.ensureDurationLabels();

      // Get all tasks
      const tasks = await this.todoist.getTasks();

      // Filter relevant tasks
      const relevantTasks = tasks.filter(task => this.isTaskRelevant(task));

      Logger.info(`Processing ${relevantTasks.length} relevant tasks for duration setting`);

      for (const task of relevantTasks) {
        await this.setTaskDuration(task.id);
      }

    } catch (error) {
      Logger.error('Error processing all tasks:', error);
    }
  }

  /**
   * Get available duration labels (for display purposes)
   */
  getDurationLabelsInfo(): Array<{ name: string; duration: number }> {
    return Object.entries(DURATION_LABELS).map(([name, duration]) => ({
      name,
      duration
    }));
  }
}
