// Queue Consumer Handler - 处理异步 R2 文件删除
import { StorageService } from '../services/storage';
import type { Env } from '../types';
import type { QueueMessage } from '../types/queue';

export async function handleQueueBatch(
  batch: MessageBatch<QueueMessage>,
  env: Env
): Promise<void> {
  const storage = new StorageService(env.R2_BUCKET);

  for (const message of batch.messages) {
    try {
      switch (message.body.type) {
        case 'delete_image':
          console.log(`Deleting R2 files for image: ${message.body.imageId}`);
          await storage.deleteImageFiles(message.body.paths);
          break;

        case 'delete_tag_images':
          console.log(`Deleting R2 files for tag: ${message.body.tagName}, ${message.body.imagePaths.length} images`);
          await Promise.all(
            message.body.imagePaths.map(img => storage.deleteImageFiles(img.paths))
          );
          break;
      }
      message.ack();
    } catch (error) {
      console.error('Queue message failed:', error);
      message.retry();
    }
  }
}
