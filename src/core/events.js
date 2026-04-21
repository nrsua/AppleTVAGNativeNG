export function on(eventBus, event, handler) {
  if (!eventBus || !eventBus.follow) return;
  eventBus.follow(event, handler);
}
