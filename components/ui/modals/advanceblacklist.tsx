import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function AdvanceBlacklistContent() {
  const colors = Colors.light;

  const [blockByOption, setBlockByOption] = useState('country'); // 'country' ya 'series'
  const [countryCodeInput, setCountryCodeInput] = useState('');
  const [countryCodes, setCountryCodes] = useState([]);
  const [seriesInput, setSeriesInput] = useState('');
  const [numberSeries, setNumberSeries] = useState([]);
  const [blockAllExceptIndia, setBlockAllExceptIndia] = useState(false);

  const addCountryCode = () => {
    if (countryCodeInput.trim() === '') return;
    setCountryCodes([...countryCodes, countryCodeInput.trim()]);
    setCountryCodeInput('');
  };

  const removeCountryCode = (code) => {
    setCountryCodes(countryCodes.filter((c) => c !== code));
  };

  const addNumberSeries = () => {
    if (seriesInput.trim() === '') return;
    setNumberSeries([...numberSeries, seriesInput.trim()]);
    setSeriesInput('');
  };

  const removeNumberSeries = (series) => {
    setNumberSeries(numberSeries.filter((s) => s !== series));
  };

  return (
    <View>
      <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Add to blacklist by</Text>

      {/* Radio options */}
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setBlockByOption('country')}
        >
          <View
            style={[
              styles.radioCircle,
              { borderColor: blockByOption === 'country' ? colors.primary : colors.border },
            ]}
          >
            {blockByOption === 'country' && (
              <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
            )}
          </View>
          <Text style={[styles.radioLabel, { color: colors.text }]}>Country-code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setBlockByOption('series')}
        >
          <View
            style={[
              styles.radioCircle,
              { borderColor: blockByOption === 'series' ? colors.primary : colors.border },
            ]}
          >
            {blockByOption === 'series' && (
              <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
            )}
          </View>
          <Text style={[styles.radioLabel, { color: colors.text }]}>Number series</Text>
        </TouchableOpacity>
      </View>

      {/* Country code section */}
      {blockByOption === 'country' ? (
        <>
          <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Add by country-code</Text>

          <View style={[styles.codeInputRow, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.codeInput, { color: colors.text }]}
              placeholder="Enter country code (91, 44, 71)"
              placeholderTextColor={colors.border}
              value={countryCodeInput}
              onChangeText={setCountryCodeInput}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TouchableOpacity onPress={addCountryCode}>
              <Feather name="arrow-right" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {countryCodes.length > 0 && (
            <View style={styles.chipRow}>
              {countryCodes.map((code) => (
                <View key={code} style={[styles.chip, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.chipText, { color: colors.white }]}>{code}</Text>
                  <TouchableOpacity onPress={() => removeCountryCode(code)}>
                    <Feather name="x" size={14} color={colors.white} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setBlockAllExceptIndia(!blockAllExceptIndia)}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.border },
                blockAllExceptIndia && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              {blockAllExceptIndia && <Feather name="check" size={14} color={colors.white} />}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              Block all country codes except +91
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Number series section */}
          <Text style={[styles.sectionSubtitle, { color: colors.text }]}>Add by series</Text>

          <View style={[styles.codeInputRow, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.codeInput, { color: colors.text }]}
              placeholder="Enter number series (1321, 8249)"
              placeholderTextColor={colors.border}
              value={seriesInput}
              keyboardType="number-pad"
              onChangeText={setSeriesInput}
              maxLength={4}
            />
            <TouchableOpacity onPress={addNumberSeries}>
              <Feather name="arrow-right" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {numberSeries.length > 0 && (
            <View style={styles.chipRow}>
              {numberSeries.map((series) => (
                <View key={series} style={[styles.chip, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.chipText, { color: colors.white }]}>{series}</Text>
                  <TouchableOpacity onPress={() => removeNumberSeries(series)}>
                    <Feather name="x" size={14} color={colors.white} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <TouchableOpacity style={[styles.applyBtn, { backgroundColor: colors.primary }]}>
        <Text style={[styles.applyBtnText, { color: colors.white }]}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  radioLabel: {
      width:100,
    fontSize: 13,
    flexShrink: 1,
  },
  codeInputRow: {
      height:60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  codeInput: {
    flex: 1,
    fontSize: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 13,
    flex: 1,
    flexWrap: 'wrap',
  },
  applyBtn: {
    borderRadius: 99,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});