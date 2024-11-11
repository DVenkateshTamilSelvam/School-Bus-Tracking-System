import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HelpPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help</Text>

      {/* Flow Overview */}
      <View style={styles.flowContainer}>
        <Text style={styles.flowText}>Route → Bus → Attender → Student</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.stepTitle}>Step 1: Create Route</Text>
        <Text style={styles.description}>
          <Text style={styles.bold}>Route ID</Text>: Numeric only, unique identifier for each route.{"\n"}
          <Text style={styles.bold}>Stop Number</Text>: Unique number for each stop on the route.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.stepTitle}>Step 2: Create Attender</Text>
        <Text style={styles.description}>
          <Text style={styles.bold}>Attender ID</Text>: Numeric only, unique identifier for each attender.{"\n"}
          <Text style={styles.bold}>Name</Text>: Alphabetic characters only.{"\n"}
          <Text style={styles.bold}>Contact Number</Text>: Numeric only.{"\n"}
          <Text style={styles.bold}>Age</Text>: Numeric only, valid age required.{"\n"}
          <Text style={styles.bold}>Address</Text>: Alphanumeric characters (e.g., Street 12, Apt 34).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.stepTitle}>Step 3: Create Bus</Text>
        <Text style={styles.description}>
          <Text style={styles.bold}>Bus Number</Text>: Alphanumeric, unique identifier for each bus.{"\n"}
          <Text style={styles.bold}>Route ID</Text>: Must match a pre-created route ID.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.stepTitle}>Step 4: Register Student</Text>
        <Text style={styles.description}>
          <Text style={styles.bold}>Student ID</Text>: Numeric only, unique for each student.{"\n"}
          <Text style={styles.bold}>Name</Text>: Alphabetic characters only.{"\n"}
          <Text style={styles.bold}>Password</Text>: Minimum of 8 characters, required for secure login.{"\n"}
          <Text style={styles.bold}>Attender ID</Text>: Pre-created attender ID must be selected.{"\n"}
          <Text style={styles.bold}>Bus ID</Text>: Pre-created bus ID must be selected.{"\n"}
          <Text style={styles.bold}>Route ID</Text>: Pre-created route ID must be selected.{"\n"}
          <Text style={styles.bold}>Parent Name</Text>: Alphabetic characters only.{"\n"}
          <Text style={styles.bold}>Parent Email</Text>: Valid email format required.{"\n"}
          <Text style={styles.bold}>Parent Contact Number</Text>: Numeric only, for communication.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.note}>
          Note: Each field has specific validation rules to ensure accurate and complete data entry.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  flowContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  flowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F46969',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HelpPage;
