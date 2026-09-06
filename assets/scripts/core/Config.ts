/**
 * Central environment config. Replaces the hardcoded
 * "http://207.244.225.100:3050" literal duplicated in the Unity
 * SocketManager.cs and FaceBookManager.cs.
 *
 * NOTE: as of this writing the backend at this host is offline. This
 * module intentionally does not attempt to reach it at load time -
 * SocketService only connects when something calls SocketService.connect().
 */

export type Environment = 'dev' | 'staging' | 'prod';

interface EnvConfig {
    backendHost: string;
    backendPort: number;
    useTls: boolean;
}

const ENV_CONFIGS: Record<Environment, EnvConfig> = {
    dev: { backendHost: '207.244.225.100', backendPort: 3050, useTls: false },
    staging: { backendHost: '207.244.225.100', backendPort: 3050, useTls: false },
    prod: { backendHost: '207.244.225.100', backendPort: 3050, useTls: false },
};

class ConfigService {
    private _env: Environment = 'dev';

    get env(): Environment {
        return this._env;
    }

    set env(value: Environment) {
        this._env = value;
    }

    private get current(): EnvConfig {
        return ENV_CONFIGS[this._env];
    }

    get httpBaseUrl(): string {
        const { backendHost, backendPort, useTls } = this.current;
        return `${useTls ? 'https' : 'http'}://${backendHost}:${backendPort}`;
    }

    get socketUrl(): string {
        // socket.io-client takes the same http(s) URL and negotiates the
        // websocket upgrade itself - matches the Unity client's
        // Transport.TransportProtocol.WebSocket forcing, achieved instead via
        // { transports: ['websocket'] } in SocketService's connect options.
        return this.httpBaseUrl;
    }

    get authEndpoint(): string {
        return `${this.httpBaseUrl}/auth`;
    }
}

export const Config = new ConfigService();
