export function setBasicAuth(login: string, password: string) {
    const b64 = btoa(`${login}:${password}`);
    localStorage.setItem("basicAuth", b64);
}

export function clearBasicAuth() {
    localStorage.removeItem("basicAuth");
}

export function getBasicAuth(): string | null {
    return localStorage.getItem("basicAuth");
}

export function fetchWithAuth(
    input: RequestInfo,
    init: RequestInit = {}
): Promise<Response> {
    const headers = new Headers(init.headers);
    const basicAuth = getBasicAuth();
    if (basicAuth) {
        headers.set("Authorization", `Basic ${basicAuth}`);
    }
    return fetch(input, { ...init, headers });
}
