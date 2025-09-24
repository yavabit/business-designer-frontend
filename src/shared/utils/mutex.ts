export class Mutex {
    private locked = false;
    private queue: (() => void)[] = [];

    async acquire(): Promise<() => void> {
        return new Promise(resolve => {
            if (!this.locked) {
                this.locked = true;
                resolve(this.release.bind(this));
            } else {
                this.queue.push(() => {
                    this.locked = true;
                    resolve(this.release.bind(this));
                });
            }
        });
    }

    private release(): void {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next?.();
        } else {
            this.locked = false;
        }
    }
}

export const refreshMutex = new Mutex();