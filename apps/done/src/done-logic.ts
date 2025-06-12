import { TodoistClient, TodoistTask } from '@shared/todoist-client';
import { Logger } from '@shared/utils';

export class DoneLogic {
  private todoist: TodoistClient;
  private readonly STRIKE_CHAR = '\u0336';

  constructor(token: string) {
    this.todoist = new TodoistClient(token);
  }

  /**
   * Check if text is already strikethrough
   */
  private isAlreadyStrikethrough(text: string): boolean {
    return text.includes(this.STRIKE_CHAR);
  }

  /**
   * Add strikethrough to text
   */
  private addStrikethrough(text: string): string {
    let result = '';
    for (const char of text) {
      result += this.STRIKE_CHAR + char;
    }
    result += this.STRIKE_CHAR;
    return result;
  }

  /**
   * Remove strikethrough from text
   */
  private removeStrikethrough(text: string): string {
    return text.replace(new RegExp(this.STRIKE_CHAR, 'g'), '');
  }

  /**
   * Check if task has time component
   */
  private hasTime(dateTime?: string): boolean {
    return dateTime ? dateTime.includes(':') : false;
  }

  /**
   * Remove time from task due date
   */
  private removeTimeFromDate(dateTime: string): string {
    return dateTime.split('T')[0];
  }

  /**
   * Handle task completion - add strikethrough and remove time
   */
  async handleTaskCompleted(taskId: string): Promise<void> {
    try {
      const task = await this.todoist.getTask(taskId);
      
      // Add strikethrough to task content
      if (!this.isAlreadyStrikethrough(task.content)) {
        const newContent = this.addStrikethrough(task.content);
        Logger.info(`Adding strikethrough to task: "${task.content}" -> "${newContent}"`);
        
        await this.todoist.updateTask(taskId, {
          content: newContent
        });
      } else {
        Logger.debug('Task already has strikethrough, skipping', taskId);
      }

      // Remove time from due date if it exists
      if (task.due?.datetime && this.hasTime(task.due.datetime)) {
        const newDate = this.removeTimeFromDate(task.due.datetime);
        Logger.info(`Removing time from task due date: ${task.due.datetime} -> ${newDate}`);
        
        await this.todoist.updateTask(taskId, {
          due: {
            date: newDate
          }
        });
      } else {
        Logger.debug('Task has no time component or no due date, skipping time removal', taskId);
      }

    } catch (error) {
      Logger.error('Error handling completed task:', error, { taskId });
    }
  }

  /**
   * Handle task uncompleted - remove strikethrough
   */
  async handleTaskUncompleted(taskId: string): Promise<void> {
    try {
      const task = await this.todoist.getTask(taskId);
      
      // Remove strikethrough from task content
      if (this.isAlreadyStrikethrough(task.content)) {
        const newContent = this.removeStrikethrough(task.content);
        Logger.info(`Removing strikethrough from task: "${task.content}" -> "${newContent}"`);
        
        await this.todoist.updateTask(taskId, {
          content: newContent
        });
      } else {
        Logger.debug('Task does not have strikethrough, skipping', taskId);
      }

    } catch (error) {
      Logger.error('Error handling uncompleted task:', error, { taskId });
    }
  }

  /**
   * Process task based on checked status
   */
  async processTask(taskId: string, checked: boolean): Promise<void> {
    if (checked) {
      await this.handleTaskCompleted(taskId);
    } else {
      await this.handleTaskUncompleted(taskId);
    }
  }
}