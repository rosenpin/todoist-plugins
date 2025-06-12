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

  constructor(token: string) {
    this.api = new TodoistApi(token);
  }

  async getUser(): Promise<TodoistUser> {
    // Note: Todoist API v5.0.0 doesn't provide user endpoints
    // This is a placeholder - user info should be cached from OAuth flow
    throw new Error('User info must be cached from OAuth response - API v5.0.0 removed user endpoints');
  }

  async getTasks(filter?: (task: TodoistTask) => boolean): Promise<TodoistTask[]> {
    const tasks = await this.api.getTasks();
    const mappedTasks = (tasks as unknown as any[]).map((task: any) => ({
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
    if (updates.due) updateData.due = updates.due;

    await this.api.updateTask(taskId, updateData);
  }

  async getLabels(): Promise<TodoistLabel[]> {
    const labels = await this.api.getLabels();
    return (labels as unknown as any[]).map((label: any) => ({
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
    return (projects as unknown as any[]).map((project: any) => ({
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