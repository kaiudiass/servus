import { useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    
    if (!user || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    async function registerPush() {
      try {
        
        if (Notification.permission === 'denied') {
          console.log('Permissão para notificações foi negada pelo usuário.');
          return;
        }

        
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') return;
        }

        
        const registration = await navigator.serviceWorker.ready;

        
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          
          const response = await api.get('/push/vapid-public-key');
          const vapidPublicKey = response.data.data.publicKey;
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        }

        
        await api.post('/push/subscribe', { subscription });
        console.log('Inscrição Push enviada com sucesso para o backend.');

      } catch (error) {
        console.error('Erro ao registrar push notifications:', error);
      }
    }

    registerPush();
  }, [user]);
}
