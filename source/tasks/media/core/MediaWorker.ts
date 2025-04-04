import type { IWorker } from "../../../app/interfaces/IWorker";

export class MediaWorker implements IWorker {
  public constructor() {}

  public run(): void {
    // Implement the logic for the media worker here
    console.log("MediaWorker is running...");
  }
}
