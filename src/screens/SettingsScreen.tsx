import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider } from 'react-native-paper';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Notifications</List.Subheader>
        <List.Item
          title="Push Notifications"
          right={() => (
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Sound Effects"
          right={() => (
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          onPress={() => {}}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          onPress={() => {}}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
}); 