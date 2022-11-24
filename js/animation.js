export class Animation {
	constructor(delayTime, callback) {
		this.delayTime = delayTime;
		this.callback = callback;
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

		window.requestAnimationFrame((timestamp) =>
			this.update(timestamp)
		);
	}
}
