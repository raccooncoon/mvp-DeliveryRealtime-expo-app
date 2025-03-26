import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import {useOrderSocket} from "@/hooks/useOrderSocket";

export default function HomeScreen() {
  const [inputOrderId, setInputOrderId] = useState('1000');
  const [orderId, setOrderId] = useState('');
  const { orderStatus, customerId, log, updateStatus } = useOrderSocket(orderId);

  const handleConnect = () => {
    setOrderId(inputOrderId);
  };

  return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.header}>📡 실시간 주문 상태</Text>
        </View>

        <TextInput
            style={styles.input}
            value={inputOrderId}
            onChangeText={setInputOrderId}
            placeholder="주문 ID 입력"
        />
        <Button title="연결하기" onPress={handleConnect} />

        <View style={styles.statusBox}>
          <Text style={styles.centerText}>주문 ID: {orderId || '-'}</Text>
          <Text style={styles.centerText}>고객 ID: {customerId}</Text>
          <Text style={styles.centerText}>현재 상태: {orderStatus}</Text>
        </View>

        <ScrollView style={styles.logBox}>
          {log.map((msg, idx) => (
              <Text key={idx} style={styles.centerText}>{msg}</Text>
          ))}
        </ScrollView>

        <View style={{ marginTop: 16, width: '60%' }}>
          {['ORDERED', 'PAID', 'DELIVERING', 'COMPLETED'].map((status) => (
              <View key={status} style={{ marginVertical: 6 }}>
                <Button title={status} onPress={() => updateStatus(status)} />
              </View>
          ))}
        </View>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerWrapper: {
    marginTop: 80,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    width: '80%'
  },
  statusBox: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    width: '90%'
  },
  logBox: {
    marginTop: 20,
    maxHeight: 200,
    borderWidth: 1,
    padding: 8,
    width: '90%'
  },
  centerText: {
    textAlign: 'center'
  },
});
