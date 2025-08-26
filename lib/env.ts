// env.js loader for browser: import and use window.__env
export function getEnvVar(key: string) {
  if (typeof window !== 'undefined' && window.__env && key in window.__env) {
    return window.__env[key];
  }
  return undefined;
}

export function isDevMode() {
  const envValue = getEnvVar('NEXT_PUBLIC_DEV_MODE');
  const devMode = envValue === 'true';
  return devMode;
}
