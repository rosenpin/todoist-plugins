import { TodoistClient, TodoistTask } from '@shared/todoist-client';
import { Logger, TimeUtils, getHourInTimezone } from '@shared/utils';
import { UserDatabase } from '@shared/db';

export class DefTimeLogic {
  private todoist: TodoistClient;
  private cachedUser: { id: string; timezone: string } | null = null;
  private db: UserDatabase;

  constructor(token: string, db: UserDatabase) {
    this.todoist = new TodoistClient(token);
    this.db = db;
  }

  /**
   * Check if a task already has a time component
   */
   private hasTime(dateTime?: string): boolean {
    return dateTime ? dateTime.includes(':') : false;
  }

  /**
   * Get user timezone from database with caching
   */
  private async getUserTimezone(): Promise<string> {
    if (this.cachedUser) {
      Logger.debug(`Using cached user timezone: ${this.cachedUser.timezone}`);
      return this.cachedUser.timezone;
    }

    try {
      const user = await this.todoist.getUser();
      Logger.debug(`Getting timezone for user: ${user.id}`);
      
      // Get user from database to check for configured timezone
      const dbUser = await this.db.getUserById(user.id);
      Logger.debug(`Database user object:`, JSON.stringify(dbUser));
      let userTimezone = 'UTC'; // Default fallback
      
      if (dbUser && dbUser.timezone) {
        userTimezone = dbUser.timezone;
        Logger.debug(`Using database timezone: ${userTimezone}`);
      } else {
        Logger.debug(`No timezone configured for user ${user.id}, using UTC default`);
      }
      
      this.cachedUser = { id: user.id, timezone: userTimezone };
      return userTimezone;
    } catch (error) {
      Logger.warn('Failed to get user timezone, using UTC as fallback:', error);
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

    // Get current time in user's timezone using the timezone utility
    const currentHour = getHourInTimezone(userTimezone);
    
    // Parse the due date
    const dueDate = new Date(task.due.date);
    const todayInUserTz = new Date(now.toLocaleDateString("en-US", {timeZone: userTimezone}));
    
    let targetHour: number;
    
    // Check if task is due today
    if (dueDate.toDateString() === todayInUserTz.toDateString()) {
      // Task is due today - schedule between current hour+1 and 18, or at 18 if past 18
      if (currentHour >= 18) {
        targetHour = 18;
      } else {
        // Schedule randomly between (currentHour + 1) and 18
        const minHour = Math.max(currentHour + 1, 9); // Never before 9am
        const maxHour = 18;
        targetHour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
      }
    } else {
      // Task is due on a different day - schedule between 9-18
      targetHour = Math.floor(Math.random() * (18 - 9 + 1)) + 9;
    }

    // Create the new datetime - parse the due date and set the time
    const taskDateTime = new Date(task.due.date + 'T00:00:00');
    taskDateTime.setHours(targetHour, 0, 0, 0);

    // Convert to RFC3339 format in user timezone (without Z suffix for local time)
    const year = taskDateTime.getFullYear();
    const month = String(taskDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(taskDateTime.getDate()).padStart(2, '0');
    const hour = String(taskDateTime.getHours()).padStart(2, '0');
    const minute = String(taskDateTime.getMinutes()).padStart(2, '0');
    const second = String(taskDateTime.getSeconds()).padStart(2, '0');
    
    // Format as local datetime (without Z - Todoist API handles timezone conversion)
    const datetimeString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    
    Logger.info(`Scheduling task "${task.content}" for ${targetHour}:00 in timezone ${userTimezone}`);
    
    return datetimeString;
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
      Logger.debug(`Full task object:`, JSON.stringify(task));
      
      // Generate new time
      const newDateTime = await this.generateTimeForTask(task);
      
      if (!newDateTime) {
        return; // Nothing to update
      }

      // Get user timezone for the update
      const userTimezone = await this.getUserTimezone();

      // Update the task with new time
      await this.todoist.updateTask(taskId, {
        due: {
          date: task.due!.date,
          datetime: newDateTime,
          timezone: userTimezone
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