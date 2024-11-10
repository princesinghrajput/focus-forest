import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Switch, Surface, Button, Searchbar, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useApp } from '../context/AppContext';
import { useAppPermissions } from '../hooks/useAppPermissions';

interface AppInfo {
  id: string;
  name: string;
  icon: string;
  isRestricted: boolean;
  category: string;
}

export default function AppRestrictionsScreen() {
  const { hasPermission, isLoading, requestPermissions } = useAppPermissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<AppInfo[]>([
    // Mock data - replace with actual device apps
    { id: '1', name: 'Instagram', icon: 'instagram', isRestricted: true, category: 'Social' },
    { id: '2', name: 'Facebook', icon: 'facebook', isRestricted: true, category: 'Social' },
    { id: '3', name: 'YouTube', icon: 'youtube', isRestricted: false, category: 'Entertainment' },
    // Add more apps...
  ]);

  const categories = [...new Set(apps.map(app => app.category))];

  const toggleAppRestriction = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, isRestricted: !app.isRestricted } : app
    ));
  };

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const restrictAll = () => {
    setApps(apps.map(app => ({ ...app, isRestricted: true })));
  };

  const unrestrictAll = () => {
    setApps(apps.map(app => ({ ...app, isRestricted: false })));
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.message}>Permission Required</Text>
        <Button mode="contained" onPress={requestPermissions}>
          Grant Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.title}>App Restrictions</Text>
        <Text style={styles.subtitle}>
          Select apps to restrict during focus sessions
        </Text>
      </Surface>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search apps"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={restrictAll}
          style={styles.actionButton}
        >
          Restrict All
        </Button>
        <Button
          mode="outlined"
          onPress={unrestrictAll}
          style={styles.actionButton}
        >
          Clear All
        </Button>
      </View>

      <ScrollView style={styles.appList}>
        {categories.map(category => (
          <View key={category}>
            <Text style={styles.categoryHeader}>{category}</Text>
            {filteredApps
              .filter(app => app.category === category)
              .map(app => (
                <Surface key={app.id} style={styles.appItem}>
                  <View style={styles.appInfo}>
                    <MaterialCommunityIcons
                      name={app.icon as any}
                      size={32}
                      color="#666666"
                    />
                    <Text style={styles.appName}>{app.name}</Text>
                  </View>
                  <Switch
                    value={app.isRestricted}
                    onValueChange={() => toggleAppRestriction(app.id)}
                  />
                </Surface>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: wp('5%'),
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: wp('3.5%'),
    color: '#666666',
    marginTop: hp('1%'),
  },
  searchContainer: {
    padding: wp('4%'),
  },
  searchbar: {
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: wp('4%'),
  },
  actionButton: {
    flex: 1,
    marginHorizontal: wp('2%'),
  },
  appList: {
    flex: 1,
    padding: wp('4%'),
  },
  categoryHeader: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#2E7D32',
    marginVertical: hp('1%'),
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('3%'),
    marginBottom: hp('1%'),
    borderRadius: wp('2%'),
    backgroundColor: '#FFFFFF',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: wp('4%'),
    marginLeft: wp('3%'),
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: wp('4%'),
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
}); 