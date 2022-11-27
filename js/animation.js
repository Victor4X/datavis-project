export class Animation {
	constructor(delayTime, callback) {
		this.delayTime = delayTime;
		this.callback = callback;
		this.stopAnimation = false;
	}

	start() {
		window.requestAnimationFrame((timestamp) => {
			this.startTime = 0;
			this.update(timestamp);
		});
	}
	
	update(timestamp) {
		if (timestamp - this.startTime >= this.delayTime()) {
			this.startTime = timestamp;
			this.callback(timestamp)

		}

		if (!this.stopAnimation) {
			window.requestAnimationFrame((timestamp) =>
				this.update(timestamp)
			);
		}
	}

	stop() {
		this.stopAnimation = true;
	}
}
