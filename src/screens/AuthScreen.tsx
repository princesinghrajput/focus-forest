import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function AuthScreen({ navigation, route }) {
  const [isLogin, setIsLogin] = useState(route.params?.isLogin ?? true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { signIn, signUp } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (route.params?.isLogin !== undefined) {
      setIsLogin(route.params.isLogin);
    }
  }, [route.params?.isLogin]);

  const toggleMode = () => {
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: isLogin ? width : 0,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsLogin(!isLogin);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signIn(email, password);
        navigation.navigate('Home');
      } else {
        await signUp(email, password, name);
        navigation.navigate('Home');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // In AuthScreen component, add a fallback for the animation
  const fallbackAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Simple Tree",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Tree",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100] },
          a: { "a": 0, "k": [0, 0] },
          s: { "a": 0, "k": [100, 100] }
        }
      }
    ]
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={StyleSheet.absoluteFill}
      />
      <IconButton
        icon="arrow-left"
        size={30}
        iconColor="#FFFFFF"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          }
        ]}
      >
        <BlurView intensity={20} style={styles.formContainer}>
          <View style={styles.header}>
            <LottieView
              source={require('../assets/animations/tree-grow.json')}
              autoPlay
              loop
              style={styles.animation}
              onError={() => {
                console.warn('Failed to load tree-grow animation, using fallback');
                return <LottieView source={fallbackAnimation} autoPlay loop style={styles.animation} />;
              }}
            />
            <Text style={styles.title}>Forest Focus</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back!' : 'Join our forest'}
            </Text>
          </View>

          {!isLogin && (
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: '#FFFFFF' }}}
              textColor="#FFFFFF"
              left={<TextInput.Icon icon="account" color="#FFFFFF" />}
            />
          )}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{ colors: { primary: '#FFFFFF' }}}
            textColor="#FFFFFF"
            left={<TextInput.Icon icon="email" color="#FFFFFF" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={!showPassword}
            theme={{ colors: { primary: '#FFFFFF' }}}
            textColor="#FFFFFF"
            left={<TextInput.Icon icon="lock" color="#FFFFFF" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                color="#FFFFFF"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            contentStyle={styles.buttonContent}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          <TouchableOpacity
            onPress={toggleMode}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('2%'),
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: wp('5%'),
  },
  formContainer: {
    padding: wp('5%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  animation: {
    width: wp('30%'),
    height: wp('30%'),
  },
  title: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: hp('2%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: hp('1%'),
  },
  input: {
    marginBottom: hp('2%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    marginTop: hp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#1B5E20',
  },
  buttonContent: {
    height: hp('6%'),
  },
  toggleContainer: {
    marginTop: hp('3%'),
    alignItems: 'center',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
  },
  errorText: {
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
}); 