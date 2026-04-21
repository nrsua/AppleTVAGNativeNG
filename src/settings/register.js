export function registerSettingsModule(registerFn) {
  if (typeof registerFn === 'function') registerFn();
}
