# Звук уведомлений

Для работы звуковых уведомлений нужно добавить файл `notification.mp3` в папку `public/`.

Вы можете:
1. Скачать бесплатный звук с https://notificationsounds.com/
2. Или использовать любой короткий звук (0.5-1 секунда)
3. Сохранить его как `public/notification.mp3`

Альтернативно, можно использовать встроенный браузерный звук, изменив код в `notification-bell.tsx`:

```typescript
function playNotificationSound() {
  // Используем Web Audio API для генерации простого звука
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}
```
