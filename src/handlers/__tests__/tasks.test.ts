import { TasksHandler } from '../tasks';
import { MockArivoApiClient } from '../../__tests__/utils/mock-api-client';

describe('TasksHandler', () => {
  let handler: TasksHandler;
  let mockClient: MockArivoApiClient;

  beforeEach(() => {
    mockClient = new MockArivoApiClient() as any;
    handler = new TasksHandler(mockClient as any);
  });

  afterEach(() => {
    mockClient.reset();
  });

  describe('listTasks', () => {
    it('should list tasks without filters', async () => {
      const mockTasks = [
        { id: 1, name: 'Call client', done: false, due_date: '2025-01-25T10:00:00Z' },
        { id: 2, name: 'Send proposal', done: false, due_date: '2025-01-26T14:00:00Z' },
        { id: 3, name: 'Follow up', done: true, completed_at: '2025-01-20T15:00:00Z' }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks();

      expect(result).toEqual(mockTasks);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/tasks');
    });

    it('should list tasks with pagination', async () => {
      const mockTasks = [{ id: 1, name: 'Task 1', done: false }];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ limit: 10, offset: 5 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by name', async () => {
      const mockTasks = [{ id: 1, name: 'Call client', done: false }];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ name: 'Call client' });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by done status true', async () => {
      const mockTasks = [
        { id: 3, name: 'Completed task', done: true, completed_at: '2025-01-20T10:00:00Z' }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ done: true });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by done status false', async () => {
      const mockTasks = [
        { id: 1, name: 'Pending task', done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ done: false });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by task_type_id', async () => {
      const mockTasks = [
        { id: 1, name: 'Call task', task_type_id: 1, done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ task_type_id: 1 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by contact_id', async () => {
      const mockTasks = [
        { id: 1, name: 'Contact task', contact_id: 100, done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ contact_id: 100 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by deal_id', async () => {
      const mockTasks = [
        { id: 2, name: 'Deal task', deal_id: 200, done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ deal_id: 200 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by tags', async () => {
      const mockTasks = [
        { id: 1, name: 'Tagged task', tags: ['urgent', 'important'], done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ tags: 'urgent,important' });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by user_id', async () => {
      const mockTasks = [
        { id: 1, name: 'User task', user_id: 10, done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ user_id: 10 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by creator_id', async () => {
      const mockTasks = [
        { id: 1, name: 'Created task', creator_id: 5, done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ creator_id: 5 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should filter by team_id', async () => {
      const mockTasks = [
        { id: 1, name: 'Team task', team_id: 3, done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ team_id: 3 });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle search parameter', async () => {
      const mockTasks = [
        { id: 1, name: 'Call important client', done: false }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ search: 'important' });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle deprecated status parameter', async () => {
      const mockTasks = [{ id: 1, name: 'Task', done: false }];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ status: 'pending' });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle sorting options', async () => {
      const mockTasks = [
        { id: 1, name: 'Task A', due_date: '2025-01-25T10:00:00Z' },
        { id: 2, name: 'Task B', due_date: '2025-01-26T10:00:00Z' }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({
        sort_field: 'due_date',
        sort_order: 'asc'
      });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });

    it('should handle multiple filters combined', async () => {
      const mockTasks = [
        {
          id: 1,
          name: 'Complex task',
          done: false,
          contact_id: 100,
          deal_id: 200,
          user_id: 10,
          team_id: 5,
          task_type_id: 1,
          tags: ['urgent']
        }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({
        done: false,
        contact_id: 100,
        deal_id: 200,
        user_id: 10,
        team_id: 5,
        task_type_id: 1,
        tags: 'urgent',
        limit: 20
      });

      expect(result).toEqual(mockTasks);
      expect(mockClient.getLastCall().method).toBe('GET');
    });
  });

  describe('getTask', () => {
    it('should get a task by id', async () => {
      const mockTask = {
        id: 123,
        object: 'task',
        name: 'Call client about proposal',
        done: false,
        task_type_id: 1,
        due_date: '2025-01-25T14:00:00Z',
        comment: 'Discuss pricing and timeline',
        contact_id: 100,
        deal_id: 200,
        user_id: 5,
        team_id: 2,
        creator_id: 5,
        tags: ['important', 'follow-up'],
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-20T10:00:00Z'
      };
      mockClient.mockGet('/tasks/123', mockTask);

      const result = await handler.getTask({ id: 123 });

      expect(result).toEqual(mockTask);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('GET');
      expect(lastCall.path).toBe('/tasks/123');
    });

    it('should handle task with minimal fields', async () => {
      const mockTask = {
        id: 456,
        name: 'Simple task',
        done: false
      };
      mockClient.mockGet('/tasks/456', mockTask);

      const result = await handler.getTask({ id: 456 });

      expect(result.id).toBe(456);
      expect(result.name).toBe('Simple task');
    });

    it('should handle completed task', async () => {
      const mockTask = {
        id: 789,
        name: 'Completed task',
        done: true,
        completed_at: '2025-01-20T15:30:00Z'
      };
      mockClient.mockGet('/tasks/789', mockTask);

      const result = await handler.getTask({ id: 789 });

      expect(result.done).toBe(true);
      expect(result.completed_at).toBeDefined();
    });

    it('should handle task with recurrence', async () => {
      const mockTask = {
        id: 111,
        name: 'Recurring task',
        done: false,
        task_recurrence: {
          frequency: 1,
          interval: 1,
          monday: true,
          wednesday: true,
          friday: true
        }
      };
      mockClient.mockGet('/tasks/111', mockTask);

      const result = await handler.getTask({ id: 111 });

      expect(result.task_recurrence).toBeDefined();
      expect(result.task_recurrence!.frequency).toBe(1);
      expect(result.task_recurrence!.monday).toBe(true);
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.getTask({ id: undefined as any })
      ).rejects.toThrow('Task ID is required');
    });
  });

  describe('createTask', () => {
    it('should create a task with basic info', async () => {
      const newTask = {
        name: 'New task',
        done: false
      };
      const createdTask = {
        id: 123,
        ...newTask,
        created_at: '2025-01-20T14:30:00Z'
      };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result).toEqual(createdTask);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('POST');
      expect(lastCall.path).toBe('/tasks');
      expect(lastCall.data).toEqual(newTask);
    });

    it('should create task with due date', async () => {
      const newTask = {
        name: 'Task with deadline',
        due_date: '2025-01-30T10:00:00Z',
        done: false
      };
      const createdTask = { id: 456, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.due_date).toBe('2025-01-30T10:00:00Z');
    });

    it('should create task with task_type_id', async () => {
      const newTask = {
        name: 'Call task',
        task_type_id: 1,
        done: false
      };
      const createdTask = { id: 789, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.task_type_id).toBe(1);
    });

    it('should create task associated with contact', async () => {
      const newTask = {
        name: 'Contact follow-up',
        contact_id: 100,
        done: false
      };
      const createdTask = { id: 111, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.contact_id).toBe(100);
    });

    it('should create task associated with deal', async () => {
      const newTask = {
        name: 'Deal follow-up',
        deal_id: 200,
        done: false
      };
      const createdTask = { id: 222, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.deal_id).toBe(200);
    });

    it('should create task with comment', async () => {
      const newTask = {
        name: 'Task with notes',
        comment: 'Remember to prepare the presentation slides',
        done: false
      };
      const createdTask = { id: 333, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.comment).toBe('Remember to prepare the presentation slides');
    });

    it('should create task with tags', async () => {
      const newTask = {
        name: 'Tagged task',
        tags: ['urgent', 'important', 'client'],
        done: false
      };
      const createdTask = { id: 444, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.tags).toEqual(['urgent', 'important', 'client']);
    });

    it('should create task with user and team assignment', async () => {
      const newTask = {
        name: 'Assigned task',
        user_id: 10,
        team_id: 5,
        done: false
      };
      const createdTask = { id: 555, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.user_id).toBe(10);
      expect(result.team_id).toBe(5);
    });

    it('should create task with recurrence', async () => {
      const newTask = {
        name: 'Weekly recurring task',
        done: false,
        task_recurrence: {
          frequency: 1,
          interval: 1,
          monday: true,
          wednesday: true,
          friday: true
        }
      };
      const createdTask = { id: 666, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.task_recurrence).toBeDefined();
      expect(result.task_recurrence!.frequency).toBe(1);
      expect(result.task_recurrence!.monday).toBe(true);
    });

    it('should create task with date range', async () => {
      const newTask = {
        name: 'Multi-day task',
        due_date: '2025-01-25T09:00:00Z',
        due_date_end: '2025-01-27T17:00:00Z',
        done: false
      };
      const createdTask = { id: 777, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: newTask });

      expect(result.due_date).toBe('2025-01-25T09:00:00Z');
      expect(result.due_date_end).toBe('2025-01-27T17:00:00Z');
    });

    it('should throw error if name is missing', async () => {
      await expect(
        handler.createTask({ task: { done: false } as any })
      ).rejects.toThrow('Task name is required');
    });

    it('should throw error if task object is missing', async () => {
      await expect(
        handler.createTask({ task: undefined as any })
      ).rejects.toThrow('Task name is required');
    });
  });

  describe('updateTask', () => {
    it('should update a task name', async () => {
      const updateData = { name: 'Updated task name' };
      const updatedTask = {
        id: 123,
        name: 'Updated task name',
        done: false,
        updated_at: '2025-01-20T16:00:00Z'
      };
      mockClient.mockPut('/tasks/123', updatedTask);

      const result = await handler.updateTask({ id: 123, task: updateData });

      expect(result).toEqual(updatedTask);
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('PUT');
      expect(lastCall.path).toBe('/tasks/123');
      expect(lastCall.data).toEqual(updateData);
    });

    it('should mark task as done', async () => {
      const updateData = { done: true };
      const updatedTask = {
        id: 456,
        name: 'Task',
        done: true,
        completed_at: '2025-01-20T16:30:00Z'
      };
      mockClient.mockPut('/tasks/456', updatedTask);

      const result = await handler.updateTask({ id: 456, task: updateData });

      expect(result.done).toBe(true);
      expect(result.completed_at).toBeDefined();
    });

    it('should update task due date', async () => {
      const updateData = { due_date: '2025-02-01T10:00:00Z' };
      const updatedTask = {
        id: 789,
        name: 'Task',
        done: false,
        due_date: '2025-02-01T10:00:00Z'
      };
      mockClient.mockPut('/tasks/789', updatedTask);

      const result = await handler.updateTask({ id: 789, task: updateData });

      expect(result.due_date).toBe('2025-02-01T10:00:00Z');
    });

    it('should update task associations', async () => {
      const updateData = {
        contact_id: 150,
        deal_id: 250
      };
      const updatedTask = {
        id: 111,
        name: 'Task',
        done: false,
        ...updateData
      };
      mockClient.mockPut('/tasks/111', updatedTask);

      const result = await handler.updateTask({ id: 111, task: updateData });

      expect(result.contact_id).toBe(150);
      expect(result.deal_id).toBe(250);
    });

    it('should update task tags', async () => {
      const updateData = { tags: ['updated', 'new-priority'] };
      const updatedTask = {
        id: 222,
        name: 'Task',
        done: false,
        tags: ['updated', 'new-priority']
      };
      mockClient.mockPut('/tasks/222', updatedTask);

      const result = await handler.updateTask({ id: 222, task: updateData });

      expect(result.tags).toEqual(['updated', 'new-priority']);
    });

    it('should update task assignment', async () => {
      const updateData = { user_id: 20, team_id: 10 };
      const updatedTask = {
        id: 333,
        name: 'Task',
        done: false,
        ...updateData
      };
      mockClient.mockPut('/tasks/333', updatedTask);

      const result = await handler.updateTask({ id: 333, task: updateData });

      expect(result.user_id).toBe(20);
      expect(result.team_id).toBe(10);
    });

    it('should update task comment', async () => {
      const updateData = { comment: 'Updated notes about the task' };
      const updatedTask = {
        id: 444,
        name: 'Task',
        done: false,
        comment: 'Updated notes about the task'
      };
      mockClient.mockPut('/tasks/444', updatedTask);

      const result = await handler.updateTask({ id: 444, task: updateData });

      expect(result.comment).toBe('Updated notes about the task');
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.updateTask({ id: undefined as any, task: { name: 'Test' } })
      ).rejects.toThrow('Task ID is required');
    });

    it('should throw error if task data is missing', async () => {
      await expect(
        handler.updateTask({ id: 123, task: undefined as any })
      ).rejects.toThrow('Task data is required');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockClient.mockDelete('/tasks/123', undefined);

      const result = await handler.deleteTask({ id: 123 });

      expect(result).toEqual({ success: true });
      const lastCall = mockClient.getLastCall();
      expect(lastCall.method).toBe('DELETE');
      expect(lastCall.path).toBe('/tasks/123');
    });

    it('should handle deleting multiple tasks sequentially', async () => {
      mockClient.mockDelete('/tasks/1', undefined);
      mockClient.mockDelete('/tasks/2', undefined);
      mockClient.mockDelete('/tasks/3', undefined);

      await handler.deleteTask({ id: 1 });
      await handler.deleteTask({ id: 2 });
      await handler.deleteTask({ id: 3 });

      const history = mockClient.getCallHistory();
      expect(history).toHaveLength(3);
      expect(history[0].path).toBe('/tasks/1');
      expect(history[1].path).toBe('/tasks/2');
      expect(history[2].path).toBe('/tasks/3');
    });

    it('should throw error if id is missing', async () => {
      await expect(
        handler.deleteTask({ id: undefined as any })
      ).rejects.toThrow('Task ID is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors when listing tasks', async () => {
      const error = new Error('Network error');
      mockClient.mockError('GET', '/tasks', error);

      await expect(handler.listTasks()).rejects.toThrow('Network error');
    });

    it('should handle errors when getting a task', async () => {
      const error = new Error('Not found');
      mockClient.mockError('GET', '/tasks/999', error);

      await expect(handler.getTask({ id: 999 })).rejects.toThrow('Not found');
    });

    it('should handle errors when creating a task', async () => {
      const error = new Error('Validation error');
      mockClient.mockError('POST', '/tasks', error);

      await expect(
        handler.createTask({ task: { name: 'Test task', done: false } })
      ).rejects.toThrow('Validation error');
    });

    it('should handle errors when updating a task', async () => {
      const error = new Error('Unauthorized');
      mockClient.mockError('PUT', '/tasks/123', error);

      await expect(
        handler.updateTask({ id: 123, task: { name: 'Updated' } })
      ).rejects.toThrow('Unauthorized');
    });

    it('should handle errors when deleting a task', async () => {
      const error = new Error('Forbidden');
      mockClient.mockError('DELETE', '/tasks/123', error);

      await expect(handler.deleteTask({ id: 123 })).rejects.toThrow('Forbidden');
    });
  });

  describe('edge cases', () => {
    it('should handle empty list response', async () => {
      mockClient.mockGet('/tasks', []);

      const result = await handler.listTasks();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle task with very long name', async () => {
      const longName = 'A'.repeat(500);
      const mockTask = { id: 1, name: longName, done: false };
      mockClient.mockGet('/tasks/1', mockTask);

      const result = await handler.getTask({ id: 1 });

      expect(result.name.length).toBe(500);
    });

    it('should handle task with special characters', async () => {
      const mockTask = {
        id: 1,
        name: 'Task with special chars: @#$%^&*()_+-={}[]|\\:";\'<>?,./~`',
        done: false
      };
      mockClient.mockGet('/tasks/1', mockTask);

      const result = await handler.getTask({ id: 1 });

      expect(result.name).toContain('@#$%^&*()');
    });

    it('should handle task with unicode characters', async () => {
      const mockTask = {
        id: 1,
        name: 'Tarefa em português 中文任务 Задача на русском 📋✅',
        done: false
      };
      mockClient.mockGet('/tasks/1', mockTask);

      const result = await handler.getTask({ id: 1 });

      expect(result.name).toContain('português');
      expect(result.name).toContain('📋');
    });

    it('should handle task with many tags', async () => {
      const tags = Array.from({ length: 50 }, (_, i) => `tag-${i + 1}`);
      const mockTask = {
        id: 1,
        name: 'Task',
        done: false,
        tags: tags
      };
      mockClient.mockGet('/tasks/1', mockTask);

      const result = await handler.getTask({ id: 1 });

      expect(result.tags).toHaveLength(50);
    });

    it('should handle recurring task with all weekdays', async () => {
      const mockTask = {
        id: 1,
        name: 'Daily task',
        done: false,
        task_recurrence: {
          frequency: 1,
          interval: 1,
          sunday: true,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true
        }
      };
      mockClient.mockGet('/tasks/1', mockTask);

      const result = await handler.getTask({ id: 1 });

      expect(result.task_recurrence!.sunday).toBe(true);
      expect(result.task_recurrence!.saturday).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle standard sales task workflow', async () => {
      // Create task
      const newTask = {
        name: 'Follow up with client',
        task_type_id: 1,
        contact_id: 100,
        deal_id: 200,
        due_date: '2025-01-25T10:00:00Z',
        user_id: 5,
        team_id: 2,
        done: false
      };
      const createdTask = { id: 1, ...newTask };
      mockClient.mockPost('/tasks', createdTask);

      const created = await handler.createTask({ task: newTask });
      expect(created.id).toBe(1);

      // Mark as done
      const updateDone = { done: true };
      const updatedTask = {
        ...createdTask,
        done: true,
        completed_at: '2025-01-25T11:00:00Z'
      };
      mockClient.mockPut('/tasks/1', updatedTask);

      const completed = await handler.updateTask({ id: 1, task: updateDone });
      expect(completed.done).toBe(true);
    });

    it('should handle daily recurring call task', async () => {
      const recurringTask = {
        name: 'Daily check-in call',
        task_type_id: 1,
        due_date: '2025-01-25T09:00:00Z',
        done: false,
        task_recurrence: {
          frequency: 1,
          interval: 1,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          sunday: false,
          saturday: false
        }
      };
      const createdTask = { id: 100, ...recurringTask };
      mockClient.mockPost('/tasks', createdTask);

      const result = await handler.createTask({ task: recurringTask });

      expect(result.task_recurrence).toBeDefined();
      expect(result.task_recurrence!.monday).toBe(true);
      expect(result.task_recurrence!.friday).toBe(true);
      expect(result.task_recurrence!.saturday).toBe(false);
    });

    it('should handle task reassignment', async () => {
      const mockTask = {
        id: 50,
        name: 'Reassigned task',
        user_id: 5,
        team_id: 2,
        done: false
      };
      mockClient.mockGet('/tasks/50', mockTask);

      const original = await handler.getTask({ id: 50 });
      expect(original.user_id).toBe(5);

      const updateData = { user_id: 10, team_id: 3 };
      const updatedTask = { ...mockTask, ...updateData };
      mockClient.mockPut('/tasks/50', updatedTask);

      const reassigned = await handler.updateTask({ id: 50, task: updateData });
      expect(reassigned.user_id).toBe(10);
      expect(reassigned.team_id).toBe(3);
    });

    it('should handle filtering completed tasks', async () => {
      const mockTasks = [
        {
          id: 10,
          name: 'Completed task 1',
          done: true,
          completed_at: '2025-01-15T10:00:00Z'
        },
        {
          id: 11,
          name: 'Completed task 2',
          done: true,
          completed_at: '2025-01-18T14:00:00Z'
        },
        {
          id: 12,
          name: 'Completed task 3',
          done: true,
          completed_at: '2025-01-20T09:00:00Z'
        }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ done: true });

      expect(result).toHaveLength(3);
      expect(result.every(task => task.done === true)).toBe(true);
    });

    it('should handle listing tasks for a specific contact', async () => {
      const mockTasks = [
        {
          id: 20,
          name: 'Call contact',
          contact_id: 100,
          done: false
        },
        {
          id: 21,
          name: 'Email contact',
          contact_id: 100,
          done: false
        },
        {
          id: 22,
          name: 'Meeting with contact',
          contact_id: 100,
          done: true
        }
      ];
      mockClient.mockGet('/tasks', mockTasks);

      const result = await handler.listTasks({ contact_id: 100 });

      expect(result).toHaveLength(3);
      expect(result.every(task => task.contact_id === 100)).toBe(true);
    });
  });
});