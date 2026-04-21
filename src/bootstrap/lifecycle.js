export function installLifecycle({ startPlugin, schedulePatch }) {
  startPlugin();
  schedulePatch();
}
