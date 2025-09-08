import { TodoistClient, TodoistTask } from '@shared/todoist-client';
import { Logger, TimeUtils } from '@shared/utils';

export class DefTimeLogic {
  private todoist: TodoistClient;
  private cachedUser: { id: string; timezone: string } | null = null;

  constructor(token: string) {
    this.todoist = new TodoistClient(token);
  }

  /**
   * Check if a task already has a time component
   */
   private hasTime(dateTime?: string): boolean {
    return dateTime ? dateTime.includes(':') : false;
  }

  /**
   * Get user timezone with caching to avoid rate limits
   */
  private async getUserTimezone(): Promise<string> {
    if (this.cachedUser) {
      return this.cachedUser.timezone;
    }

    try {
      const user = await this.todoist.getUser();
      this.cachedUser = { id: user.id, timezone: user.timezone };
      return user.timezone;
    } catch (error) {
      Logger.warn('Failed to get user timezone, using UTC as fallback:', error);
      // Fallback to UTC if API call fails (rate limit, etc.)
      return 'UTC';
    }
  }

  /**
   * Generate a time for a task based on user's timezone
   */
  private async generateTimeForTask(task: TodoistTask): Promise<string | null> {
    if (!task.due?.date) {
      Logger.debug('Task has no due date, skipping', task.id);
      return null;
    }

    // Get user's timezone from cache or API
    const userTimezone = await this.getUserTimezone();

    // Check if task already has time
    if (task.due.datetime && this.hasTime(task.due.datetime)) {
      Logger.debug('Task already has time, skipping', task.id);
      return null;
    }

    // Parse the due date
    const dueDate = new Date(task.due.date);
    const today = new Date();
    
    let targetHour: number;
    
    // If the task is due today and it's already past 8 AM, schedule for later in the day
    if (dueDate.toDateString() === today.toDateString() && today.getHours() >= 8) {
      // Schedule 1-16 hours from now (but not past midnight)
      const hoursFromNow = Math.floor(Math.random() * Math.min(16, 24 - today.getHours())) + 1;
      targetHour = Math.min(today.getHours() + hoursFromNow, 23);
    } else {
      // Schedule between 8-11 AM (as per original logic)
      targetHour = 8 + Math.floor(Math.random() * 3);
    }

    // Create the new datetime in user's timezone
    const newDateTime = new Date(dueDate);
    newDateTime.setHours(targetHour, 0, 0, 0);

    // Format as RFC3339 string for Todoist API (YYYY-MM-DDTHH:MM:SS)
    const year = newDateTime.getFullYear();
    const month = String(newDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(newDateTime.getDate()).padStart(2, '0');
    const hour = String(newDateTime.getHours()).padStart(2, '0');
    const minute = String(newDateTime.getMinutes()).padStart(2, '0');
    const second = String(newDateTime.getSeconds()).padStart(2, '0');
    
    const rfc3339String = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    
    Logger.info(`Scheduling task "${task.content}" for ${TimeUtils.formatTimeInTimezone(newDateTime, userTimezone)}`);
    
    return rfc3339String;
  }

  /**
   * Set time for a specific task
   */
  async setTimeForTask(taskId: string, checked: boolean): Promise<void> {
    try {
      // Skip if task is checked/completed
      if (checked) {
        Logger.debug('Task is completed, skipping time setting', taskId);
        return;
      }

      // Get the task
      const task = await this.todoist.getTask(taskId);
      
      // Generate new time
      const newDateTime = await this.generateTimeForTask(task);
      
      if (!newDateTime) {
        return; // Nothing to update
      }

      // Update the task with new time
      await this.todoist.updateTask(taskId, {
        due: {
          date: task.due!.date,
          datetime: newDateTime,
          timezone: task.due?.timezone
        }
      });

      Logger.info(`Successfully set time for task: ${task.content}`);
      
    } catch (error) {
      Logger.error('Error setting time for task:', error, { taskId });
    }
  }

  /**
   * Process all tasks that need time setting
   */
  async processAllTasks(): Promise<void> {
    try {
      const tasks = await this.todoist.getTasks();
      
      for (const task of tasks) {
        await this.setTimeForTask(task.id, false);
      }
      
    } catch (error) {
      Logger.error('Error processing all tasks:', error);
    }
  }
}