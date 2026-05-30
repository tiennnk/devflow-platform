import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventsGateway } from '../events/events.gateway';

@Processor('tasks')
export class TasksProcessor extends WorkerHost {
  constructor(private readonly eventsGateway: EventsGateway) {
    super();
  }

  process(job: Job): Promise<void> {
    if (job.name === 'task:created') {
      this.eventsGateway.emitTaskCreated(job.data);
    }
    if (job.name === 'task:updated') {
      this.eventsGateway.emitTaskUpdated(job.data);
    }
    return Promise.resolve();
  }
}
