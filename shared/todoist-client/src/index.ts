import { TodoistApi } from '@doist/todoist-api-typescript';

export interface TodoistUser {
  id: string;
  email: string;
  full_name: string;
  timezone: string;
}

export interface TodoistTask {
  id: string;
  content: string;
  project_id: string;
  labels: string[];
  due?: {
    date: string;
    datetime?: string;
    timezone?: string;
  };
}

export interface TodoistLabel {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface TodoistProject {
  id: string;
  name: string;
  color: string;
  order: number;
}

export class TodoistClient {
  private api: TodoistApi;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.api = new TodoistApi(token);
  }

  async getUser(): Promise<TodoistUser> {
    // Try REST API v1 user endpoint first
    try {
      const response = await fetch('https://api.todoist.com/rest/v1/user', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          timezone: user.timezone
        };
      }
    } catch (error) {
      console.log('REST API failed, trying Sync API...');
    }

    // Fallback to Sync API
    const response = await fetch('https://api.todoist.com/sync/v9/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'sync_token=*&resource_types=["user"]'
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    const data = await response.json();
    const user = data.user;

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      timezone: user.timezone
    };
  }

  async getTasks(filter?: (task: TodoistTask) => boolean): Promise<TodoistTask[]> {
    const tasks = await this.api.getTasks();
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    
    const mappedTasks = tasksArray.map((task: any) => ({
      id: task.id,
      content: task.content,
      project_id: task.projectId,
      labels: task.labels,
      due: task.due ? {
        date: task.due.date,
        datetime: task.due.datetime || undefined,
        timezone: task.due.timezone || undefined
      } : undefined
    }));

    return filter ? mappedTasks.filter(filter) : mappedTasks;
  }

  async getTask(taskId: string): Promise<TodoistTask> {
    const task = await this.api.getTask(taskId);
    return {
      id: task.id,
      content: task.content,
      project_id: task.projectId,
      labels: task.labels,
      due: task.due ? {
        date: task.due.date,
        datetime: task.due.datetime || undefined,
        timezone: task.due.timezone || undefined
      } : undefined
    };
  }

  async updateTask(taskId: string, updates: Partial<TodoistTask>): Promise<void> {
    const updateData: any = {};

    if (updates.content) updateData.content = updates.content;
    if (updates.labels) updateData.labels = updates.labels;
    
    // Handle due date updates - convert from nested object to flat fields
    if (updates.due) {
      if (updates.due.date) updateData.due_date = updates.due.date;
      if (updates.due.datetime) updateData.due_datetime = updates.due.datetime;
      if (updates.due.timezone) updateData.due_lang = updates.due.timezone;
    }

    await this.api.updateTask(taskId, updateData);
  }

  async getLabels(): Promise<TodoistLabel[]> {
    const labels = await this.api.getLabels();
    
    // Ensure we have an array - handle the response properly
    const labelsArray = Array.isArray(labels) ? labels : [];
    
    return labelsArray.map((label: any) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      order: label.order || 0
    }));
  }

  async createLabel(name: string, color?: string): Promise<TodoistLabel> {
    const label = await this.api.addLabel({ name, color });
    return {
      id: label.id,
      name: label.name,
      color: label.color || '',
      order: (label as any).order || 0
    };
  }

  async getProjects(): Promise<TodoistProject[]> {
    const projects = await this.api.getProjects();
    const projectsArray = Array.isArray(projects) ? projects : [];
    
    return projectsArray.map((project: any) => ({
      id: project.id,
      name: project.name,
      color: project.color,
      order: (project as any).viewStyle?.order || 0
    }));
  }

  async getProject(projectId: string): Promise<TodoistProject> {
    const project = await this.api.getProject(projectId);
    return {
      id: project.id,
      name: project.name,
      color: project.color,
      order: (project as any).viewStyle?.order || 0
    };
  }

  async createProject(name: string, color?: string): Promise<TodoistProject> {
    const project = await this.api.addProject({ name, color });
    return {
      id: project.id,
      name: project.name,
      color: project.color || '',
      order: (project as any).viewStyle?.order || 0
    };
  }
}

export default TodoistClient;