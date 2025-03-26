import { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';

export function useOrderSocket(orderId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [orderStatus, setOrderStatus] = useState('-');
  const [customerId, setCustomerId] = useState('-');
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!orderId) return;

    const socketUrl = Constants.expoConfig?.extra?.socketUrl;
    console.log("🔌 WebSocket 주소:", socketUrl);

    const ws = new WebSocket(`${socketUrl}/ws/orders`);
    socketRef.current = ws;

    ws.onopen = () => {
      addLog(`🟢 WebSocket 연결됨: ${orderId}`);
      ws.send(orderId);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrderStatus(data.status);
      setCustomerId(data.customerId);
      addLog(`📦 상태 수신: ${event.data}`);
    };

    ws.onerror = () => addLog(`❌ WebSocket 오류 발생`);
    ws.onclose = () => addLog(`🔌 연결 종료됨`);

    return () => {
      ws.close();
    };
  }, [orderId]);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
  };

  const updateStatus = async (status: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'UPDATE_STATUS',
        orderId : Number(orderId),
        status,
        updatedAt: new Date().toISOString(),
      };
      socketRef.current.send(JSON.stringify(message));
      addLog(`⬆️ 상태 변경 전송: ${JSON.stringify(message)}`);
    } else {
      addLog('⚠️ WebSocket 연결되지 않음');
    }
  };

  return { orderStatus, customerId, log, updateStatus };
}
