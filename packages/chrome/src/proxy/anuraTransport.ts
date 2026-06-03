import type {
	RawHeaders,
	TransferrableResponse,
	ProxyTransport,
} from "@mercuryworkshop/proxy-transports";

export default class AnuraTransportClient implements ProxyTransport {
	ready = false;
	constructor() {}

	async init() {
		this.ready = true;
	}

	async request(
		remote: URL,
		method: string,
		body: BodyInit | null,
		headers: RawHeaders,
		signal: AbortSignal | undefined
	): Promise<TransferrableResponse> {
		const headersObj: Record<string, string> = {};
		for (const [key, value] of headers) {
			headersObj[key] = value;
		}
		const payload = await top.anura.net.fetch(remote.href, {
			method,
			headers: headersObj,
			body,
			redirect: "manual",
			signal: signal,
		});

		return {
			body: payload.body!,
			headers: payload.raw_headers,
			status: payload.status,
			statusText: payload.statusText,
		};
	}

	connect(
		url: URL,
		protocols: string[],
		requestHeaders: RawHeaders,
		onopen: (protocol: string, extensions: string) => void,
		onmessage: (data: Blob | ArrayBuffer | string) => void,
		onclose: (code: number, reason: string) => void,
		onerror: (error: string) => void
	): [
		(data: Blob | ArrayBuffer | string) => void,
		(code: number, reason: string) => void,
	] {
		const headersObj: Record<string, string> = {};
		for (const [key, value] of requestHeaders) {
			headersObj[key] = value;
		}

		const socket = new top.anura.net.WebSocket(url.toString(), protocols, {
			headers: headersObj,
		});

		socket.binaryType = "arraybuffer";

		socket.onopen = (event: Event) => {
			onopen("", "");
		};
		socket.onclose = (event: CloseEvent) => {
			onclose(event.code, event.reason);
		};
		socket.onerror = (event: Event) => {
			onerror("");
		};
		socket.onmessage = (event: MessageEvent) => {
			onmessage(event.data);
		};

		return [
			(data) => {
				socket.send(data);
			},
			(code, reason) => {
				socket.close(code, reason);
			},
		];
	}
}
