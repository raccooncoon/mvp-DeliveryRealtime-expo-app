import { useEffect, useRef, useState } from 'react';

export function useOrderSocket(orderId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [orderStatus, setOrderStatus] = useState('-');
  const [customerId, setCustomerId] = useState('-');
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!orderId) return;

    let uri = `ws://localhost:8080`;

    const ws = new WebSocket(`${uri}/ws/orders`);
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

  return { orderStatus, customerId, log };
}
