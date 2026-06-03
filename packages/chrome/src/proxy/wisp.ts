import {
	BareCompatibleClient,
	type ProxyTransport,
} from "@mercuryworkshop/proxy-transports";
import AnuraTransport from "./anuraTransport";

export let bare: BareCompatibleClient;
export let transport: ProxyTransport;
export let wispUrl: string;

export function setWispUrl(wispurl: string) {
	wispUrl = wispurl;

	transport = new AnuraTransport();
	bare = new BareCompatibleClient(transport);
}

// if (import.meta.env.VITE_WISP_URL) {
// 	setWispUrl(import.meta.env.VITE_WISP_URL);
// }
